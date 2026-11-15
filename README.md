# VaultPulse AI — Cloud FinOps & AI Token Cost Management System

VaultPulse AI is an end-to-end monorepo application designed to monitor, optimize, and govern AI token expenditure across major foundation models (OpenAI, Anthropic, Google Gemini).

## 🏛️ Architecture & Tech Stack

- **Frontend (`/frontend`)**: React + Vite, Tailwind CSS v4, Framer Motion, Lucide Icons. Designed for deployment on Vercel.
- **Backend (`/backend`)**: Python FastAPI, SQLAlchemy, PostgreSQL, Docker. Provides REST APIs for real-time telemetry, API key kill-switches, cost optimization routing, and prompt sandbox cost estimation.

---

## 🚀 Getting Started

### 1. Run Backend & PostgreSQL with Docker
```bash
cd backend
docker-compose up --build -d
python seed.py
```
*(FastAPI will be available at `http://localhost:8000`)*

### 2. Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
*(Frontend will be available at `http://localhost:5173` or `5174`)*

---

## 📦 Deployment

- **Frontend**: Deploy `frontend/` directly to **Vercel** with SPA rewrites configured via `vercel.json`.
- **Backend**: Deploy `backend/` to any Docker-compatible PaaS (Railway, Render, AWS ECS) connected to a PostgreSQL instance.

---



## 👨‍💻 Author
Built by **Abdul Momin** — AI Engineer
