from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NoteCreate(BaseModel):
    user_id: int
    question_id: int
    key_idea: Optional[str] = None
    pattern: Optional[str] = None
    mistakes: Optional[str] = None
    revision_notes: Optional[str] = None

class NoteUpdate(BaseModel):
    key_idea: Optional[str] = None
    pattern: Optional[str] = None
    mistakes: Optional[str] = None
    revision_notes: Optional[str] = None

class NoteResponse(BaseModel):
    id: int
    user_id: int
    question_id: int
    key_idea: Optional[str] = None
    pattern: Optional[str] = None
    mistakes: Optional[str] = None
    revision_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BookmarkCreate(BaseModel):
    user_id: int
    question_id: int
    tag: Optional[str] = None

class BookmarkResponse(BaseModel):
    id: int
    user_id: int
    question_id: int
    tag: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True