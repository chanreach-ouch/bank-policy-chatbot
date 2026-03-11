from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.db.models import Admin
from app.db.session import get_db
from app.services.analytics_service import build_analytics

router = APIRouter(prefix="/admin/analytics", tags=["admin-analytics"])


@router.get("")
def analytics(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict:
    return build_analytics(db)

