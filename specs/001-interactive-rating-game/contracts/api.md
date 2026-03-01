# API Contract: Interactive Rating Game

**Branch**: `001-interactive-rating-game`

## Base URL
`/api/v1`

## Rooms

### 1. Create Room
**POST** `/rooms`

- **Request Body**:
  ```json
  {
    "password": "hashed_password", 
    "topic": "Food",
    "include_non_see": true,
    "items": ["Burger", "Pizza"]
  }
  ```
- **Response**:
  - `201 Created`: `{ "room_id": "1234567890" }`
  - `400 Bad Request`: Validation error.

### 2. Get Room Info (Public/Check)
**GET** `/rooms/{room_id}`

- **Response**:
  - `200 OK`: `{ "room_id": "1234567890", "topic": "Food", "include_non_see": true }`
  - `404 Not Found`: "Room not found".

### 3. Get Room Items
**GET** `/rooms/{room_id}/items`

- **Response**:
  - `200 OK`: `[{ "item_id": 1, "name": "Burger" }, { "item_id": 2, "name": "Pizza" }]`

## Participants

### 4. Check/Join Room (Validate Nickname)
**POST** `/rooms/{room_id}/join`

- **Request Body**:
  ```json
  {
    "nickname": "Jayson",
    "email": "jayson@example.com"
  }
  ```
- **Response**:
  - `200 OK`: `{ "participant_id": 101, "token": "..." }` (Token optional for MVP if ID sufficient)
  - `409 Conflict`: "Nickname already taken".
  - `404 Not Found`: "Room not found".

### 5. Submit Answers
**POST** `/participants/{participant_id}/answers`

- **Request Body**:
  ```json
  {
    "answers": [
      { "item_id": 1, "score": 5 },
      { "item_id": 2, "score": null }
    ]
  }
  ```
- **Response**:
  - `200 OK`: `{ "message": "Success" }`

## Admin

### 6. Admin Login
**POST** `/admin/login`

- **Request Body**:
  ```json
  {
    "room_id": "1234567890",
    "password": "plaintext_password"
  }
  ```
- **Response**:
  - `200 OK`: `{ "token": "admin_token" }`
  - `401 Unauthorized`: "Invalid password".

### 7. Get Stats
**GET** `/admin/stats/{room_id}`
- **Headers**: `Authorization: Bearer admin_token`
- **Response**:
  - `200 OK`: `{ "participant_count": 5, "participants": ["Alice", "Bob"] }`

### 8. Calculate & Send Results
**POST** `/admin/calculate/{room_id}`
- **Headers**: `Authorization: Bearer admin_token`
- **Response**:
  - `202 Accepted`: `{ "message": "Calculation started, emails will be sent shortly." }`
