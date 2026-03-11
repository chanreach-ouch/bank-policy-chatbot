import json
import re
from dataclasses import dataclass

import numpy as np
from sqlalchemy.orm import Session

from app.db.models import Document, DocumentChunk
from app.services.embedding_service import EmbeddingService

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "for",
    "how",
    "i",
    "is",
    "of",
    "on",
    "or",
    "the",
    "this",
    "to",
    "what",
    "when",
    "where",
    "which",
    "who",
    "why",
}


@dataclass
class RetrievedChunk:
    chunk_id: int
    document_id: int
    document_title: str
    chunk_text: str
    score: float
    metadata: dict


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    if not vec_a or not vec_b:
        return 0.0
    a = np.array(vec_a, dtype=np.float32)
    b = np.array(vec_b, dtype=np.float32)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


def _normalize_token(token: str) -> str:
    token = token.lower()
    if len(token) > 4 and token.endswith("ies"):
        return f"{token[:-3]}y"
    if len(token) > 3 and token.endswith("s") and not token.endswith("ss"):
        return token[:-1]
    return token


def _content_tokens(text: str) -> set[str]:
    tokens = {
        _normalize_token(token)
        for token in re.findall(r"\w+", text.lower(), flags=re.UNICODE)
    }
    return {token for token in tokens if len(token) > 2 and token not in STOPWORDS}


def _ordered_content_tokens(text: str) -> list[str]:
    tokens = [_normalize_token(token) for token in re.findall(r"\w+", text.lower(), flags=re.UNICODE)]
    return [token for token in tokens if len(token) > 2 and token not in STOPWORDS]


def lexical_overlap_score(query: str, text: str) -> float:
    query_tokens = _content_tokens(query)
    if not query_tokens:
        return 0.0
    text_tokens = _content_tokens(text)
    if not text_tokens:
        return 0.0
    overlap = query_tokens.intersection(text_tokens)
    base_score = len(overlap) / len(query_tokens)

    phrase_bonus = 0.0
    ordered_query_tokens = _ordered_content_tokens(query)
    normalized_text = " ".join(_ordered_content_tokens(text))
    for size in (3, 2):
        for index in range(len(ordered_query_tokens) - size + 1):
            phrase = " ".join(ordered_query_tokens[index : index + size])
            if phrase and phrase in normalized_text:
                phrase_bonus += 0.15 if size == 2 else 0.2

    return min(1.0, base_score + min(phrase_bonus, 0.35))


class Retriever:
    def __init__(self, db: Session, embedding_service: EmbeddingService) -> None:
        self.db = db
        self.embedding_service = embedding_service

    def retrieve(self, query: str, top_k: int = 5, min_score: float = 0.22) -> list[RetrievedChunk]:
        query_embedding = self.embedding_service.embed_query(query)
        rows = (
            self.db.query(DocumentChunk, Document)
            .join(Document, Document.id == DocumentChunk.document_id)
            .filter(Document.is_active.is_(True), Document.indexing_status == "indexed")
            .all()
        )

        scored: list[RetrievedChunk] = []
        for chunk, document in rows:
            try:
                embedding = json.loads(chunk.embedding_json)
            except json.JSONDecodeError:
                continue
            semantic_score = cosine_similarity(query_embedding, embedding)
            keyword_score = lexical_overlap_score(query, chunk.chunk_text) * 0.7
            score = semantic_score if keyword_score == 0 else (semantic_score * 0.45) + (keyword_score * 0.55)
            if score < min_score:
                continue
            try:
                metadata = json.loads(chunk.chunk_metadata or "{}")
            except json.JSONDecodeError:
                metadata = {}
            scored.append(
                RetrievedChunk(
                    chunk_id=chunk.id,
                    document_id=document.id,
                    document_title=document.title,
                    chunk_text=chunk.chunk_text,
                    score=score,
                    metadata=metadata,
                )
            )

        scored.sort(key=lambda item: item.score, reverse=True)
        unique_results: list[RetrievedChunk] = []
        seen_chunk_texts: set[str] = set()
        for item in scored:
            normalized_chunk = re.sub(r"\s+", " ", item.chunk_text).strip().lower()
            if normalized_chunk in seen_chunk_texts:
                continue
            seen_chunk_texts.add(normalized_chunk)
            unique_results.append(item)
            if len(unique_results) >= top_k:
                break
        return unique_results
