#!/usr/bin/env node
// PR이 열리거나 업데이트될 때 QA.md 기준으로 자동 리뷰를 작성합니다.
import Anthropic from '@anthropic-ai/sdk'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const { ANTHROPIC_API_KEY, GITHUB_TOKEN, PR_NUMBER, REPO, BASE_SHA, HEAD_SHA } = process.env

// 변경된 파일 목록
const changedFiles = execSync(`git diff --name-only ${BASE_SHA}..${HEAD_SHA}`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean)

const frontendFiles = changedFiles.filter(f => f.startsWith('frontend/src/'))
const diffTargets = frontendFiles.length > 0
  ? frontendFiles.map(f => `"${f}"`).join(' ')
  : changedFiles.map(f => `"${f}"`).join(' ')

// Diff 수집 (최대 12000자)
let diff = ''
try {
  diff = execSync(`git diff ${BASE_SHA}..${HEAD_SHA} -- ${diffTargets}`, {
    encoding: 'utf-8',
    maxBuffer: 4 * 1024 * 1024,
  })
} catch {
  diff = '(diff 수집 실패 — 파일 목록으로 대체)'
}

const MAX_DIFF = 12000
const diffBody = diff.length > MAX_DIFF
  ? diff.slice(0, MAX_DIFF) + '\n\n...(diff 너무 커서 잘림)'
  : diff

const qa = readFileSync('QA.md', 'utf-8')

// Claude 리뷰 생성
const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

const result = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 2048,
  system: `당신은 프론트엔드 QA 엔지니어입니다.
별꽃노리 프로젝트의 Figma 기준 QA 체크리스트를 기반으로 PR을 리뷰합니다.
리뷰는 한국어로, 간결하고 실용적으로 작성합니다.`,
  messages: [
    {
      role: 'user',
      content: `## QA 체크리스트 (QA.md)
${qa}

---

## 변경된 파일
${changedFiles.join('\n') || '(없음)'}

## Diff
\`\`\`diff
${diffBody}
\`\`\`

---

위 QA 체크리스트와 Diff를 대조해 PR을 리뷰해주세요.

다음 형식으로 작성하세요:

### 📋 영향받는 화면
- 화면 번호와 이름 나열

### ✅ 검증된 항목
- 항목번호: 항목명 — 확인 근거

### ❌ 미해결 / 새로운 문제
- 항목번호: 항목명 — 근거 (없으면 이 섹션 생략)

### ⚠️ 주의사항
- 있으면 작성, 없으면 이 섹션 생략

### 결론
**APPROVE** 또는 **REQUEST_CHANGES** + 한 줄 이유`,
    },
  ],
})

const reviewText = result.content[0].text

const comment = `## 🤖 Claude QA 리뷰

${reviewText}

---
*[QA.md](QA.md) 기준 자동 리뷰 · \`claude-sonnet-4-6\`*`

// GitHub PR 코멘트 게시
const res = await fetch(
  `https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}/comments`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ body: comment }),
  }
)

if (!res.ok) {
  const text = await res.text()
  console.error('GitHub API 오류:', text)
  process.exit(1)
}

console.log(`PR #${PR_NUMBER} 리뷰 게시 완료`)
