import re

SENTENCE_SPLIT_PATTERN = re.compile(r"(?<=[\.!?។៕])\s+")


def _split_sentences(text: str) -> list[str]:
    parts = [part.strip() for part in SENTENCE_SPLIT_PATTERN.split(text) if part.strip()]
    return parts or [text]


def chunk_text(text: str, chunk_size: int = 850, overlap: int = 120) -> list[str]:
    if not text.strip():
        return []
    if len(text) <= chunk_size:
        return [text.strip()]

    paragraphs = [paragraph.strip() for paragraph in text.split("\n\n") if paragraph.strip()]
    chunks: list[str] = []
    current = ""

    def flush_current() -> None:
        nonlocal current
        chunk = current.strip()
        if chunk:
            chunks.append(chunk)
        current = ""

    for paragraph in paragraphs:
        if len(paragraph) > chunk_size:
            sentences = _split_sentences(paragraph)
            for sentence in sentences:
                if len(current) + len(sentence) + 1 <= chunk_size:
                    current = f"{current} {sentence}".strip()
                else:
                    flush_current()
                    if len(sentence) > chunk_size:
                        start = 0
                        while start < len(sentence):
                            end = min(start + chunk_size, len(sentence))
                            slices = sentence[start:end].strip()
                            if slices:
                                chunks.append(slices)
                            start = end - overlap if end < len(sentence) else end
                    else:
                        current = sentence
        else:
            if len(current) + len(paragraph) + 2 <= chunk_size:
                separator = "\n\n" if current else ""
                current = f"{current}{separator}{paragraph}"
            else:
                previous = current.strip()
                flush_current()
                if previous:
                    tail = previous[-overlap:]
                    current = f"{tail} {paragraph}".strip()
                else:
                    current = paragraph

    flush_current()
    return chunks

