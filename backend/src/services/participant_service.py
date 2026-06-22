from src.core.database import supabase
from src.models.schemas import JoinRequest, AnswerSubmit

def join_room_logic(room_id: int, data: JoinRequest) -> int:
    try:
        # Check room exists first to give better error than FK violation
        room_check = supabase.table("room_info").select("room_id").eq("room_id", room_id).execute()
        if not room_check.data:
            raise ValueError("Room not found")

        res = supabase.table("participant_info").insert({
            "room_id": room_id,
            "nick_name": data.nickname,
            "email": data.email
        }).execute()
        return res.data[0]["participant_id"]
    except Exception as e:
        # Supabase Python client might wrap error in postgrest.exceptions.APIError
        err_msg = str(e).lower()
        if "duplicate key" in err_msg or "unique constraint" in err_msg:
            raise ValueError("Nickname already taken")
        if "foreign key" in err_msg:
             raise ValueError("Room not found")
        raise e

def submit_answers_logic(participant_id: int, room_id: int, data: AnswerSubmit):
    if not data.answers:
        return
        
    answers_data = [
        {
            "participant_id": participant_id,
            "room_id": room_id,
            "item_id": a.item_id,
            "score": a.score
        }
        for a in data.answers
    ]
    try:
        supabase.table("participant_answer").insert(answers_data).execute()
    except Exception as e:
        print(f"Error submitting answers: {e}")
        raise e
