from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.fortune_service import get_flower

router = APIRouter()


class FlowerRequest(BaseModel):
    zodiac: str
    scores: dict  # {"relationship": int, "money": int, "work": int}


@router.post("/flower")
def flower(req: FlowerRequest):
    """별자리 + 운세 수치 → 꽃 추천 (이름/꽃말/행운/장소)"""
    try:
        return get_flower(req.zodiac, req.scores)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
