from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.db.models import Admin
from app.db.session import get_db
from app.schemas import SettingUpdateRequest
from app.services.settings_service import get_settings_map, upsert_settings

router = APIRouter(prefix="/admin/settings", tags=["admin-settings"])


@router.get("")
def get_settings(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict:
    return {"settings": get_settings_map(db)}


@router.patch("")
def update_settings(
    payload: SettingUpdateRequest,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict:
    return {"settings": upsert_settings(db, payload.settings)}

