from sqlalchemy.orm import Session
from app.models.solved_question import SolvedQuestion
from app.models.revision import Revision
from app.models.question import Question
from app.models.topic import Topic

def get_mastery_score(db: Session, user_id: int):
    topics = db.query(Topic).all()
    mastery = []

    for topic in topics:
        questions = db.query(Question).filter(Question.topic_id == topic.id).all()
        if not questions:
            continue

        total = len(questions)
        solved_ids = [q.id for q in questions]

        solved = db.query(SolvedQuestion).filter(
            SolvedQuestion.user_id == user_id,
            SolvedQuestion.question_id.in_(solved_ids)
        ).all()

        easy_solved = sum(1 for s in solved if db.query(Question).filter(Question.id == s.question_id).first().difficulty == "Easy")
        medium_solved = sum(1 for s in solved if db.query(Question).filter(Question.id == s.question_id).first().difficulty == "Medium")
        hard_solved = sum(1 for s in solved if db.query(Question).filter(Question.id == s.question_id).first().difficulty == "Hard")

        revisions_completed = db.query(Revision).filter(
            Revision.user_id == user_id,
            Revision.question_id.in_(solved_ids),
            Revision.is_completed == True
        ).count()

        score = (
            (easy_solved * 1) +
            (medium_solved * 2) +
            (hard_solved * 3) +
            (revisions_completed * 0.5)
        )
        max_score = total * 3
        percentage = round((score / max_score) * 100, 1) if max_score > 0 else 0

        mastery.append({
            "topic": topic.name,
            "total_questions": total,
            "solved": len(solved),
            "mastery_score": percentage
        })

    return mastery

def get_interview_readiness(db: Session, user_id: int):
    all_questions = db.query(Question).all()
    total = len(all_questions)
    if total == 0:
        return {"readiness_score": 0}

    solved = db.query(SolvedQuestion).filter(SolvedQuestion.user_id == user_id).all()
    solved_ids = [s.question_id for s in solved]

    medium_solved = sum(1 for s in solved if db.query(Question).filter(Question.id == s.question_id).first().difficulty == "Medium")
    hard_solved = sum(1 for s in solved if db.query(Question).filter(Question.id == s.question_id).first().difficulty == "Hard")

    revisions_completed = db.query(Revision).filter(
        Revision.user_id == user_id,
        Revision.is_completed == True
    ).count()
    revisions_total = db.query(Revision).filter(Revision.user_id == user_id).count()

    coverage = (len(solved) / total) * 40
    medium_hard_ratio = ((medium_solved + hard_solved * 2) / (total * 2)) * 30
    revision_consistency = (revisions_completed / revisions_total * 30) if revisions_total > 0 else 0

    score = round(coverage + medium_hard_ratio + revision_consistency, 1)
    score = min(score, 100)

    weak_topics = get_weak_topics(db, user_id)

    return {
        "readiness_score": score,
        "total_solved": len(solved),
        "total_questions": total,
        "medium_solved": medium_solved,
        "hard_solved": hard_solved,
        "weak_topics": weak_topics
    }

def get_weak_topics(db: Session, user_id: int):
    mastery = get_mastery_score(db, user_id)
    weak = [m for m in mastery if m["mastery_score"] < 50]
    weak.sort(key=lambda x: x["mastery_score"])
    return [m["topic"] for m in weak[:3]]