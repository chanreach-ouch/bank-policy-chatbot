from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas import (
    ChatMessageRequest,
    ChatMessageResponse,
    ChatSessionCreateRequest,
    ChatSessionResponse,
)
from app.services.chat_service import ChatService
from app.services.settings_service import get_settings_map

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/session", response_model=ChatSessionResponse)
def create_session(payload: ChatSessionCreateRequest, db: Session = Depends(get_db)) -> ChatSessionResponse:
    service = ChatService(db)
    session = service.create_session(channel=payload.channel, language_hint=payload.language_hint)
    settings = get_settings_map(db)
    welcome = settings["welcome_message_km"] if payload.language_hint == "km" else settings["welcome_message_en"]
    return ChatSessionResponse(session_token=session.session_token, welcome_message=welcome)


@router.post("/message", response_model=ChatMessageResponse)
def post_message(payload: ChatMessageRequest, db: Session = Depends(get_db)) -> ChatMessageResponse:
    service = ChatService(db)
    result = service.process_message(
        session_token=payload.session_token,
        message=payload.message,
        channel=payload.channel,
    )
    return ChatMessageResponse(**result)

