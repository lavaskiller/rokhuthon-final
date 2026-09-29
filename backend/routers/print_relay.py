"""
출력 중계 — 키오스크(아이패드) 브라우저는 HTTPS 페이지에서 매장 LAN 의 HTTP 프린터 에이전트를
직접 부를 수 없으므로(혼합 콘텐츠 차단), 카드 PNG 를 여기 올리고 라즈베리파이 에이전트가 가져가 출력한다.

    키오스크  POST /api/print            (X-Kiosk-Key)         → {id}
    키오스크  GET  /api/print/{id}       (X-Kiosk-Key)         → {status, error}
    에이전트  GET  /api/print/next       (Bearer 토큰, 롱폴링) → PNG + X-Job-Id / 204
    에이전트  POST /api/print/{id}/done  (Bearer 토큰)         → {ok}

작업 큐는 프로세스 메모리 — 백엔드는 단일 인스턴스로 운영한다는 전제.
"""

import asyncio
import os
import secrets
import time
from dataclasses import dataclass, field

from fastapi import APIRouter, Header, HTTPException, Request, Response
from pydantic import BaseModel

router = APIRouter(prefix="/print", tags=["print"])

KIOSK_KEY = os.getenv("PRINT_KIOSK_KEY", "")
AGENT_TOKEN = os.getenv("PRINT_AGENT_TOKEN", "")
MAX_BYTES = 5 * 1024 * 1024
JOB_TTL = 90          # 이 시간 안에 에이전트가 안 가져가면 폐기 — 파이가 늦게 켜져도 지난 카드가 쏟아지지 않도록
AGENT_STALE = 45      # 마지막 폴링 후 이 시간이 지나면 프린터 오프라인으로 간주
POLL_WAIT_MAX = 25


@dataclass
class Job:
    id: str
    png: bytes
    created: float = field(default_factory=time.time)
    status: str = "queued"  # queued | printing | done | error | expired
    error: str = ""


_jobs: dict[str, Job] = {}
_queue: asyncio.Queue[str] = asyncio.Queue()
_agent_seen = 0.0


def _check(value: str | None, expected: str) -> None:
    if not expected:
        raise HTTPException(503, "출력 기능이 설정되지 않았습니다")
    if not value or not secrets.compare_digest(value, expected):
        raise HTTPException(401, "인증 실패")


def _bearer(authorization: str | None) -> str | None:
    if authorization and authorization.lower().startswith("bearer "):
        return authorization[7:]
    return None


def _gc() -> None:
    now = time.time()
    for job in list(_jobs.values()):
        if job.status == "queued" and now - job.created > JOB_TTL:
            job.status, job.error = "expired", "프린터가 응답하지 않아요"
        if now - job.created > 600:
            _jobs.pop(job.id, None)


# ── 키오스크 ─────────────────────────────────
@router.post("")
async def submit(request: Request, x_kiosk_key: str | None = Header(None)):
    _check(x_kiosk_key, KIOSK_KEY)
    _gc()
    if time.time() - _agent_seen > AGENT_STALE:
        raise HTTPException(503, "프린터가 연결되어 있지 않아요 — 전원과 인터넷을 확인해 주세요")
    body = await request.body()
    if not body or len(body) > MAX_BYTES:
        raise HTTPException(400, "빈 요청이거나 이미지가 너무 큽니다")
    if not body.startswith(b"\x89PNG"):
        raise HTTPException(415, "PNG 이미지만 지원합니다")
    job = Job(id=secrets.token_urlsafe(9), png=body)
    _jobs[job.id] = job
    await _queue.put(job.id)
    return {"id": job.id}


# ── 에이전트 ─────────────────────────────────
# /next 는 /{job_id} 보다 먼저 선언해야 경로 매칭에서 가려지지 않음
@router.get("/next", include_in_schema=False)
async def next_job(wait: int = 20, authorization: str | None = Header(None)):
    """다음 작업을 롱폴링으로 전달 — 대기 중에도 에이전트 생존 신호로 취급."""
    global _agent_seen
    _check(_bearer(authorization), AGENT_TOKEN)
    deadline = time.monotonic() + max(0, min(wait, POLL_WAIT_MAX))
    while True:
        _agent_seen = time.time()
        _gc()
        try:
            job_id = await asyncio.wait_for(_queue.get(), timeout=max(0.0, min(5.0, deadline - time.monotonic())))
        except asyncio.TimeoutError:
            if time.monotonic() >= deadline:
                return Response(status_code=204)
            continue
        job = _jobs.get(job_id)
        if job and job.status == "queued":
            job.status = "printing"
            return Response(job.png, media_type="image/png", headers={"X-Job-Id": job.id})


@router.get("/{job_id}")
def job_status(job_id: str, x_kiosk_key: str | None = Header(None)):
    _check(x_kiosk_key, KIOSK_KEY)
    _gc()
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(404, "출력 작업을 찾을 수 없습니다")
    return {"status": job.status, "error": job.error}


class DoneBody(BaseModel):
    ok: bool
    error: str = ""


@router.post("/{job_id}/done", include_in_schema=False)
def job_done(job_id: str, body: DoneBody, authorization: str | None = Header(None)):
    _check(_bearer(authorization), AGENT_TOKEN)
    job = _jobs.get(job_id)
    if job:
        job.status = "done" if body.ok else "error"
        job.error = body.error[:200]
        job.png = b""
    return {"ok": True}
