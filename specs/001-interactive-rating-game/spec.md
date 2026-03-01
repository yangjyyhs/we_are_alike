# Feature Specification: Interactive Rating Game

**Feature Branch**: `001-interactive-rating-game`
**Created**: 2026-02-23
**Status**: Draft
**Input**: User description provided in chat.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Creator Sets Up Room (Priority: P1)

A user wants to create a new game room, set a topic, and add items for others to rate, so they can invite friends to play.

**Why this priority**: Essential for the game to exist. Without a room and items, no one can play.

**Independent Test**: Can be tested by creating a room, adding items, and verifying the room exists and items are saved.

**Acceptance Scenarios**:

1. **Given** a user on the homepage, **When** they click "Create New Room", **Then** they are taken to the room creation screen.
2. **Given** the room creation screen, **When** the user enters a password twice and it matches, **Then** the password is set.
3. **Given** a password mismatch, **When** the user tries to proceed, **Then** an error message is shown.
4. **Given** a set password, **When** the user enters a "Topic" and adds multiple "Items", **Then** the topic and items are saved to the room.
5. **Given** a created room, **When** the setup is complete, **Then** a unique Room ID is displayed for sharing.
6. **Given** the room creation flow, **When** setting the password, **Then** a prominent warning "Please remember this password! You will need to use this password to log in to the backend for final calculation and sending results to all users" is displayed.

---

### User Story 2 - Participant Joins and Rates (Priority: P1)

A user wants to join an existing room using a Room ID, enter their details, and rate the items, so their preferences can be recorded.

**Why this priority**: Core gameplay mechanic. Without participants rating, there is no data to compare.

**Independent Test**: Can be tested by joining a known room, submitting ratings, and verifying the ratings are recorded.

**Acceptance Scenarios**:

1. **Given** a valid Room ID, **When** a user enters it on the homepage, **Then** they are prompted for Nickname and Email.
2. **Given** an invalid Room ID, **When** a user tries to join, **Then** an error "Room not found, please confirm if the ID is correct" is displayed.
3. **Given** a duplicate Nickname in the room, **When** a user tries to join, **Then** an error "This nickname is already in use, please choose another one" is displayed.
4. **Given** the rating interface, **When** the user views the items, **Then** they see the Topic and all Items with 5-star rating scales (Dislike to Like very much).
5. **Given** the rating interface, **When** the user rates all items and clicks "Confirm Submit", **Then** the ratings are saved and a thank you screen is shown.
6. **Given** the rating interface, **When** the user tries to submit without rating all items, **Then** an error message prompts them to complete all ratings.
7. **Given** the rating interface, **When** loading, **Then** a message "Rest assured, the room creator cannot see your individual answers" is displayed.

---

### User Story 3 - Creator Calculates and Sends Results (Priority: P1)

The creator wants to close the room, calculate compatibility between players, and email the results to everyone.

**Why this priority**: Delivers the final value of the product (finding alike people).

**Independent Test**: Can be tested by logging in as creator, triggering the calculation, and verifying emails are sent (mocked).

**Acceptance Scenarios**:

1. **Given** the homepage, **When** the creator selects "Login to Send Results", **Then** they are prompted for Room ID and Password.
2. **Given** valid credentials, **When** the creator logs in, **Then** they see the current count of completed participants.
3. **Given** the admin dashboard, **When** the creator clicks "Confirm Send Results", **Then** a loading spinner appears, and the button is disabled.
4. **Given** the calculation process, **When** it completes, **Then** the system identifies the top 3 most similar players for each participant.
5. **Given** the calculation results, **When** emails are sent, **Then** each participant receives their specific results.
6. **Given** successful execution, **When** the process finishes, **Then** a completion message is displayed to the creator.

### Edge Cases

- What happens when a room has fewer than 4 players? (Calculation might return fewer than 3 matches)
- How does system handle concurrent submissions during calculation? (Should room be locked?)
- What happens if the email service fails? (Retry mechanism or error report to creator?)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate unique, readable Room IDs.
- **FR-002**: System MUST require a password for room creation and verify it upon creator login.
- **FR-003**: System MUST allow dynamic addition of rating items by the creator.
- **FR-004**: System MUST validate uniqueness of nicknames within a specific room.
- **FR-005**: System MUST validate that all items are rated before accepting a participant's submission.
- **FR-006**: System MUST calculate similarity scores between all pairs of participants in a room.
- **FR-007**: System MUST send emails to all participants with their top 3 matches.
- **FR-008**: System MUST display a loading state and disable the submit button during result processing.
- **FR-009**: System MUST be mobile-responsive with touch-friendly targets (buttons, stars).

### Key Entities

- **Room**: Stores ID, password hash, topic, status (open/closed).
- **Item**: Represents a thing to be rated (name), belongs to a Room.
- **Participant**: Stores nickname, email, belongs to a Room.
- **Rating**: Stores the score (1-5) given by a Participant for an Item.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a room and set up items in under 2 minutes.
- **SC-002**: 95% of participants complete the rating flow without validation errors.
- **SC-003**: Result emails are triggered within 30 seconds of the creator clicking "Send Results".
- **SC-004**: System supports at least 50 concurrent participants in a single room.
- **SC-005**: Mobile users report zero issues with touch targets (buttons/stars) being too small.
