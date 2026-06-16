from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from services.fortune_service import load_flower_config, save_flower_config
from data.flower_table import FLOWER_OPTIONS

router = APIRouter(prefix="/admin", tags=["admin"])


class FlowerConfigUpdate(BaseModel):
    money: int | None = None
    relationship: int | None = None
    work: int | None = None

    @field_validator("money", "relationship", "work", mode="before")
    @classmethod
    def check_range(cls, v, info):
        if v is None:
            return v
        fortune_type = info.field_name
        max_idx = len(FLOWER_OPTIONS.get(fortune_type, [])) - 1
        if not (0 <= v <= max_idx):
            raise ValueError(f"{fortune_type} index must be 0–{max_idx}")
        return v


@router.get("/flower-config")
def get_flower_config():
    """현재 꽃 설정 + 각 타입별 옵션 목록 반환"""
    config = load_flower_config()
    options = {
        fortune_type: [
            {"index": i, "name": f["name"], "image": f["image"]}
            for i, f in enumerate(flowers)
        ]
        for fortune_type, flowers in FLOWER_OPTIONS.items()
    }
    return {"config": config, "options": options}


@router.put("/flower-config")
def update_flower_config(body: FlowerConfigUpdate):
    """꽃 설정 업데이트 (일부 필드만 전달해도 됨)"""
    config = load_flower_config()
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="변경할 항목이 없습니다")
    config.update(updates)
    save_flower_config(config)
    return {"ok": True, "config": config}
