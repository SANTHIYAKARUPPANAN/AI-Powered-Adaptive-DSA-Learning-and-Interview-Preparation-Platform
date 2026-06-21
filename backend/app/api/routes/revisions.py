from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.revision import SolveQuestionRequest, SolvedQuestionResponse, RevisionResponse
from app.services.revision_service import (
    solve_question, get_todays_revisions,
    get_weekend_revisions, complete_revision,
    get_overdue_revisions
)
from typing import List

router = APIRouter(prefix="/revisions", tags=["Revisions"])

@router.post("/solve", response_model=SolvedQuestionResponse)
def mark_solved(data: SolveQuestionRequest, db: Session = Depends(get_db)):
    return solve_question(db, data.user_id, data.question_id, data.status)

@router.get("/today/{user_id}", response_model=List[RevisionResponse])
def todays_revisions(user_id: int, db: Session = Depends(get_db)):
    return get_todays_revisions(db, user_id)

@router.get("/weekend/{user_id}", response_model=List[RevisionResponse])
def weekend_revisions(user_id: int, db: Session = Depends(get_db)):
    return get_weekend_revisions(db, user_id)

@router.get("/overdue/{user_id}", response_model=List[RevisionResponse])
def overdue_revisions(user_id: int, db: Session = Depends(get_db)):
    return get_overdue_revisions(db, user_id)

@router.put("/complete/{revision_id}/{user_id}")
def mark_revision_complete(revision_id: int, user_id: int, db: Session = Depends(get_db)):
    return complete_revision(db, revision_id, user_id)