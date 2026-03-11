from app.services.gemini_service import GeminiService


def test_fallback_local_answer_uses_relevant_policy_text() -> None:
    retrieved_context = (
        "[Source: Loan Policy | score=0.413]\n"
        "TABLE OF CONTENTS I. Purpose of this Policy II. Eligibility III. Loan Products\n\n"
        "[Source: Loan Policy | score=0.401]\n"
        "Eligibility Requirements. Applicants must be active businesses operating for at least 12 months. "
        "They must provide two years of financial statements and a repayment plan."
    )

    answer = GeminiService._fallback_local_answer(
        "What are the eligibility requirements?",
        "en",
        retrieved_context,
    )

    assert "Applicants must be active businesses operating for at least 12 months." in answer
    assert "[Source:" not in answer


def test_fallback_local_answer_formats_requirement_lists_naturally() -> None:
    retrieved_context = (
        "[Source: kyc_policy | score=0.467]\n"
        "policy_name: Customer KYC Requirements "
        "effective_date: 2026-01-10 "
        "requirements[0]: Valid government-issued identity card or passport "
        "requirements[1]: Recent proof of address dated within the last 90 days "
        "requirements[2]: Customer contact information and occupation details "
        "requirements[3]: Source of funds declaration for high-risk accounts"
    )

    answer = GeminiService._fallback_local_answer(
        "What are the KYC requirements?",
        "en",
        retrieved_context,
    )

    assert "the main requirements are" in answer.lower()
    assert "Valid government-issued identity card or passport" in answer


def test_fallback_local_answer_can_summarize_policy_overview_from_toc() -> None:
    retrieved_context = (
        "[Source: Loan Policy | score=0.500]\n"
        "TABLE OF CONTENTS "
        "I. Purpose of this Policy "
        "II. Mission and Purpose of Financing "
        "III. Eligibility "
        "IV. Loan Products "
        "V. Portfolio Diversification "
        "VI. Loan Staff and Loan Committees "
        "VII. Loan Underwriting "
        "VIII. Loan Approval "
    )

    answer = GeminiService._fallback_local_answer(
        "tell me about loan policy",
        "en",
        retrieved_context,
    )

    assert "mainly covers" in answer.lower()
    assert "Eligibility" in answer


def test_fallback_local_answer_sounds_more_consultative() -> None:
    retrieved_context = "[Source: Loan Policy | score=0.500]\nLoan products include working capital, equipment purchase, and refinancing."

    answer = GeminiService._fallback_local_answer(
        "tell me about loan products",
        "en",
        retrieved_context,
    )

    assert "here’s the short version" in answer.lower()
    assert "If you want" in answer
