from fastapi import APIRouter, HTTPException
from src.models.schemas import RoomCreate, RoomResponse, RoomDetail, ItemResponse
from src.services.room_service import create_new_room_logic
from src.core.database import supabase

router = APIRouter()

@router.post("/", response_model=RoomResponse, status_code=201)
def create_room_endpoint(room: RoomCreate):
    try:
        room_id = create_new_room_logic(
            topic=room.topic,
            password=room.password,
            include_non_see=room.include_non_see,
            items=room.items
        )
        return {"room_id": room_id}
    except Exception as e:
        print(f"Error creating room: {e}")
        raise HTTPException(status_code=400, detail="Failed to create room")

@router.get("/{room_id}", response_model=RoomDetail)
def get_room_details(room_id: int):
    try:
        res = supabase.table("Room_info").select("room_id, include_non_see").eq("room_id", room_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Room not found")
        return res.data[0]
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"Error fetching room: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/{room_id}/items", response_model=list[ItemResponse])
def get_room_items(room_id: int):
    try:
        res = supabase.table("Room_items").select("item_id, item_name, order_index").eq("room_id", room_id).order("order_index").execute()
        return res.data
    except Exception as e:
        print(f"Error fetching items: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
