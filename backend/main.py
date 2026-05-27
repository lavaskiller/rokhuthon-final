# ─────────────────────────────────────────────
# main.py — FastAPI 진입점
#
# 역할:
#   - FastAPI 앱 인스턴스 생성
#   - CORS 미들웨어 등록 (frontend origin 허용)
#   - 라우터 등록: /api/fortune, /api/lucky, /api/flower, /api/zodiacs
#   - 앱 실행: uvicorn main:app --reload
#
# 환경변수 (.env):
#   ANTHROPIC_API_KEY  — Claude API 인증 키
#   CORS_ORIGIN        — 프론트엔드 URL (기본 http://localhost:5173)
# ─────────────────────────────────────────────

# TODO: main.py 구현
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routers import fortune, flower, zodiacs
#
# app = FastAPI(title="별꽃노리 API")
# app.add_middleware(CORSMiddleware, ...)
# app.include_router(fortune.router, prefix="/api")
# app.include_router(flower.router, prefix="/api")
# app.include_router(zodiacs.router, prefix="/api")
