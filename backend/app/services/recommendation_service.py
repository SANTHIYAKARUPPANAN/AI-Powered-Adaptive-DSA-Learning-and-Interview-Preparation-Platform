from sqlalchemy.orm import Session
from app.models.question import Question
from app.models.solved_question import SolvedQuestion
from app.models.topic import Topic
from app.services.mastery_service import get_weak_topics

def get_recommendations(db: Session, user_id: int):
    solved = db.query(SolvedQuestion).filter(SolvedQuestion.user_id == user_id).all()
    solved_ids = [s.question_id for s in solved]

    weak_topics = get_weak_topics(db, user_id)
    recommendations = []

    # Prioritize weak topics
    for topic_name in weak_topics:
        topic = db.query(Topic).filter(Topic.name == topic_name).first()
        if not topic:
            continue
        questions = db.query(Question).filter(
            Question.topic_id == topic.id,
            Question.id.notin_(solved_ids)
        ).order_by(Question.difficulty).limit(3).all()
        recommendations.extend(questions)

    # Fill remaining with easy unsolved questions
    if len(recommendations) < 10:
        easy_questions = db.query(Question).filter(
            Question.id.notin_(solved_ids),
            Question.difficulty == "Easy"
        ).limit(10 - len(recommendations)).all()
        recommendations.extend(easy_questions)

    return recommendations[:10]

def get_company_questions(db: Session, company: str):
    questions = db.query(Question).filter(
        Question.company_tags.like(f"%{company}%")
    ).all()
    return questions