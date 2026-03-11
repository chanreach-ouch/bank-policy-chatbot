from fastapi import APIRouter, Depends, Header, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import create_access_token, decode_token, get_current_admin, verify_password
from app.db.models import Admin, RevokedToken
from app.db.session import get_db
from app.schemas import AdminLoginRequest, AdminLoginResponse, AdminSummary

router = APIRouter(prefix="/admin", tags=["admin-auth"])


@router.post("/login", response_model=AdminLoginResponse)
def login(payload: AdminLoginRequest, db: Session = Depends(get_db)) -> AdminLoginResponse:
    admin = db.query(Admin).filter(Admin.username == payload.username).first()
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(admin.username, admin.role)
    return AdminLoginResponse(
        access_token=token,
        admin=AdminSummary(id=admin.id, username=admin.username, role=admin.role, is_active=admin.is_active),
    )


@router.post("/logout")
def logout(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
) -> dict[str, str]:
    del current_admin
    if not authorization:
        return {"status": "ok"}
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        return {"status": "ok"}
    try:
        payload = decode_token(token)
        jti = payload.get("jti")
        if jti:
            exists = db.query(RevokedToken).filter(RevokedToken.jti == jti).first()
            if not exists:
                db.add(RevokedToken(jti=jti))
                db.commit()
    except JWTError:
        pass
    return {"status": "ok"}
