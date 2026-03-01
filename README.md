# We Are Alike - Interactive Rating Game

A real-time interactive game where users rate items and find their most similar peers.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python FastAPI, Supabase, NumPy
- **Database**: PostgreSQL (Supabase)

## Setup

### Backend
1. `cd backend`
2. Create `.env` based on `.env.example`
3. `pip install -r requirements.txt`
4. Run SQL schema in `sql/schema.sql` on your Supabase instance.
5. `uvicorn src.main:app --reload`

### Frontend
1. `cd frontend`
2. Create `.env` based on `.env.example`
3. `npm install`
4. `npm run dev`

## Features
- Create Room with custom topics and items.
- Join Room and rate items (1-5 stars).
- Admin Dashboard to view participants and send similarity results via email.
