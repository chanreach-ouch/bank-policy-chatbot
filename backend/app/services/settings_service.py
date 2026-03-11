from sqlalchemy.orm import Session

from app.db.models import SystemSetting

DEFAULT_SETTINGS: dict[str, str] = {
    "bot_display_name": "Bank Policy Assistant",
    "welcome_message_en": "Hello. I can help explain bank policies in English or Khmer. Ask me anything about KYC, loans, account opening, deposits, or cards.",
    "welcome_message_km": "សួស្តី! ខ្ញុំអាចជួយពន្យល់គោលការណ៍ធនាគារ ជាភាសាខ្មែរ ឬ English បាន។ អ្នកអាចសួរអំពី KYC កម្ចី បើកគណនី ប្រាក់បញ្ញើ ឬកាត។",
    "fallback_message_en": "I do not have enough official policy information to answer that confidently. Please contact a bank officer or customer support for official confirmation.",
    "fallback_message_km": "ខ្ញុំមិនទាន់មានព័ត៌មានគោលការណ៍ផ្លូវការគ្រប់គ្រាន់ក្នុងមូលដ្ឋានចំណេះដឹងបច្ចុប្បន្ន ដើម្បីឆ្លើយសំណួរនេះដោយភាពច្បាស់លាស់ទេ។ សូមទាក់ទងមន្ត្រីធនាគារ ឬផ្នែកសេវាអតិថិជន សម្រាប់ការបញ្ជាក់ផ្លូវការ។",
    "widget_primary_color": "#059669",
    "widget_position": "right",
    "bilingual_enabled": "true",
    "response_language_preference": "match_user",
    "system_prompt": (
        "You are an AI banking policy assistant for a bank website. "
        "Speak like a professional and approachable bank consultant. "
        "Answer only from provided policy context. "
        "Do not invent policy details. "
        "If context is insufficient, say so clearly and recommend contacting bank staff. "
        "Reply in the same language as the user question when possible. "
        "Keep the answer natural, clear, and human, not robotic."
    ),
}


def get_settings_map(db: Session) -> dict[str, str]:
    records = db.query(SystemSetting).all()
    settings_map = {record.setting_key: record.setting_value for record in records}
    for key, value in DEFAULT_SETTINGS.items():
        settings_map.setdefault(key, value)
    return settings_map


def upsert_settings(db: Session, updates: dict[str, str]) -> dict[str, str]:
    for key, value in updates.items():
        record = db.query(SystemSetting).filter(SystemSetting.setting_key == key).first()
        if record:
            record.setting_value = value
        else:
            db.add(SystemSetting(setting_key=key, setting_value=value))
    db.commit()
    return get_settings_map(db)
