# Bank Policy Chatbot (FastAPI + SQLAlchemy + RAG + Gemini + React/Tailwind)

This project implements a complete bank policy chatbot system with:

- FastAPI backend
- SQLite or PostgreSQL database (SQLAlchemy ORM)
- RAG retrieval pipeline (upload -> parse -> chunk -> embed -> retrieve)
- Gemini integration for grounded response generation
- Admin dashboard (React + Tailwind)
- User website page with floating chat widget (React + Tailwind)
- Khmer + English support

## 1) Project Structure

```
backend/
  app/
    api/routes/
    core/
    db/
    services/
    utils/
    main.py
  tests/
frontend/
  src/
    api/
    components/admin/
    components/user/
    context/
    hooks/
    layouts/
    pages/
sample_policies/
uploads/
vector_store/
```

## 2) Backend Features

- Admin authentication with JWT + password hashing
- Policy file upload: PDF, DOC/DOCX, JSON, TXT/MD
- Document parsing and normalization
- Chunking pipeline
- Embedding pipeline (Gemini embedding when key is available, hash fallback for local dev)
- Retrieval over indexed chunks with similarity scoring
- Gemini grounded answer generation (safe fallback when no context)
- Chat session/message logging
- Admin APIs:
  - `POST /api/admin/login`
  - `POST /api/admin/logout`
  - `POST /api/admin/documents/upload`
  - `GET /api/admin/documents`
  - `GET /api/admin/documents/{id}`
  - `DELETE /api/admin/documents/{id}`
  - `POST /api/admin/documents/{id}/reindex`
  - `PATCH /api/admin/documents/{id}/toggle`
  - `GET /api/admin/chats`
  - `GET /api/admin/analytics`
  - `GET /api/admin/settings`
  - `PATCH /api/admin/settings`
  - `GET /api/admin/users`
  - `POST /api/admin/users`
  - `PATCH /api/admin/users/{id}`
- Public APIs:
  - `POST /api/chat/session`
  - `POST /api/chat/message`
  - `GET /api/chat/health`
  - `GET /api/widget/config`

## 3) Frontend Features

- User-facing bank website with:
  - dark gradient hero
  - chatbot preview
  - features/topics/help sections
  - floating chatbot widget connected to backend
- Admin panel with:
  - login
  - overview dashboard
  - document management (upload/search/re-index/toggle/delete)
  - chat logs inspector
  - analytics page
  - settings page
  - admin users page

## 4) Environment Setup

### Backend

1. Go to backend:
   - `cd backend`
2. Create virtual env and install dependencies:
   - `python -m venv .venv`
   - `.venv\Scripts\activate` (Windows PowerShell)
   - `pip install -r requirements.txt`
3. Create environment file:
   - SQLite: copy `.env.example` to `.env`
   - PostgreSQL: copy `.env.postgres.example` to `.env`
4. Configure:
   - `GEMINI_API_KEY` (optional but recommended)
   - `JWT_SECRET` (required for secure use)
5. Run API:
   - `uvicorn app.main:app --reload --port 8000`

Default admin credentials come from env:

- username: `admin`
- password: `admin1234`

### Optional: PostgreSQL with Docker (Local)

1. From project root, start PostgreSQL container:
   - `docker compose up -d postgres`
2. Confirm container is healthy:
   - `docker compose ps`
3. In `backend/`, use PostgreSQL env template:
   - `Copy-Item .env.postgres.example .env -Force`
4. Run backend:
   - `uvicorn app.main:app --reload --port 8000`

Notes:
- Docker maps Postgres to host port `55432` to avoid collisions with local PostgreSQL on `5432`.
- DB tables are auto-created on backend startup.
- Stop DB container with `docker compose down`.
- Remove DB data volume with `docker compose down -v`.

### Frontend

1. Go to frontend:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Create environment file:
   - copy `.env.example` to `.env`
4. Start dev server:
   - `npm run dev`
5. Open:
   - user page: `http://localhost:5173`
   - admin page: `http://localhost:5173/admin/login`

## 5) Quick Test Flow

1. Start backend and frontend.
2. Log in admin.
3. Upload a policy file from `sample_policies/`.
4. Wait for indexing status `indexed`.
5. Open user page and ask policy questions in English/Khmer.
6. Check admin chat logs and analytics.

## 6) Notes

- `uploads/` stores original policy files.
- Retrieval uses active indexed documents only.
- If policy context is insufficient, the assistant returns safe fallback guidance.
- Khmer/English language is detected from user text and response follows dominant language.

## 7) Vanilla Widget Embed

You can embed the standalone widget (non-React) on any site:

```html
<link rel="stylesheet" href="http://localhost:8000/static/widget/bank-widget.css" />
<script
  src="http://localhost:8000/static/widget/bank-widget.js"
  data-api-base="http://localhost:8000/api"
  data-position="right"
></script>
```

Local example file:

- `backend/app/static/widget/embed-example.html`
