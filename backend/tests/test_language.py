from app.utils.language import detect_language


def test_detect_language_english() -> None:
    assert detect_language("What is the loan policy?") == "en"


def test_detect_language_khmer() -> None:
    assert detect_language("សួស្តី ខ្ញុំចង់ដឹងអំពីកម្ចី") == "km"

