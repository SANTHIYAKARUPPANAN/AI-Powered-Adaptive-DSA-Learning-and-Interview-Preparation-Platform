from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    college = Column(String(150), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    target_role = Column(String(100), nullable=True)
    target_company = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    solved_questions = relationship('SolvedQuestion', back_populates='user')
    revisions = relationship('Revision', back_populates='user')
    notes = relationship('Note', back_populates='user')
    bookmarks = relationship('Bookmark', back_populates='user')
