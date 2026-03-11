from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Bank Policy Chatbot API"
    environment: str = "development"
    api_prefix: str = "/api"

    database_url: str = "sqlite:///./bank_policy.db"
    uploads_dir: str = "../uploads"
    vector_store_dir: str = "../vector_store"

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480

    admin_username: str = "admin"
    admin_password: str = "admin1234"

    max_upload_size_mb: int = 20

    embedding_model: str = "models/text-embedding-004"
    gemini_model: str = "gemini-2.0-flash"
    gemini_api_key: str = ""

    rag_top_k: int = 5
    rag_min_score: float = 0.22
    rate_limit_per_minute: int = 60

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def project_root(self) -> Path:
        return Path(__file__).resolve().parents[3]

    @property
    def uploads_path(self) -> Path:
        return (Path(__file__).resolve().parents[2] / self.uploads_dir).resolve()

    @property
    def vector_store_path(self) -> Path:
        return (Path(__file__).resolve().parents[2] / self.vector_store_dir).resolve()

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

