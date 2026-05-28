#!/usr/bin/env node
// claude CLI(CLAUDE_CODE_OAUTH_TOKEN) 로 QA.md 기준 PR 리뷰 후 코멘트 게시
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const { GH_TOKEN, PR_NUMBER, BASE_SHA, HEAD_SHA, GITHUB_REPOSITORY } = process.env

// diff 수집 (frontend/src 한정, 최대 10000자)
let diff = ''
try {
  diff = execSync(`git diff ${BASE_SHA}..${HEAD_SHA} -- frontend/src/`, {
    encoding: 'utf-8',
    maxBuffer: 4 * 1024 * 1024,
  })
} catch {
  diff = '(diff 수집 실패)'
}
if (diff.length > 10000) diff = diff.slice(0, 10000) + '\n...(truncated)'

const qa = readFileSync('QA.md', 'utf-8')

const prompt = `QA.md 체크리스트 기준으로 이 PR을 리뷰해줘.

## QA.md
${qa}

## Diff
\`\`\`diff
${diff}
\`\`\`

아래 형식으로 한국어 리뷰 작성:

### 📋 영향받는 화면
- 화면 번호와 이름

### ✅ 검증된 항목
- 항목번호: 항목명 — 확인 근거

### ❌ 미해결 / 새로운 문제
- 항목번호: 항목명 — 근거 (없으면 이 섹션 생략)

### ⚠️ 주의사항
- 있으면 작성, 없으면 생략

### 결론
**APPROVE** 또는 **REQUEST_CHANGES** + 한 줄 이유`

// claude CLI로 리뷰 생성 (stdin으로 프롬프트 전달)
let review
try {
  review = execSync('claude --print', {
    input: prompt,
    encoding: 'utf-8',
    timeout: 120_000,
  })
} catch (err) {
  console.error('claude CLI 실패:', err.message)
  process.exit(1)
}

// PR 코멘트 게시
const body = `## 🤖 Claude QA 리뷰\n\n${review.trim()}\n\n---\n*QA.md 기준 자동 리뷰 · Claude Code*`

const res = await fetch(
  `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ body }),
  }
)

if (!res.ok) {
  console.error('GitHub API 오류:', await res.text())
  process.exit(1)
}

console.log(`PR #${PR_NUMBER} 리뷰 게시 완료`)
