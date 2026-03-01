# we-are-alike Constitution

## Core Principles

### I. MVP First (No Overdesign)
Focus on the Minimum Viable Product. Avoid premature optimization and complex abstractions. Build only what is necessary to validate the core value proposition. If a feature is not essential for the immediate goal, it should be deferred.

### II. High Quality & Testable
Code quality is non-negotiable. Every feature must be testable. Automated tests (unit, integration) are required for all backend logic and critical frontend flows. TDD is encouraged but not strictly enforced, as long as comprehensive tests exist before merging.

### III. Simple & Responsive UX
The user interface must be clean, intuitive, and fully responsive across devices (mobile, tablet, desktop). Complexity should be hidden from the user. Design decisions should prioritize usability and simplicity over flashiness.

### IV. Tech Stack Consistency
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
Deviations from this stack require explicit justification and constitution amendment.

### V. Simplicity & Readability
Code should be easy to read and understand. Prefer simple, explicit logic over clever, implicit behavior. Variable and function names should be descriptive. Comments should explain "why", not "what".

## Technology Standards

### Frontend
- **Framework**: React (initialized via Vite).
- **Styling**: Tailwind CSS for utility-first styling.
- **State Management**: Keep it simple (React Context or simple hooks) unless complexity demands otherwise.
- **Testing**: Vitest or Jest for unit/component tests.

### Backend
- **Framework**: Python FastAPI.
- **Type Safety**: Use Pydantic models for request/response validation.
- **Testing**: Pytest for backend logic and API endpoints.

### Database
- **Provider**: Supabase (PostgreSQL).
- **Access**: Use Supabase client libraries or direct SQL via an ORM/query builder if needed, but keep it consistent.

## Development Workflow

### Feature Branches
All changes must be made in isolated feature branches (e.g., `feat/user-login`, `fix/nav-bug`). Direct commits to `main` are prohibited.

### Pull Requests & Review
- All code must be reviewed via Pull Request.
- CI checks (linting, testing) must pass before merging.
- PRs should be small and focused.

### Documentation
- Keep `README.md` and spec docs updated with changes.
- Document API endpoints and complex logic.

## Governance

This Constitution supersedes all other project practices.
- **Amendments**: Require a PR with justification and documentation updates.
- **Compliance**: All PRs and architectural decisions must be verified against these principles.
- **Versioning**: Follows Semantic Versioning (MAJOR.MINOR.PATCH).

<!-- Sync Impact Report
Version: 1.0.0 (New)
Modified Principles: N/A (Initial creation)
Added Sections: All (MVP, Quality, UX, Stack, Simplicity, Tech Standards, Workflow, Governance)
Removed Sections: N/A
Templates requiring updates: None (Templates are generic enough)
Follow-up TODOs: None
-->

**Version**: 1.0.0 | **Ratified**: 2026-02-23 | **Last Amended**: 2026-02-23
