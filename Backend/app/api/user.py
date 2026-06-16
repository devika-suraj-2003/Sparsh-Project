from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.login import LoginRequest
from app.utils.security import verify_password

from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password

router = APIRouter()

@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    new_user = User(
        name=user.name,
        email=user.email,
        role_id=user.role_id,
        password_hash=hash_password(user.password),
        status="Active"
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User registered successfully"
    }

@router.post("/login")
def login_user(
    user: LoginRequest,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        return {"message": "Invalid Email"}

    if not verify_password(user.password, db_user.password_hash):
        return {"message": "Invalid Password"}

    return {
        "message": "Login Successful"
    }