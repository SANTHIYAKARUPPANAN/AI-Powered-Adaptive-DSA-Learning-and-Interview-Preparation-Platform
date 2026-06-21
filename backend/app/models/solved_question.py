
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class SolvedQuestion(Base):
    __tablename__ = 'solved_questions'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    status = Column(String(50), default='Solved')
    solved_date = Column(DateTime, default=datetime.utcnow)
    user = relationship('User', back_populates='solved_questions')
    question = relationship('Question', back_populates='solved_questions')
