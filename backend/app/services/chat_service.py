import json
from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models import ChatMessage, ChatSession
from app.services.embedding_service import EmbeddingService
from app.services.gemini_service import GeminiService
from app.services.intent_service import build_retrieval_query, build_simple_intent_reply, detect_simple_intent
from app.services.retriever import Retriever
from app.services.settings_service import get_settings_map
from app.utils.language import detect_language


class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()
        self.embedding_service = EmbeddingService()
        self.retriever = Retriever(db, self.embedding_service)
        self.gemini_service = GeminiService()

    def create_session(self, channel: str = "web_widget", language_hint: str = "en") -> ChatSession:
        session = ChatSession(session_token=uuid4().hex, channel=channel, user_language=language_hint)
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_or_create_session(self, session_token: str | None, channel: str) -> ChatSession:
        if session_token:
            existing = self.db.query(ChatSession).filter(ChatSession.session_token == session_token).first()
            if existing:
                return existing
        return self.create_session(channel=channel)

    def _get_previous_user_message(self, session_id: int) -> str | None:
        message = (
            self.db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id, ChatMessage.role == "user")
            .order_by(ChatMessage.id.desc())
            .offset(1)
            .first()
        )
        if not message:
            return None
        return message.message_text

    def process_message(self, session_token: str | None, message: str, channel: str = "web_widget") -> dict:
        settings_map = get_settings_map(self.db)
        chat_session = self.get_or_create_session(session_token, channel)
        language = detect_language(message)
        chat_session.user_language = language
        chat_session.updated_at = datetime.now(timezone.utc)
        self.db.add(chat_session)

        user_message = ChatMessage(
            session_id=chat_session.id,
            role="user",
            message_text=message,
            detected_language=language,
        )
        self.db.add(user_message)
        self.db.commit()

        fallback_message = (
            settings_map.get("fallback_message_km")
            if language == "km"
            else settings_map.get("fallback_message_en")
        )

        simple_intent = detect_simple_intent(message, language)
        if simple_intent:
            reply_language = language
            if simple_intent == "language_km":
                reply_language = "km"
                chat_session.user_language = "km"
            elif simple_intent == "language_en":
                reply_language = "en"
                chat_session.user_language = "en"

            answer = build_simple_intent_reply(simple_intent, reply_language)
            source_payload: list[dict] = []
            is_fallback = False
        else:
            retrieval_query = build_retrieval_query(
                message=message,
                language=language,
                previous_user_message=self._get_previous_user_message(chat_session.id),
            )
            retrieved = self.retriever.retrieve(
                retrieval_query,
                top_k=self.settings.rag_top_k,
                min_score=self.settings.rag_min_score,
            )

            source_payload = [
                {
                    "chunk_id": item.chunk_id,
                    "document_id": item.document_id,
                    "document_title": item.document_title,
                    "score": round(item.score, 4),
                }
                for item in retrieved
            ]

            if not retrieved:
                answer = fallback_message or "I do not have enough official policy information right now."
                is_fallback = True
            else:
                context = "\n\n".join(
                    [
                        f"[Source: {item.document_title} | score={item.score:.3f}]\n{item.chunk_text}"
                        for item in retrieved
                    ]
                )
                answer, used_local_fallback = self.gemini_service.generate_grounded_answer(
                    question=message,
                    language=language,
                    retrieved_context=context,
                    system_prompt=settings_map.get("system_prompt", ""),
                )
                is_fallback = used_local_fallback

        assistant_message = ChatMessage(
            session_id=chat_session.id,
            role="assistant",
            message_text=answer,
            detected_language=chat_session.user_language,
            retrieved_sources_json=json.dumps(source_payload, ensure_ascii=False),
            is_fallback=is_fallback,
        )
        self.db.add(assistant_message)
        self.db.commit()
        self.db.refresh(assistant_message)

        return {
            "session_token": chat_session.session_token,
            "language": chat_session.user_language,
            "answer": answer,
            "is_fallback": is_fallback,
            "sources": source_payload,
            "message_id": assistant_message.id,
        }
