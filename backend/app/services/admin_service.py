import hashlib
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models import Document
from app.services.indexing_service import IndexingService

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "json", "txt", "md"}


def _extract_extension(filename: str) -> str:
    if "." not in filename:
        return ""
    return filename.rsplit(".", 1)[-1].lower()


async def save_document_upload(
    db: Session,
    file: UploadFile,
    uploaded_by: int,
    category: str | None,
    version: str,
    status_label: str,
) -> Document:
    settings = get_settings()
    extension = _extract_extension(file.filename or "")
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    content = await file.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size is {settings.max_upload_size_mb} MB.",
        )

    checksum = hashlib.sha256(content).hexdigest()
    existing = db.query(Document).filter(Document.checksum == checksum).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This document has already been uploaded. Re-index the existing document if needed.",
        )

    storage_name = f"{uuid4().hex}.{extension}"
    upload_path = settings.uploads_path / storage_name
    upload_path.parent.mkdir(parents=True, exist_ok=True)
    upload_path.write_bytes(content)

    title = Path(file.filename or storage_name).stem
    document = Document(
        title=title,
        original_filename=file.filename or storage_name,
        file_type=extension,
        category=category,
        version=version or "1.0",
        status=status_label or "draft",
        is_active=True,
        upload_path=str(upload_path),
        checksum=checksum,
        uploaded_by=uploaded_by,
        indexing_status="pending",
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    indexing_service = IndexingService(db)
    indexing_service.index_document(document.id, force=True)
    db.refresh(document)
    return document


def delete_document(db: Session, document_id: int) -> None:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    file_path = Path(document.upload_path)
    if file_path.exists():
        file_path.unlink(missing_ok=True)
    db.delete(document)
    db.commit()


def reindex_document(db: Session, document_id: int) -> Document:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    service = IndexingService(db)
    return service.index_document(document_id, force=True)
