from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.db.models import Admin
from app.db.session import get_db


def get_db_session(db: Session = Depends(get_db)) -> Session:
    return db


def get_admin_user(admin: Admin = Depends(get_current_admin)) -> Admin:
    return admin
