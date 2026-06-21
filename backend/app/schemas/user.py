from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    college: str = None
    graduation_year: int = None
    target_role: str = None
    target_company: str = None
    created_at: datetime

    class Config:
        from_attributes = True