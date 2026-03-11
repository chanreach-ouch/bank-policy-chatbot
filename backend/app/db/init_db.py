from app.core.security import hash_password
from app.db.models import Admin, SystemSetting
from app.db.session import Base, engine, SessionLocal
from app.services.settings_service import DEFAULT_SETTINGS


def init_database(admin_username: str, admin_password: str) -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == admin_username).first()
        if not admin:
            admin = Admin(
                username=admin_username,
                password_hash=hash_password(admin_password),
                role="superadmin",
                is_active=True,
            )
            db.add(admin)

        for key, value in DEFAULT_SETTINGS.items():
            existing = db.query(SystemSetting).filter(SystemSetting.setting_key == key).first()
            if not existing:
                db.add(SystemSetting(setting_key=key, setting_value=value))
        db.commit()
    finally:
        db.close()

