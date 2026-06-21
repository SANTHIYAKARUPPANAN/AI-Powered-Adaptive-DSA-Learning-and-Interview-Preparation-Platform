
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    topic_id = Column(Integer, ForeignKey('topics.id'), nullable=False)
    difficulty = Column(String(20), nullable=False)
    pattern = Column(String(100), nullable=True)
    platform = Column(String(50), nullable=True)
    url = Column(String(500), nullable=True)
    company_tags = Column(String(255), nullable=True)
    topic = relationship('Topic', back_populates='questions')
    solved_questions = relationship('SolvedQuestion', back_populates='question')
    revisions = relationship('Revision', back_populates='question')
    notes = relationship('Note', back_populates='question')
    bookmarks = relationship('Bookmark', back_populates='question')
