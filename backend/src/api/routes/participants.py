from fastapi import APIRouter, HTTPException
from src.models.schemas import JoinRequest, JoinResponse, AnswerSubmit
from src.services.participant_service import join_room_logic, submit_answers_logic
from src.core.database import supabase

router = APIRouter()

@router.post("/rooms/{room_id}/join", response_model=JoinResponse)
def join_room_endpoint(room_id: int, data: JoinRequest):
    try:
        pid = join_room_logic(room_id, data)
        return {"participant_id": pid}
    except ValueError as e:
        err_msg = str(e).lower()
        if "not found" in err_msg:
            raise HTTPException(status_code=404, detail=str(e))
        if "taken" in err_msg:
            raise HTTPException(status_code=409, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Join error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/participants/{participant_id}/answers")
def submit_answers_endpoint(participant_id: int, data: AnswerSubmit):
    try:
        # Fetch room_id from participant to ensure validity and partition data
        res = supabase.table("Participant_info").select("room_id").eq("participant_id", participant_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Participant not found")
        room_id = res.data[0]["room_id"]
        
        submit_answers_logic(participant_id, room_id, data)
        return {"message": "Success"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Submit error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
