import json
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.models import Document, DocumentChunk, IndexingJob
from app.services.chunker import chunk_text
from app.services.document_parser import parse_document
from app.services.embedding_service import EmbeddingService


class IndexingService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.embedding_service = EmbeddingService()

    def index_document(self, document_id: int, force: bool = False) -> Document:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError("Document not found")

        job = IndexingJob(document_id=document.id, status="running", started_at=datetime.now(timezone.utc))
        self.db.add(job)
        document.indexing_status = "indexing"
        self.db.commit()

        try:
            file_path = Path(document.upload_path)
            extracted_text = parse_document(file_path, document.file_type)
            chunks = chunk_text(extracted_text)
            if not chunks:
                raise ValueError("No readable content found for indexing")

            if force:
                self.db.query(DocumentChunk).filter(DocumentChunk.document_id == document.id).delete()
                self.db.commit()

            for index, text_chunk in enumerate(chunks):
                embedding = self.embedding_service.embed_document(text_chunk)
                metadata = {"document_title": document.title, "chunk_index": index}
                chunk = DocumentChunk(
                    document_id=document.id,
                    chunk_index=index,
                    chunk_text=text_chunk,
                    chunk_metadata=json.dumps(metadata, ensure_ascii=False),
                    embedding_json=json.dumps(embedding),
                )
                self.db.add(chunk)

            document.chunk_count = len(chunks)
            document.indexing_status = "indexed"
            if document.status == "draft":
                document.status = "active"

            job.status = "completed"
            job.finished_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(document)
            return document
        except Exception as exc:
            document.indexing_status = "failed"
            job.status = "failed"
            job.error_message = str(exc)
            job.finished_at = datetime.now(timezone.utc)
            self.db.commit()
            raise

