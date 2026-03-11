from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_admin, hash_password
from app.db.models import Admin
from app.db.session import get_db
from app.schemas import CreateAdminUserRequest, UpdateAdminUserRequest

router = APIRouter(prefix="/admin/users", tags=["admin-users"])


@router.get("")
def list_admin_users(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> list[dict]:
    admins = db.query(Admin).order_by(Admin.created_at.desc()).all()
    return [
        {
            "id": admin.id,
            "username": admin.username,
            "role": admin.role,
            "is_active": admin.is_active,
            "created_at": admin.created_at,
        }
        for admin in admins
    ]


@router.post("")
def create_admin_user(
    payload: CreateAdminUserRequest,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict:
    existing = db.query(Admin).filter(Admin.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    admin = Admin(
        username=payload.username,
        password_hash=hash_password(payload.password),
        role=payload.role,
        is_active=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return {
        "id": admin.id,
        "username": admin.username,
        "role": admin.role,
        "is_active": admin.is_active,
        "created_at": admin.created_at,
    }


@router.patch("/{admin_id}")
def update_admin_user(
    admin_id: int,
    payload: UpdateAdminUserRequest,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict:
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin user not found")
    if payload.role is not None:
        admin.role = payload.role
    if payload.is_active is not None:
        admin.is_active = payload.is_active
    db.commit()
    db.refresh(admin)
    return {
        "id": admin.id,
        "username": admin.username,
        "role": admin.role,
        "is_active": admin.is_active,
        "created_at": admin.created_at,
    }

