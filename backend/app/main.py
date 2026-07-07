
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.models import *
from app.api.routes import auth, topics, questions, revisions, notes, analytics, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DSA Tracker API",
    description="Personal DSA Practice Tracker",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://ai-powered-adaptive-dsa-learning-an.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(topics.router)
app.include_router(questions.router)
app.include_router(revisions.router)
app.include_router(notes.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"message": "DSA Tracker API is running!"}
