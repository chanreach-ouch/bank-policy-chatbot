import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_current_admin
from app.db.models import Admin, ChatSession
from app.db.session import get_db
from app.schemas import ChatLogMessage, ChatLogSession

router = APIRouter(prefix="/admin/chats", tags=["admin-chats"])


def _serialize_session(session: ChatSession) -> ChatLogSession:
    messages = []
    for message in sorted(session.messages, key=lambda item: item.created_at):
        try:
            sources = json.loads(message.retrieved_sources_json) if message.retrieved_sources_json else []
        except json.JSONDecodeError:
            sources = []
        messages.append(
            ChatLogMessage(
                id=message.id,
                role=message.role,
                text=message.message_text,
                language=message.detected_language,
                created_at=message.created_at,
                is_fallback=message.is_fallback,
                sources=sources,
            )
        )
    return ChatLogSession(
        id=session.id,
        session_token=session.session_token,
        user_language=session.user_language,
        channel=session.channel,
        created_at=session.created_at,
        updated_at=session.updated_at,
        messages=messages,
    )


@router.get("", response_model=list[ChatLogSession])
def list_chats(
    search: str | None = None,
    language: str | None = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> list[ChatLogSession]:
    query = db.query(ChatSession).options(joinedload(ChatSession.messages))
    if language:
        query = query.filter(ChatSession.user_language == language)
    sessions = query.order_by(ChatSession.updated_at.desc()).limit(limit).all()
    serialized = [_serialize_session(session) for session in sessions]
    if search:
        needle = search.lower()
        serialized = [
            item
            for item in serialized
            if any(needle in message.text.lower() for message in item.messages)
        ]
    return serialized


@router.get("/{session_id}", response_model=ChatLogSession)
def get_chat(
    session_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> ChatLogSession:
    session = (
        db.query(ChatSession)
        .options(joinedload(ChatSession.messages))
        .filter(ChatSession.id == session_id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")
    return _serialize_session(session)

