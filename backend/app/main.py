from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import (
    admin_analytics,
    admin_auth,
    admin_chats,
    admin_documents,
    admin_settings,
    admin_users,
    chat,
    widget,
)
from app.core.config import get_settings
from app.core.rate_limit import SimpleRateLimitMiddleware
from app.db.init_db import init_database

settings = get_settings()


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(SimpleRateLimitMiddleware, max_requests_per_minute=settings.rate_limit_per_minute)

    static_dir = Path(__file__).resolve().parent / "static"
    if static_dir.exists():
        app.mount("/static", StaticFiles(directory=static_dir), name="static")

    api_prefix = settings.api_prefix
    app.include_router(chat.router, prefix=api_prefix)
    app.include_router(widget.router, prefix=api_prefix)
    app.include_router(admin_auth.router, prefix=api_prefix)
    app.include_router(admin_documents.router, prefix=api_prefix)
    app.include_router(admin_chats.router, prefix=api_prefix)
    app.include_router(admin_analytics.router, prefix=api_prefix)
    app.include_router(admin_settings.router, prefix=api_prefix)
    app.include_router(admin_users.router, prefix=api_prefix)

    @app.on_event("startup")
    def on_startup() -> None:
        settings.uploads_path.mkdir(parents=True, exist_ok=True)
        settings.vector_store_path.mkdir(parents=True, exist_ok=True)
        init_database(admin_username=settings.admin_username, admin_password=settings.admin_password)

    @app.get("/")
    def root() -> dict[str, str]:
        return {"message": "Bank Policy Chatbot API is running."}

    return app


app = create_app()
