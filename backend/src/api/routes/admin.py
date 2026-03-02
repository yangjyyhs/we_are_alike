from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Header
from pydantic import BaseModel
import base64
from src.core.database import supabase
from src.core.security import verify_password
from src.services.math_service import calculate_similarity
from src.core.mail import send_results_email

router = APIRouter()

# Guard against duplicate calculation per room (resets on server restart)
_calculated_rooms: set[int] = set()

class AdminLoginRequest(BaseModel):
    room_id: int
    password: str

class AdminLoginResponse(BaseModel):
    token: str

class StatsResponse(BaseModel):
    participant_count: int
    participants: list[str]

def get_current_room(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Token")
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid Scheme")
        
        decoded = base64.b64decode(token).decode()
        room_id_str, pwd_hash = decoded.split(":", 1)
        room_id = int(room_id_str)
        
        # Verify against DB
        res = supabase.table("Room_info").select("room_password").eq("room_id", room_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Room not found")
        
        db_hash = res.data[0]["room_password"]
        if db_hash != pwd_hash:
             raise HTTPException(status_code=401, detail="Invalid Token")
             
        return room_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Token")

@router.post("/login", response_model=AdminLoginResponse)
def admin_login(data: AdminLoginRequest):
    try:
        res = supabase.table("Room_info").select("room_password").eq("room_id", data.room_id).execute()
        if not res.data:
             raise HTTPException(status_code=404, detail="Room not found")
             
        hashed_pwd = res.data[0]["room_password"]
        if not verify_password(data.password, hashed_pwd):
            raise HTTPException(status_code=401, detail="Invalid password")
            
        raw = f"{data.room_id}:{hashed_pwd}"
        token = base64.b64encode(raw.encode()).decode()
        return {"token": token}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/stats/{room_id}", response_model=StatsResponse)
def get_stats(room_id: int, current_room_id: int = Depends(get_current_room)):
    if room_id != current_room_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        res = supabase.table("Participant_info").select("nick_name").eq("room_id", room_id).execute()
        participants = [p["nick_name"] for p in res.data]
        return {
            "participant_count": len(participants),
            "participants": participants
        }
    except Exception as e:
        print(f"Stats error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

async def run_calculation_task(room_id: int):
    print(f"Starting calculation for room {room_id}")
    try:
        # 1. Participants
        p_res = supabase.table("Participant_info").select("*").eq("room_id", room_id).execute()
        participants = p_res.data
        
        # 2. Items
        i_res = supabase.table("Room_items").select("*").eq("room_id", room_id).order("order_index").execute()
        items = i_res.data
        
        # 3. Answers
        a_res = supabase.table("Participant_answer").select("*").eq("room_id", room_id).execute()
        answers = a_res.data
        
        if not participants:
            print("No participants.")
            return

        # Calculate
        results = calculate_similarity(participants, items, answers)
        
        # Send Emails
        for p in participants:
            pid = p['participant_id']
            matches = results.get(pid, [])
            if matches:
                await send_results_email(p['email'], p['nick_name'], matches)
                
        print(f"Calculation & Emails completed for room {room_id}")

        # Cleanup: delete all room data (child tables first, then parent)
        try:
            supabase.table("Participant_answer").delete().eq("room_id", room_id).execute()
            supabase.table("Participant_info").delete().eq("room_id", room_id).execute()
            supabase.table("Room_items").delete().eq("room_id", room_id).execute()
            supabase.table("Room_info").delete().eq("room_id", room_id).execute()
            print(f"Room {room_id} data cleaned up from database.")
        except Exception as cleanup_err:
            print(f"Cleanup failed for room {room_id}: {cleanup_err}")
        
    except Exception as e:
        print(f"Calculation task failed: {e}")

@router.post("/calculate/{room_id}", status_code=202)
def trigger_calculation(room_id: int, background_tasks: BackgroundTasks, current_room_id: int = Depends(get_current_room)):
    if room_id != current_room_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    if room_id in _calculated_rooms:
        raise HTTPException(status_code=409, detail="Results already sent for this room")

    _calculated_rooms.add(room_id)
    background_tasks.add_task(run_calculation_task, room_id)
    return {"message": "Calculation started"}
