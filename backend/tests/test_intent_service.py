from app.services.intent_service import build_retrieval_query, build_simple_intent_reply, detect_simple_intent


def test_detect_simple_intent_for_english_greeting() -> None:
    assert detect_simple_intent("hello", "en") == "greeting"


def test_detect_simple_intent_for_khmer_greeting() -> None:
    assert detect_simple_intent("សួស្តី!", "km") == "greeting"


def test_build_simple_intent_reply_is_chatty() -> None:
    reply = build_simple_intent_reply("greeting", "en")
    assert "bank policy" in reply.lower()


def test_detect_simple_intent_ignores_mixed_greeting_and_policy_request() -> None:
    assert detect_simple_intent("hello tell me detail about loans", "en") is None


def test_build_retrieval_query_uses_previous_message_for_follow_up() -> None:
    query = build_retrieval_query("tell me briefly", "en", previous_user_message="tell me about loan policy")
    assert "loan policy" in query


def test_build_retrieval_query_expands_broad_loan_request() -> None:
    query = build_retrieval_query("tell me about loan", "en")
    assert "eligibility requirements" in query


def test_detect_simple_intent_handles_stretched_greeting() -> None:
    assert detect_simple_intent("helllo", "en") == "greeting"


def test_detect_simple_intent_handles_language_switch() -> None:
    assert detect_simple_intent("Khmer", "en") == "language_km"
