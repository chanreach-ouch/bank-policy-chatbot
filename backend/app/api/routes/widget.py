from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.settings_service import get_settings_map

router = APIRouter(prefix="/widget", tags=["widget"])


@router.get("/config")
def widget_config(db: Session = Depends(get_db)) -> dict:
    settings = get_settings_map(db)
    return {
        "bot_display_name": settings.get("bot_display_name"),
        "welcome_message_en": settings.get("welcome_message_en"),
        "welcome_message_km": settings.get("welcome_message_km"),
        "fallback_message_en": settings.get("fallback_message_en"),
        "fallback_message_km": settings.get("fallback_message_km"),
        "widget_primary_color": settings.get("widget_primary_color"),
        "widget_position": settings.get("widget_position", "right"),
        "bilingual_enabled": settings.get("bilingual_enabled", "true"),
        "quick_actions": [
            "Loan policy",
            "Account opening",
            "Deposit policy",
            "KYC requirements",
            "Card policy",
            "Contact support",
        ],
    }

