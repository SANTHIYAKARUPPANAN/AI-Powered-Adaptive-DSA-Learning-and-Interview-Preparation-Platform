from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.note import Note
from app.models.bookmark import Bookmark
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse, BookmarkCreate, BookmarkResponse
from typing import List

router = APIRouter(tags=["Notes & Bookmarks"])

# Notes routes
@router.post("/notes/", response_model=NoteResponse)
def create_note(data: NoteCreate, db: Session = Depends(get_db)):
    existing = db.query(Note).filter(
        Note.user_id == data.user_id,
        Note.question_id == data.question_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Note already exists for this question")
    note = Note(
        user_id=data.user_id,
        question_id=data.question_id,
        key_idea=data.key_idea,
        pattern=data.pattern,
        mistakes=data.mistakes,
        revision_notes=data.revision_notes
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("/notes/{user_id}", response_model=List[NoteResponse])
def get_user_notes(user_id: int, db: Session = Depends(get_db)):
    return db.query(Note).filter(Note.user_id == user_id).all()

@router.get("/notes/{user_id}/{question_id}", response_model=NoteResponse)
def get_note(user_id: int, question_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(
        Note.user_id == user_id,
        Note.question_id == question_id
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/notes/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, data: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(note, key, value)
    db.commit()
    db.refresh(note)
    return note

@router.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}

# Bookmarks routes
@router.post("/bookmarks/", response_model=BookmarkResponse)
def create_bookmark(data: BookmarkCreate, db: Session = Depends(get_db)):
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == data.user_id,
        Bookmark.question_id == data.question_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bookmark already exists")
    bookmark = Bookmark(
        user_id=data.user_id,
        question_id=data.question_id,
        tag=data.tag
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return bookmark

@router.get("/bookmarks/{user_id}", response_model=List[BookmarkResponse])
def get_bookmarks(user_id: int, db: Session = Depends(get_db)):
    return db.query(Bookmark).filter(Bookmark.user_id == user_id).all()

@router.delete("/bookmarks/{bookmark_id}")
def delete_bookmark(bookmark_id: int, db: Session = Depends(get_db)):
    bookmark = db.query(Bookmark).filter(Bookmark.id == bookmark_id).first()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    db.delete(bookmark)
    db.commit()
    return {"message": "Bookmark deleted"}