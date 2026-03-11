from app.services.retriever import lexical_overlap_score


def test_lexical_overlap_score_downweights_stopwords() -> None:
    query = "What are the eligibility requirements for this loan policy?"
    irrelevant = "If the due diligence results are acceptable, the loan officer prepares a credit memo."
    relevant = "Eligibility Requirements. Borrowers must provide financial statements and a repayment plan."

    assert lexical_overlap_score(query, relevant) > lexical_overlap_score(query, irrelevant)
