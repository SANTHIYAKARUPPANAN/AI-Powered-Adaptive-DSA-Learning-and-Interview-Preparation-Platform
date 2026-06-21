
# AI-Powered-Adaptive-DSA-Learning-and-Interview-Preparation-Platform

A personal DSA practice tracker that helps you track your preparation, schedule revisions, and monitor your interview readiness.

🚀 Features

- **User Authentication** — Signup, Login, Password Reset with JWT
- **DSA Roadmap** — Topic-wise progress tracking
- **Question Management** — Add, update, delete questions with filters
- **Revision Scheduler** — Automatic spaced repetition (Day 1, Day 7, Day 30)
- **Mastery Score** — Per topic proficiency percentage
- **Interview Readiness Score** — Overall preparation score out of 100
- **Analytics Dashboard** — Charts for daily progress and topic mastery
- **Weak Topic Analysis** — Auto-identifies your weak areas
- **Notes & Bookmarks** — Store key ideas, patterns, mistakes per question
- **Streak Tracking** — Current and longest solving streak
- **Company Filter** — Questions tagged by Google, Amazon, Microsoft, Meta
- **Smart Recommendations** — Next questions to solve based on weak areas

 🛠️ Tech Stack

  Frontend
- React.js
- Tailwind CSS
- Recharts
- Axios
- React Router DOM

  Backend
- FastAPI (Python)
- SQLAlchemy ORM
- MySQL
- JWT Authentication
- bcrypt password hashing

  Deployment
- Frontend: Vercel
- Backend: Railway
- Database: Railway MySQL

📁 Project Structure
├── backend/

│   ├── app/

│   │   ├── api/routes/

│   │   ├── core/

│   │   ├── db/

│   │   ├── models/

│   │   ├── schemas/

│   │   ├── services/

│   │   └── main.py

│   └── requirements.txt

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── context/

│   │   ├── pages/

│   │   └── services/

│   ├── index.html

│   └── package.json

└── README.md

⚙️ Local Setup

Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend
```bash
cd frontend
npm install
.\node_modules\.bin\vite
```

🗄️ Database Tables

- `users` — User profiles
- `topics` — DSA topics
- `questions` — Question bank
- `solved_questions` — Solved question tracking
- `revisions` — Revision schedule
- `notes` — Per question notes
- `bookmarks` — Saved questions

👩‍💻 Developer

**Santhiya** — B.Tech CSE
- Target Role: Software Engineer
- GitHub: [@SANTHIYAKARUPPANAN](https://github.com/SANTHIYAKARUPPANAN)\
  
