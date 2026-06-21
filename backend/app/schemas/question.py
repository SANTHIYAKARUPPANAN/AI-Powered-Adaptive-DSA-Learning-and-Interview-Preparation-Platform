from pydantic import BaseModel
from typing import Optional

class TopicCreate(BaseModel):
    name: str
    order: int

class TopicResponse(BaseModel):
    id: int
    name: str
    order: int

    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    title: str
    topic_id: int
    difficulty: str
    pattern: Optional[str] = None
    platform: Optional[str] = None
    url: Optional[str] = None
    company_tags: Optional[str] = None

class QuestionUpdate(BaseModel):
    title: Optional[str] = None
    difficulty: Optional[str] = None
    pattern: Optional[str] = None
    platform: Optional[str] = None
    url: Optional[str] = None
    company_tags: Optional[str] = None
    status: Optional[str] = None

class QuestionResponse(BaseModel):
    id: int
    title: str
    topic_id: int
    difficulty: str
    pattern: Optional[str] = None
    platform: Optional[str] = None
    url: Optional[str] = None
    company_tags: Optional[str] = None

    class Config:
        from_attributes = True