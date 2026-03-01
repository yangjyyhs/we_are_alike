# Tasks: Interactive Rating Game

**Branch**: `001-interactive-rating-game`
**Input**: Design documents from `/specs/001-interactive-rating-game/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: [US1] Creator Setup, [US2] Participant Rate, [US3] Admin Results

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project structure and dependencies.

- [ ] T001 Create directory structure for `backend/` and `frontend/` per plan.md
- [ ] T002 Initialize Python FastAPI project in `backend/` with `requirements.txt` (FastAPI, Uvicorn, Supabase, NumPy, Bcrypt)
- [ ] T003 Initialize React Vite project in `frontend/` with Tailwind CSS
- [ ] T004 [P] Create `.env.example` in `backend/` and `frontend/`
- [ ] T005 [P] Configure basic linting (Ruff for Python, ESLint for JS)

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core DB and API infrastructure.

- [ ] T006 Setup Supabase project and apply SQL schema from `data-model.md` to `backend/sql/schema.sql` (and run in DB)
- [ ] T007 Implement Supabase client singleton in `backend/src/core/database.py`
- [ ] T008 [P] Implement Pydantic base settings in `backend/src/core/config.py`
- [ ] T009 [P] Create shared Pydantic models for DB entities in `backend/src/models/db.py` (`Room`, `Item`, `Participant`, `Answer`)
- [ ] T010 [P] Setup global exception handlers in `backend/src/main.py`
- [ ] T011 [P] Setup frontend API client (axios/fetch wrapper) in `frontend/src/services/api.js`
- [ ] T012 [P] Setup React Router in `frontend/src/App.jsx` with placeholders

**Checkpoint**: Backend connects to DB, Frontend runs and has routing.

## Phase 3: User Story 1 - Creator Sets Up Room (Priority: P1)

**Goal**: Users can create a room, set password/topic/items, and get a Room ID.
**Independent Test**: Verify via API that a room is created with items in DB.

- [ ] T013 [P] [US1] Create `RoomCreate` Pydantic schema in `backend/src/models/schemas.py`
- [ ] T014 [US1] Implement password hashing utility in `backend/src/core/security.py`
- [ ] T015 [US1] Implement `create_room` service logic (insert Room + Items transaction) in `backend/src/services/room_service.py`
- [ ] T016 [US1] Implement `POST /rooms` endpoint in `backend/src/api/routes/rooms.py`
- [ ] T017 [P] [US1] Create `RoomSetup` page in `frontend/src/pages/RoomSetup.jsx` (Form for Topic, Password, Dynamic Items)
- [ ] T018 [P] [US1] Create `RoomCreated` success page in `frontend/src/pages/RoomCreated.jsx` (Display ID)
- [ ] T019 [US1] Integrate frontend Room Create form with API
- [ ] T020 [US1] Add "Lazy Cleanup" logic to `POST /rooms` (delete old rooms) per research.md

**Checkpoint**: US1 Complete. Can create rooms.

## Phase 4: User Story 2 - Participant Joins and Rates (Priority: P1)

**Goal**: Participants can join by ID, validate nickname, rate items, and submit.
**Independent Test**: Join with valid ID, fail with invalid ID, submit ratings and verify in DB.

- [ ] T021 [P] [US2] Create `JoinRequest` and `AnswerSubmit` schemas in `backend/src/models/schemas.py`
- [ ] T022 [P] [US2] Implement `GET /rooms/{id}` and `GET /rooms/{id}/items` endpoints in `backend/src/api/routes/rooms.py`
- [ ] T023 [US2] Implement `check_participant` service (validate unique nickname) in `backend/src/services/participant_service.py`
- [ ] T024 [US2] Implement `POST /rooms/{id}/join` endpoint in `backend/src/api/routes/participants.py`
- [ ] T025 [US2] Implement `submit_answers` service (save participant + answers) in `backend/src/services/participant_service.py`
- [ ] T026 [US2] Implement `POST /participants/{id}/answers` endpoint
- [ ] T027 [P] [US2] Create `Home` page (Join Input) in `frontend/src/pages/Home.jsx`
- [ ] T028 [P] [US2] Create `Rating` page in `frontend/src/pages/Rating.jsx` (Display Items, 5-star UI)
- [ ] T029 [US2] Integrate Join flow (Nickname check)
- [ ] T030 [US2] Integrate Submit flow (Validate all answered)

**Checkpoint**: US2 Complete. Participants can join and rate.

## Phase 5: User Story 3 - Creator Calculates and Sends Results (Priority: P1)

**Goal**: Creator logs in, triggers calculation, system emails results.
**Independent Test**: Mock 4 participants, run calculation, verify email function called with correct matches.

- [ ] T031 [P] [US3] Implement `verify_password` in `backend/src/core/security.py`
- [ ] T032 [US3] Implement `POST /admin/login` endpoint (return token/success) in `backend/src/api/routes/admin.py`
- [ ] T033 [US3] Implement `GET /admin/stats/{id}` endpoint
- [ ] T034 [P] [US3] Implement Cosine Similarity logic using NumPy in `backend/src/services/math_service.py` (Handle NULLs)
- [ ] T035 [P] [US3] Setup `fastapi-mail` configuration in `backend/src/core/mail.py`
- [ ] T036 [US3] Implement `send_results_email` function (async background task)
- [ ] T037 [US3] Implement `POST /admin/calculate/{id}` endpoint (Trigger math + email)
- [ ] T038 [P] [US3] Create `AdminLogin` page in `frontend/src/pages/AdminLogin.jsx`
- [ ] T039 [P] [US3] Create `AdminDashboard` page in `frontend/src/pages/AdminDashboard.jsx` (Stats + Send Button + Spinner)
- [ ] T040 [US3] Integrate Admin flow

**Checkpoint**: US3 Complete. Full loop working.

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T041 [P] Add mobile responsive tweaks to Tailwind classes (ensure touch targets > 44px)
- [ ] T042 Verify error handling (Invalid Room ID, Duplicate Nickname) displays user-friendly toasts/alerts
- [ ] T043 Add "Loading" states to all async buttons
- [ ] T044 Update README.md with setup instructions

## Dependencies & Execution Order

1. **Phase 1 & 2** (Setup/Foundation) must be done first.
2. **Phase 3** (Creator Setup) enables Room creation.
3. **Phase 4** (Participant) depends on Room creation (Phase 3) for integration testing, but code can be written in parallel if mocked.
4. **Phase 5** (Admin) depends on Participants (Phase 4) to have data to calculate.

## Implementation Strategy

1. **MVP**: Build linearly US1 -> US2 -> US3.
2. **Parallel**: Backend Dev can implement all API endpoints (T016, T022, T024, T026, T032, T037) while Frontend Dev builds UI pages.
