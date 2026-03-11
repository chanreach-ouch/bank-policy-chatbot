from app.services.chunker import chunk_text


def test_chunk_text_returns_multiple_chunks_for_long_text() -> None:
    text = " ".join(["policy"] * 2000)
    chunks = chunk_text(text, chunk_size=300, overlap=40)
    assert len(chunks) > 1
    assert all(chunk.strip() for chunk in chunks)

