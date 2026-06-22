from pydantic import BaseModel, field_validator

class ItemBase(BaseModel):
    name: str
    
MIN_ITEMS = 5

class RoomCreate(BaseModel):
    topic: str
    password: str
    include_non_see: bool = False
    items: list[str]

    @field_validator('items')
    @classmethod
    def items_must_have_min(cls, v: list[str]) -> list[str]:
        valid = [i for i in v if i.strip()]
        if len(valid) < MIN_ITEMS:
            raise ValueError(f'At least {MIN_ITEMS} items are required')
        return v

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
