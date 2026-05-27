from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.fortune_service import get_zodiacs, get_fortune, get_lucky

router = APIRouter()


class FortuneRequest(BaseModel):
    zodiac: str


class LuckyRequest(BaseModel):
    zodiac: str


@router.get("/zodiacs")
def list_zodiacs():
    """12개 별자리 + 오늘의 순위 반환"""
    return get_zodiacs()


@router.post("/fortune")
def fortune(req: FortuneRequest):
    """별자리 → 오늘의 운세 (총운 텍스트 + 관계/금전/업무 수치)"""
    try:
        return get_fortune(req.zodiac)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/lucky")
def lucky(req: LuckyRequest):
    """별자리 → 오늘의 행운 요소 (장소/행동/색상)"""
    try:
        return get_lucky(req.zodiac)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
