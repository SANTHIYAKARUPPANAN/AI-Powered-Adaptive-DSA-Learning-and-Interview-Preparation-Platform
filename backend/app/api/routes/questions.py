from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.question import Question
from app.schemas.question import QuestionCreate, QuestionUpdate, QuestionResponse
from typing import List, Optional

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.get("/", response_model=List[QuestionResponse])
def get_all_questions(
    topic_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    platform: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Question)
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    if platform:
        query = query.filter(Question.platform == platform)
    return query.all()

@router.post("/", response_model=QuestionResponse)
def create_question(data: QuestionCreate, db: Session = Depends(get_db)):
    question = Question(
        title=data.title,
        topic_id=data.topic_id,
        difficulty=data.difficulty,
        pattern=data.pattern,
        platform=data.platform,
        url=data.url,
        company_tags=data.company_tags
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(question_id: int, data: QuestionUpdate, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(question, key, value)
    db.commit()
    db.refresh(question)
    return question

@router.delete("/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(question)
    db.commit()
    return {"message": "Question deleted"}