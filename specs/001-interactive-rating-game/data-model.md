# Data Model: Interactive Rating Game

**Branch**: `001-interactive-rating-game`

## Database Schema (Supabase / PostgreSQL)

**Note**: All Foreign Keys must have `ON DELETE CASCADE`.

### 1. Room_info
Stores the room configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `room_id` | `int8` | `PRIMARY KEY` | Unique 10-digit ID. |
| `room_password` | `text` | `NOT NULL` | Bcrypt hash of the password. |
| `topic` | `text` | `NOT NULL` | The topic of the rating room (e.g., "Food"). **(Added to support User Journey)** |
| `include_non_see` | `bool` | `NOT NULL, DEFAULT false` | Whether "I haven't seen it" option is enabled. |
| `created_at` | `timestamptz` | `NOT NULL, DEFAULT now()` | Creation time. Used for 7-day cleanup. |

### 2. Room_items
Stores the items to be rated in a room.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `item_id` | `int8` | `PRIMARY KEY` | Auto-incrementing ID. |
| `room_id` | `int8` | `FOREIGN KEY (Room_info.room_id) ON DELETE CASCADE` | Link to room. |
| `item_name` | `text` | `NOT NULL` | Name of the item (e.g., "Burger"). |
| `order_index` | `int` | `NOT NULL` | Display order of the item. |

### 3. Participant_info
Stores participant details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `participant_id` | `int8` | `PRIMARY KEY` | Auto-incrementing ID. |
| `room_id` | `int8` | `FOREIGN KEY (Room_info.room_id) ON DELETE CASCADE` | Link to room. |
| `nick_name` | `text` | `NOT NULL` | Display name. |
| `email` | `text` | `NOT NULL` | Email to receive results. |
| `submitted_at` | `timestamptz` | `DEFAULT now()` | **(Optional)** Timestamp of submission. |

**Constraints**:
- `UNIQUE(room_id, nick_name)`: Prevent duplicate nicknames in the same room.

### 4. Participant_answer
Stores the ratings given by participants.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `answer_id` | `int8` | `PRIMARY KEY` | Auto-incrementing ID. |
| `participant_id` | `int8` | `FOREIGN KEY (Participant_info.participant_id) ON DELETE CASCADE` | Link to participant. |
| `room_id` | `int8` | `FOREIGN KEY (Room_info.room_id) ON DELETE CASCADE` | Redundant but useful for partitioning/queries. |
| `item_id` | `int8` | `FOREIGN KEY (Room_items.item_id) ON DELETE CASCADE` | Link to item. |
| `score` | `int8` | `NULLABLE` | Rating (1-5), or NULL for "I haven't seen it". |

## Indexes
- `Room_info(created_at)`: For efficient 7-day cleanup queries.
- `Participant_answer(room_id)`: For efficient aggregation during calculation.
