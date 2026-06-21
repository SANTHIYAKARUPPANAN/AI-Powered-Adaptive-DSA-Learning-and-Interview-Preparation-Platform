from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.solved_question import SolvedQuestion
from app.models.revision import Revision
from app.models.question import Question
from fastapi import HTTPException

def solve_question(db: Session, user_id: int, question_id: int, status: str = "Solved"):
    # Check question exists
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Check if already solved
    existing = db.query(SolvedQuestion).filter(
        SolvedQuestion.user_id == user_id,
        SolvedQuestion.question_id == question_id
    ).first()

    if existing:
        existing.status = status
        existing.solved_date = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        solved = existing
    else:
        solved = SolvedQuestion(
            user_id=user_id,
            question_id=question_id,
            status=status,
            solved_date=datetime.utcnow()
        )
        db.add(solved)
        db.commit()
        db.refresh(solved)

        # Schedule revisions — Day 1, Day 7, Day 30
        revision_days = {"Day1": 1, "Day7": 7, "Day30": 30}
        for revision_type, days in revision_days.items():
            revision = Revision(
                user_id=user_id,
                question_id=question_id,
                revision_date=datetime.utcnow() + timedelta(days=days),
                revision_type=revision_type,
                is_completed=False
            )
            db.add(revision)
        db.commit()

    return solved

def _attach_question_info(db, revisions):
    result = []
    for r in revisions:
        question = db.query(Question).filter(Question.id == r.question_id).first()
        r.question_title = question.title if question else None
        r.question_difficulty = question.difficulty if question else None
        result.append(r)
    return result

def get_todays_revisions(db: Session, user_id: int):
    today = datetime.utcnow().date()
    revisions = db.query(Revision).filter(
        Revision.user_id == user_id,
        Revision.is_completed == False
    ).all()
    filtered = [r for r in revisions if r.revision_date.date() <= today]
    return _attach_question_info(db, filtered)

def get_weekend_revisions(db: Session, user_id: int):
    today = datetime.utcnow().date()
    # Get next Saturday and Sunday
    days_until_saturday = (5 - today.weekday()) % 7
    saturday = today + timedelta(days=days_until_saturday)
    sunday = saturday + timedelta(days=1)

    revisions = db.query(Revision).filter(
        Revision.user_id == user_id,
        Revision.is_completed == False
    ).all()
    filtered = [r for r in revisions if saturday <= r.revision_date.date() <= sunday]
    return _attach_question_info(db, filtered)

def complete_revision(db: Session, revision_id: int, user_id: int):
    revision = db.query(Revision).filter(
        Revision.id == revision_id,
        Revision.user_id == user_id
    ).first()
    if not revision:
        raise HTTPException(status_code=404, detail="Revision not found")
    revision.is_completed = True
    db.commit()
    return {"message": "Revision marked as complete"}

def get_overdue_revisions(db: Session, user_id: int):
    today = datetime.utcnow().date()
    revisions = db.query(Revision).filter(
        Revision.user_id == user_id,
        Revision.is_completed == False
    ).all()
    filtered = [r for r in revisions if r.revision_date.date() < today]
    return _attach_question_info(db, filtered)