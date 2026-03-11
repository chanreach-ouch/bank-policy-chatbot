import re


ENGLISH_GREETINGS = {
    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "greeting",
}
ENGLISH_THANKS = {"thanks", "thank you", "thx"}
ENGLISH_HELP = {"help", "what can you do", "how can you help"}
ENGLISH_BYE = {"bye", "goodbye", "see you"}
ENGLISH_CONFUSION = {"huh", "what", "what?", "pardon", "i dont understand", "i don't understand"}
ENGLISH_FOLLOW_UP = {
    "tell me more",
    "tell me briefly",
    "tell me in brief",
    "briefly",
    "in brief",
    "more detail",
    "more details",
    "detail",
    "details",
    "summarize",
    "summary",
    "explain more",
    "what about it",
}
ENGLISH_POLICY_KEYWORDS = {
    "account",
    "borrower",
    "card",
    "compliance",
    "deposit",
    "interest",
    "kyc",
    "loan",
    "loans",
    "laon",
    "laons",
    "opening",
    "policy",
    "requirement",
    "requirements",
}

KHMER_GREETINGS = {"សួស្តី", "ជំរាបសួរ"}
KHMER_THANKS = {"អរគុណ"}
KHMER_HELP = {"ជួយ", "អាចជួយអ្វីបានខ្លះ"}
KHMER_BYE = {"លាហើយ"}
KHMER_CONFUSION = {"ហ៊ឹម", "អ្វី", "មិនយល់"}
KHMER_FOLLOW_UP = {"ពន្យល់បន្ថែម", "សង្ខេប", "ខ្លីៗ", "លម្អិត"}
KHMER_POLICY_KEYWORDS = {"កម្ចី", "គណនី", "កាត", "ប្រាក់បញ្ញើ", "គោលការណ៍", "ឯកសារ", "អត្តសញ្ញាណ"}
ENGLISH_LANGUAGE_SWITCH_KM = {"khmer", "in khmer", "speak khmer", "reply in khmer"}
ENGLISH_LANGUAGE_SWITCH_EN = {"english", "in english", "speak english", "reply in english"}


def _normalize_text(text: str) -> str:
    normalized = re.sub(r"\s+", " ", text.strip().lower())
    return normalized.strip("!.?,;: ")


def _normalize_for_intent(text: str) -> str:
    normalized = _normalize_text(text)
    # Treat stretched greetings like "helllo" or "heyyy" as normal chat inputs.
    return re.sub(r"([a-z])\1{2,}", r"\1\1", normalized)


def _word_count(text: str) -> int:
    return len([token for token in re.split(r"\s+", text) if token])


def _contains_any(text: str, phrases: set[str]) -> bool:
    return any(phrase in text for phrase in phrases)


def _matches_simple_phrase(text: str, phrases: set[str]) -> bool:
    return text in phrases


def has_policy_keywords(message: str, language: str) -> bool:
    normalized = _normalize_text(message)
    keywords = KHMER_POLICY_KEYWORDS if language == "km" else ENGLISH_POLICY_KEYWORDS
    return _contains_any(normalized, keywords)


def detect_simple_intent(message: str, language: str) -> str | None:
    normalized = _normalize_for_intent(message)
    if not normalized:
        return None

    if has_policy_keywords(normalized, language) and _word_count(normalized) > 1:
        return None

    if language == "km":
        if _matches_simple_phrase(normalized, KHMER_GREETINGS):
            return "greeting"
        if _matches_simple_phrase(normalized, KHMER_THANKS):
            return "thanks"
        if _matches_simple_phrase(normalized, KHMER_HELP):
            return "help"
        if _matches_simple_phrase(normalized, KHMER_BYE):
            return "bye"
        if _matches_simple_phrase(normalized, KHMER_CONFUSION):
            return "clarify"
        return None

    if _matches_simple_phrase(normalized, ENGLISH_GREETINGS):
        return "greeting"
    if _matches_simple_phrase(normalized, ENGLISH_THANKS):
        return "thanks"
    if _matches_simple_phrase(normalized, ENGLISH_HELP):
        return "help"
    if _matches_simple_phrase(normalized, ENGLISH_BYE):
        return "bye"
    if _matches_simple_phrase(normalized, ENGLISH_CONFUSION):
        return "clarify"
    if _matches_simple_phrase(normalized, ENGLISH_LANGUAGE_SWITCH_KM):
        return "language_km"
    if _matches_simple_phrase(normalized, ENGLISH_LANGUAGE_SWITCH_EN):
        return "language_en"
    return None


def is_follow_up_message(message: str, language: str) -> bool:
    normalized = _normalize_text(message)
    if not normalized:
        return False
    phrases = KHMER_FOLLOW_UP if language == "km" else ENGLISH_FOLLOW_UP
    return _matches_simple_phrase(normalized, phrases)


def build_retrieval_query(message: str, language: str, previous_user_message: str | None = None) -> str:
    normalized = _normalize_text(message)
    normalized = re.sub(r"^(hello|hi|hey)\s+", "", normalized)
    normalized = normalized.replace("laons", "loans").replace("laon", "loan")
    if previous_user_message and is_follow_up_message(message, language):
        previous_normalized = _normalize_text(previous_user_message)
        normalized = f"{previous_normalized} {normalized}".strip()

    if language == "en":
        if _contains_any(normalized, {"loan", "loans", "laon", "laons"}) and _contains_any(
            normalized, {"tell me about", "about", "overview", "detail", "details", "briefly"}
        ):
            return (
                f"{normalized} loan policy overview purpose eligibility requirements loan products underwriting approval repayment"
            )
        if "kyc" in normalized and _contains_any(normalized, {"what", "requirement", "requirements", "detail"}):
            return f"{normalized} kyc identity address documents requirements due diligence"
    return normalized or message


def build_simple_intent_reply(intent: str, language: str) -> str:
    if language == "km":
        replies = {
            "greeting": "សួស្តី! ខ្ញុំអាចជួយអ្នកដូចជាអ្នកប្រឹក្សាធនាគារ មួយរូប បាន។ អ្នកអាចសួរអំពី KYC កម្ចី បើកគណនី ប្រាក់បញ្ញើ ឬកាត។",
            "thanks": "ដោយក្តីរីករាយ។ បើអ្នកចង់ ខ្ញុំអាចបន្តពន្យល់លម្អិតអំពីគោលការណ៍ធនាគារដែលអ្នកចាប់អារម្មណ៍។",
            "help": "ខ្ញុំអាចជួយពន្យល់គោលការណ៍ធនាគារឲ្យងាយយល់ ដូចជា KYC កម្ចី បើកគណនី ប្រាក់បញ្ញើ និងកាត។",
            "bye": "លាហើយ! បើអ្នកត្រូវការជំនួយអំពីគោលការណ៍ធនាគារវិញ អ្នកអាចសួរខ្ញុំម្តងទៀតបានគ្រប់ពេល។",
            "clarify": "សូមប្រាប់ខ្ញុំបន្តិចបន្ថែមថាអ្នកចង់ដឹងអំពីអ្វី។ ឧទាហរណ៍ អ្នកអាចសួរអំពី KYC កម្ចី ឬការបើកគណនី។",
            "language_km": "បានណាស់។ ចាប់ពីនេះទៅ ខ្ញុំនឹងព្យាយាមឆ្លើយជាភាសាខ្មែរ។ សូមសួរសំណួរគោលការណ៍ដែលអ្នកចង់ដឹងបាន។",
            "language_en": "បានណាស់។ ខ្ញុំអាចឆ្លើយជាភាសាអង់គ្លេសបានផងដែរ។ សូមសួរសំណួរដែលអ្នកចង់ដឹងបាន។",
        }
        return replies[intent]

    replies = {
        "greeting": "Hello. I can help like a bank policy consultant. You can ask me about KYC, loans, account opening, deposits, or cards.",
        "thanks": "You’re welcome. If you want, I can keep walking you through the policy details.",
        "help": "I can help explain bank policies in a more practical way, including KYC, loan policy, account opening, deposits, and cards.",
        "bye": "Goodbye. If you need help with bank policy again, I’ll be here.",
        "clarify": "Could you tell me a bit more about what you want to know? For example, you can ask about KYC, loans, deposits, cards, or account opening.",
        "language_km": "Sure. I can reply in Khmer. Please ask the policy question you want help with.",
        "language_en": "Sure. I can reply in English. Please ask the policy question you want help with.",
    }
    return replies[intent]
