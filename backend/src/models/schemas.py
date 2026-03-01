from pydantic import BaseModel

class ItemBase(BaseModel):
    name: str
    
class RoomCreate(BaseModel):
    topic: str
    password: str
    include_non_see: bool = False
    items: list[str]

class RoomResponse(BaseModel):
    room_id: int

# US2 Schemas
class JoinRequest(BaseModel):
    nickname: str
    email: str

class JoinResponse(BaseModel):
    participant_id: int

class AnswerItem(BaseModel):
    item_id: int
    score: int | None = None

class AnswerSubmit(BaseModel):
    answers: list[AnswerItem]

class ItemResponse(BaseModel):
    item_id: int
    item_name: str
    order_index: int
    
class RoomDetail(BaseModel):
    room_id: int
    include_non_see: bool
