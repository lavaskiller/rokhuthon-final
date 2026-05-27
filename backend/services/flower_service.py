# flower_service.py는 fortune_service.py의 get_flower()로 통합되었습니다.
# 이 파일은 필요 시 꽃 이미지 관리 등 확장 로직을 위해 유지합니다.

from services.fortune_service import get_flower  # noqa: F401 — re-export
