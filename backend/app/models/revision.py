
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Revision(Base):
    __tablename__ = 'revisions'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    revision_date = Column(DateTime, nullable=False)
    is_completed = Column(Boolean, default=False)
    revision_type = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship('User', back_populates='revisions')
    question = relationship('Question', back_populates='revisions')
