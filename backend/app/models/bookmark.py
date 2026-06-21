
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Bookmark(Base):
    __tablename__ = 'bookmarks'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    tag = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship('User', back_populates='bookmarks')
    question = relationship('Question', back_populates='bookmarks')
