# Research & Technical Decisions: Interactive Rating Game

**Feature Branch**: `001-interactive-rating-game`

## Technical Decisions

### 1. Similarity Calculation
**Decision**: Use `numpy` to calculate Cosine Similarity.
**Rationale**: `numpy` is the standard for efficient vector operations in Python.
**Implementation Details**:
- Represent ratings as a matrix (Participants x Items).
- Handle `NULL` (unseen items):
  - Strategy: Imputation with median (3) or neutral score to avoid skewing results, or mask missing values if `numpy` supports masked arrays for cosine similarity (complex).
  - **Selected Strategy**: Imputation with neutral value (3) for MVP simplicity to ensure valid vector operations, or use `sklearn.metrics.pairwise.nan_euclidean_distances` equivalent if available, but `numpy` with masking/imputation is faster to implement without heavy sklearn dependency if not needed.
  - *Refinement*: The user prompt suggests "ignore paired missing dimensions or fill with median 3". Filling with 3 is the most robust MVP approach for standard cosine similarity.

### 2. Email Service
**Decision**: `fastapi-mail` with background tasks.
**Rationale**: Native integration with FastAPI, supports asynchronous sending, handles blocking operations away from the main thread.
**Configuration**: Requires SMTP credentials (e.g., Gmail, SendGrid, AWS SES) configured via environment variables.

### 3. Database Cleanup (7-day retention)
**Decision**: Supabase `pg_cron` (if available) or Lazy Cleanup.
**Rationale**: `pg_cron` is the most reliable database-native solution.
**Fallback**: If `pg_cron` is not enabled in the Supabase tier, implement a `DELETE` query that runs at the start of the `POST /rooms` (create room) endpoint. This ensures the DB is cleaned up regularly as long as the app is being used, without external dependencies.
**Selected Strategy**: **Lazy Cleanup** on Room Creation for MVP. It guarantees cleanup happens without setting up external infrastructure.

### 4. Password Hashing
**Decision**: `bcrypt`.
**Rationale**: Industry standard for password hashing. Slow enough to resist brute-force.
**Flow**: Hash on create, `bcrypt.checkpw()` on login.

### 5. Frontend Polling vs. WebSockets
**Decision**: Polling for "wait for results".
**Rationale**: MVP simplicity. The user flows don't strictly require real-time bidirectional updates (except "waiting for results"). A simple polling interval (e.g., every 5s) or a manual "Refresh" / "Check Status" is sufficient and much simpler than maintaining WebSocket connections.
**Correction**: The User Story says "Loading Spinner... successful execution... completion message". This implies the *Creator* waits for the *calculation request* to finish. The *Participants* are just waiting for an email. So no real-time push to participants is needed on the web UI side (they get email). The Creator just waits for the HTTP request to return.
**Refinement**: The "number of people who have completed" on Admin screen needs to update. **Polling** (every 5-10s) is sufficient.

## Dependencies

- `fastapi`, `uvicorn`, `pydantic`, `pydantic-settings`
- `supabase` (official client)
- `numpy`
- `bcrypt`
- `fastapi-mail`
- `python-multipart` (for form data if used, or just JSON)
