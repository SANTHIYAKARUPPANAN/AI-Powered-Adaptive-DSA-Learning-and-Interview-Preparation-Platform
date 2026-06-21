from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest
from app.core.security import hash_password, verify_password, create_access_token
from fastapi import HTTPException, status

def signup_user(db: Session, data: SignupRequest):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        college=data.college,
        graduation_year=data.graduation_year,
        target_role=data.target_role,
        target_company=data.target_company
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def login_user(db: Session, data: LoginRequest):
    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check password
    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate JWT token
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

def reset_password(db: Session, email: str, new_password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    user.password = hash_password(new_password)
    db.commit()
    return {"message": "Password reset successful"}