# Quickstart: Interactive Rating Game

**Branch**: `001-interactive-rating-game`

## Prerequisites
- Python 3.10+
- Node.js 18+
- Supabase Account (or local Docker instance)

## Environment Setup

### Backend (`/backend`)
1. Create `.env`:
   ```bash
   SUPABASE_URL="https://xyz.supabase.co"
   SUPABASE_KEY="service_role_secret"
   MAIL_USERNAME="your@email.com"
   MAIL_PASSWORD="app_password"
   MAIL_FROM="noreply@app.com"
   MAIL_PORT=587
   MAIL_SERVER="smtp.gmail.com"
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run server:
   ```bash
   uvicorn src.main:app --reload
   ```

### Frontend (`/frontend`)
1. Create `.env`:
   ```bash
   VITE_API_URL="http://localhost:8000/api/v1"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Database Migration
Run the SQL script provided in `backend/sql/schema.sql` (to be created) in your Supabase SQL Editor.

## Testing
- Backend: `pytest`
- Frontend: `npm run test`
