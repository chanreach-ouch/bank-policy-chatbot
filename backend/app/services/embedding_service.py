import hashlib
import logging
import re
from typing import Literal

import numpy as np

from app.core.config import get_settings

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - optional external dependency failure
    genai = None

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._gemini_available = bool(self.settings.gemini_api_key and genai is not None)
        if self._gemini_available:
            genai.configure(api_key=self.settings.gemini_api_key)

    @staticmethod
    def _hash_embedding(text: str, dim: int = 256) -> list[float]:
        tokens = re.findall(r"\w+|[^\s\w]", text.lower(), flags=re.UNICODE)
        vector = np.zeros(dim, dtype=np.float32)
        if not tokens:
            return vector.tolist()

        for token in tokens:
            digest = hashlib.sha256(token.encode("utf-8")).hexdigest()
            index = int(digest, 16) % dim
            vector[index] += 1.0

        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm
        return vector.tolist()

    def _gemini_embed(self, text: str, mode: Literal["retrieval_document", "retrieval_query"]) -> list[float]:
        if genai is None:
            raise RuntimeError("Google Generative AI SDK is unavailable")
        response = genai.embed_content(
            model=self.settings.embedding_model,
            content=text,
            task_type=mode,
        )
        embedding = response.get("embedding")
        if not embedding:
            raise RuntimeError("Gemini embedding response was empty")
        return embedding

    def embed_document(self, text: str) -> list[float]:
        if self._gemini_available:
            try:
                return self._gemini_embed(text, "retrieval_document")
            except Exception:
                logger.exception("Gemini document embedding failed. Falling back to local hash embeddings.")
        return self._hash_embedding(text)

    def embed_query(self, text: str) -> list[float]:
        if self._gemini_available:
            try:
                return self._gemini_embed(text, "retrieval_query")
            except Exception:
                logger.exception("Gemini query embedding failed. Falling back to local hash embeddings.")
        return self._hash_embedding(text)
