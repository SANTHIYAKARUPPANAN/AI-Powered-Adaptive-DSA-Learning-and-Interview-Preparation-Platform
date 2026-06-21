from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, PasswordResetRequest
from app.schemas.user import UserResponse
from app.services.auth_service import signup_user, login_user, reset_password

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserResponse)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    return signup_user(db, data)

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, data)

@router.post("/reset-password")
def reset(data: PasswordResetRequest, db: Session = Depends(get_db)):
    return reset_password(db, data.email, data.new_password)