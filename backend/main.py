import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import fortune, flower

app = FastAPI(title="별꽃노리 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fortune.router, prefix="/api")
app.include_router(flower.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
