import json
import re
import unicodedata
from pathlib import Path
from typing import Any

from pypdf import PdfReader

try:
    import docx  # type: ignore
except Exception:  # pragma: no cover - fallback branch
    docx = None


def normalize_text(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\x00", "")
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _flatten_json(value: Any, prefix: str = "") -> list[str]:
    lines: list[str] = []
    if isinstance(value, dict):
        for key, item in value.items():
            next_prefix = f"{prefix}.{key}" if prefix else str(key)
            lines.extend(_flatten_json(item, next_prefix))
    elif isinstance(value, list):
        for index, item in enumerate(value):
            next_prefix = f"{prefix}[{index}]"
            lines.extend(_flatten_json(item, next_prefix))
    else:
        line_prefix = f"{prefix}: " if prefix else ""
        lines.append(f"{line_prefix}{value}")
    return lines


def parse_pdf(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    chunks = [page.extract_text() or "" for page in reader.pages]
    return normalize_text("\n\n".join(chunks))


def parse_docx(file_path: Path) -> str:
    if docx is None:
        raise ValueError("python-docx is not installed. DOCX parsing is unavailable.")
    document = docx.Document(str(file_path))
    text = "\n".join(paragraph.text for paragraph in document.paragraphs if paragraph.text)
    return normalize_text(text)


def parse_doc(file_path: Path) -> str:
    try:
        import textract  # type: ignore
    except Exception as exc:  # pragma: no cover - optional dependency
        raise ValueError(
            "Legacy .doc parsing requires the optional `textract` package and system dependencies."
        ) from exc
    extracted = textract.process(str(file_path)).decode("utf-8", errors="ignore")
    return normalize_text(extracted)


def parse_json(file_path: Path) -> str:
    data = json.loads(file_path.read_text(encoding="utf-8"))
    flattened = _flatten_json(data)
    return normalize_text("\n".join(flattened))


def parse_text(file_path: Path) -> str:
    return normalize_text(file_path.read_text(encoding="utf-8", errors="ignore"))


def parse_document(file_path: Path, file_type: str) -> str:
    normalized_type = file_type.lower().strip(".")
    if normalized_type == "pdf":
        return parse_pdf(file_path)
    if normalized_type == "docx":
        return parse_docx(file_path)
    if normalized_type == "doc":
        return parse_doc(file_path)
    if normalized_type == "json":
        return parse_json(file_path)
    if normalized_type in {"txt", "md"}:
        return parse_text(file_path)
    raise ValueError(f"Unsupported file type: {file_type}")

