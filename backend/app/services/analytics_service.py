import json
from collections import Counter
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.db.models import ChatMessage, ChatSession, Document


def build_analytics(db: Session) -> dict:
    total_documents = db.query(Document).count()
    active_policies = db.query(Document).filter(Document.is_active.is_(True)).count()
    indexed_chunks = sum(item.chunk_count for item in db.query(Document).all())

    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    last_7_days = now - timedelta(days=7)

    chats_today = db.query(ChatSession).filter(ChatSession.created_at >= today_start).count()
    recent_messages = db.query(ChatMessage).filter(ChatMessage.created_at >= last_7_days).all()
    fallback_count = sum(1 for message in recent_messages if message.is_fallback)
    fallback_rate = (fallback_count / len(recent_messages) * 100) if recent_messages else 0.0

    user_messages = [message for message in recent_messages if message.role == "user"]
    top_questions = Counter(message.message_text.strip() for message in user_messages if message.message_text.strip())
    top_questions_list = [{"question": question, "count": count} for question, count in top_questions.most_common(5)]

    language_counter = Counter(message.detected_language for message in user_messages)
    khmer_count = language_counter.get("km", 0)
    english_count = language_counter.get("en", 0)

    document_counter: Counter[str] = Counter()
    for message in recent_messages:
        if not message.retrieved_sources_json:
            continue
        try:
            sources = json.loads(message.retrieved_sources_json)
        except json.JSONDecodeError:
            continue
        for source in sources:
            title = source.get("document_title")
            if title:
                document_counter[title] += 1
    most_referenced_documents = [
        {"document_title": title, "count": count} for title, count in document_counter.most_common(5)
    ]

    return {
        "total_documents": total_documents,
        "active_policies": active_policies,
        "chats_today": chats_today,
        "fallback_rate": round(fallback_rate, 2),
        "indexed_chunks": indexed_chunks,
        "top_questions": top_questions_list,
        "most_referenced_documents": most_referenced_documents,
        "language_usage": {
            "khmer": khmer_count,
            "english": english_count,
            "total": khmer_count + english_count,
        },
    }

