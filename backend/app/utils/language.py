import re

KHMER_RANGE = re.compile(r"[\u1780-\u17FF]")


def detect_language(text: str) -> str:
    khmer_chars = len(KHMER_RANGE.findall(text))
    latin_chars = len(re.findall(r"[A-Za-z]", text))
    if khmer_chars == 0 and latin_chars == 0:
        return "en"
    if khmer_chars >= latin_chars:
        return "km"
    return "en"

