from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.topic import Topic
from app.schemas.question import TopicCreate, TopicResponse
from typing import List

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.get("/", response_model=List[TopicResponse])
def get_all_topics(db: Session = Depends(get_db)):
    return db.query(Topic).order_by(Topic.order).all()

@router.post("/", response_model=TopicResponse)
def create_topic(data: TopicCreate, db: Session = Depends(get_db)):
    existing = db.query(Topic).filter(Topic.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Topic already exists")
    topic = Topic(name=data.name, order=data.order)
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic

@router.delete("/{topic_id}")
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    db.delete(topic)
    db.commit()
    return {"message": "Topic deleted"}