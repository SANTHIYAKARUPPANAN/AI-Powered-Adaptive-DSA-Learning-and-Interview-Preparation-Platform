from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SolveQuestionRequest(BaseModel):
    question_id: int
    user_id: int
    status: str = "Solved"

class SolvedQuestionResponse(BaseModel):
    id: int
    user_id: int
    question_id: int
    status: str
    solved_date: datetime

    class Config:
        from_attributes = True

class RevisionResponse(BaseModel):
    id: int
    user_id: int
    question_id: int
    revision_date: datetime
    is_completed: bool
    revision_type: str
    question_title: Optional[str] = None
    question_difficulty: Optional[str] = None

    class Config:
        from_attributes = True