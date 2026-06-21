from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.mastery_service import get_mastery_score, get_interview_readiness, get_weak_topics
from app.services.recommendation_service import get_recommendations, get_company_questions
from app.models.solved_question import SolvedQuestion
from app.models.revision import Revision
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/mastery/{user_id}")
def mastery_score(user_id: int, db: Session = Depends(get_db)):
    return get_mastery_score(db, user_id)

@router.get("/readiness/{user_id}")
def interview_readiness(user_id: int, db: Session = Depends(get_db)):
    return get_interview_readiness(db, user_id)

@router.get("/weak-topics/{user_id}")
def weak_topics(user_id: int, db: Session = Depends(get_db)):
    return {"weak_topics": get_weak_topics(db, user_id)}

@router.get("/recommendations/{user_id}")
def recommendations(user_id: int, db: Session = Depends(get_db)):
    return get_recommendations(db, user_id)

@router.get("/company/{company}")
def company_questions(company: str, db: Session = Depends(get_db)):
    return get_company_questions(db, company)

@router.get("/streak/{user_id}")
def get_streak(user_id: int, db: Session = Depends(get_db)):
    solved = db.query(SolvedQuestion).filter(
        SolvedQuestion.user_id == user_id
    ).order_by(SolvedQuestion.solved_date.desc()).all()

    if not solved:
        return {"current_streak": 0, "longest_streak": 0, "solved_today": 0}

    today = datetime.utcnow().date()
    solved_today = sum(1 for s in solved if s.solved_date.date() == today)

    streak = 0
    longest = 0
    current_date = today
    for s in solved:
        if s.solved_date.date() == current_date:
            streak += 1
            current_date -= timedelta(days=1)
            longest = max(longest, streak)
        else:
            break

    return {
        "current_streak": streak,
        "longest_streak": longest,
        "solved_today": solved_today
    }

@router.get("/daily-progress/{user_id}")
def daily_progress(user_id: int, db: Session = Depends(get_db)):
    solved = db.query(SolvedQuestion).filter(
        SolvedQuestion.user_id == user_id
    ).all()

    progress = {}
    for s in solved:
        date_str = s.solved_date.date().isoformat()
        progress[date_str] = progress.get(date_str, 0) + 1

    return {"daily_progress": progress}