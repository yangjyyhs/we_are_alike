# Implementation Plan: Interactive Rating Game

**Branch**: `001-interactive-rating-game` | **Date**: 2026-02-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-interactive-rating-game/spec.md`

## Summary

Build a real-time interactive rating web application where a creator sets up a room with items, participants rate them, and the system calculates and emails the top 3 most similar players to each participant. Implemented using React (Vite) + Tailwind CSS for frontend, Python FastAPI for backend, and Supabase (PostgreSQL) for storage.

## Technical Context

**Language/Version**: Python 3.10+ (Backend), Node.js/TypeScript (Frontend)
**Primary Dependencies**: 
- Backend: FastAPI, Uvicorn, Pydantic, Supabase-py (or asyncpg), NumPy (for similarity calc), Bcrypt (for passwords).
- Frontend: React, Vite, Tailwind CSS.
**Storage**: Supabase (PostgreSQL)
**Testing**: Pytest (Backend), Vitest (Frontend)
**Target Platform**: Web (Mobile-First Responsive)
**Project Type**: Full-stack Web Application
**Performance Goals**: Support 50+ concurrent users/room, calculate results < 30s.
**Constraints**: Mobile-friendly UI (touch targets), Secure password handling, 7-day data retention.
**Scale/Scope**: MVP focus, single room logic.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **MVP First**: Scope limited to single-room creation, joining, rating, and result calculation. No persistent user accounts or complex history.
- [x] **High Quality & Testable**: Backend logic (similarity calculation) and API endpoints will be tested with Pytest. Frontend critical flows tested.
- [x] **Simple & Responsive UX**: Mobile-first design mandated. Large touch targets.
- [x] **Tech Stack Consistency**: Matches Constitution (React+Vite+Tailwind / FastAPI / Supabase).
- [x] **Simplicity & Readability**: Using standard libraries (NumPy) for math, clean API structure.

## Project Structure

### Documentation (this feature)

```text
specs/001-interactive-rating-game/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/             # Routes (room, participant, admin)
│   ├── core/            # Config, security (hashing)
│   ├── models/          # Pydantic models & DB schemas
│   ├── services/        # Business logic (math, email, db ops)
│   └── main.py          # App entry point
└── tests/
    ├── unit/            # Math/Logic tests
    └── integration/     # API endpoint tests

frontend/
├── src/
│   ├── components/      # Reusable UI components (Button, StarRating)
│   ├── pages/           # Route pages (Home, RoomSetup, Rating, Admin)
│   ├── services/        # API client
│   └── utils/           # Helper functions
└── tests/               # Component tests
```

**Structure Decision**: Split `backend` and `frontend` directories at root to maintain clear separation of concerns, aligned with the Tech Stack Consistency principle.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
