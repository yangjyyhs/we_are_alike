from datetime import datetime
from pydantic import BaseModel

# Room
class RoomBase(BaseModel):
    room_id: int
    topic: str
    include_non_see: bool

class Room(RoomBase):
    created_at: datetime
    
# Item
class Item(BaseModel):
    item_id: int
    room_id: int
    item_name: str
    order_index: int

# Participant
class Participant(BaseModel):
    participant_id: int
    room_id: int
    nick_name: str
    email: str
    submitted_at: datetime | None = None

# Answer
class Answer(BaseModel):
    answer_id: int
    participant_id: int
    room_id: int
    item_id: int
    score: int | None = None