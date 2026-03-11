from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminSummary(BaseModel):
    id: int
    username: str
    role: str
    is_active: bool


class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminSummary


class ChatSessionCreateRequest(BaseModel):
    channel: str = "web_widget"
    language_hint: str = "en"


class ChatSessionResponse(BaseModel):
    session_token: str
    welcome_message: str


class ChatMessageRequest(BaseModel):
    session_token: str | None = None
    message: str = Field(min_length=1, max_length=4000)
    channel: str = "web_widget"


class ChatMessageResponse(BaseModel):
    session_token: str
    language: str
    answer: str
    is_fallback: bool
    sources: list[dict[str, Any]]
    message_id: int


class DocumentSummary(BaseModel):
    id: int
    title: str
    original_filename: str
    file_type: str
    category: str | None
    version: str
    status: str
    is_active: bool
    chunk_count: int
    indexing_status: str
    created_at: datetime
    updated_at: datetime


class ToggleDocumentRequest(BaseModel):
    is_active: bool


class SettingUpdateRequest(BaseModel):
    settings: dict[str, str]


class ChatLogMessage(BaseModel):
    id: int
    role: str
    text: str
    language: str
    created_at: datetime
    is_fallback: bool
    sources: list[dict[str, Any]]


class ChatLogSession(BaseModel):
    id: int
    session_token: str
    user_language: str
    channel: str
    created_at: datetime
    updated_at: datetime
    messages: list[ChatLogMessage]


class CreateAdminUserRequest(BaseModel):
    username: str
    password: str = Field(min_length=8)
    role: str = "admin"


class UpdateAdminUserRequest(BaseModel):
    role: str | None = None
    is_active: bool | None = None

