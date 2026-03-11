from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.db.models import Admin, Document
from app.db.session import get_db
from app.schemas import DocumentSummary, ToggleDocumentRequest
from app.services.admin_service import delete_document, reindex_document, save_document_upload

router = APIRouter(prefix="/admin/documents", tags=["admin-documents"])


def _to_document_summary(document: Document) -> DocumentSummary:
    return DocumentSummary(
        id=document.id,
        title=document.title,
        original_filename=document.original_filename,
        file_type=document.file_type,
        category=document.category,
        version=document.version,
        status=document.status,
        is_active=document.is_active,
        chunk_count=document.chunk_count,
        indexing_status=document.indexing_status,
        created_at=document.created_at,
        updated_at=document.updated_at,
    )


@router.post("/upload", response_model=DocumentSummary)
async def upload_document(
    file: UploadFile = File(...),
    category: str | None = Form(None),
    version: str = Form("1.0"),
    status_label: str = Form("draft"),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
) -> DocumentSummary:
    document = await save_document_upload(
        db=db,
        file=file,
        uploaded_by=admin.id,
        category=category,
        version=version,
        status_label=status_label,
    )
    return _to_document_summary(document)


@router.get("", response_model=list[DocumentSummary])
def list_documents(
    search: str | None = None,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> list[DocumentSummary]:
    query = db.query(Document)
    if search:
        query = query.filter(
            or_(
                Document.title.ilike(f"%{search}%"),
                Document.original_filename.ilike(f"%{search}%"),
                Document.category.ilike(f"%{search}%"),
            )
        )
    documents = query.order_by(Document.updated_at.desc()).all()
    return [_to_document_summary(document) for document in documents]


@router.get("/{document_id}", response_model=DocumentSummary)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> DocumentSummary:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return _to_document_summary(document)


@router.delete("/{document_id}")
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, str]:
    delete_document(db, document_id)
    return {"status": "deleted"}


@router.post("/{document_id}/reindex", response_model=DocumentSummary)
def reindex(
    document_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> DocumentSummary:
    document = reindex_document(db, document_id)
    return _to_document_summary(document)


@router.patch("/{document_id}/toggle", response_model=DocumentSummary)
def toggle_document(
    document_id: int,
    payload: ToggleDocumentRequest,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> DocumentSummary:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    document.is_active = payload.is_active
    db.commit()
    db.refresh(document)
    return _to_document_summary(document)

