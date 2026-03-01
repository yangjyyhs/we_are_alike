import random
from datetime import datetime, timedelta
from src.core.database import supabase
from src.core.security import get_password_hash

def generate_room_id() -> int:
    return random.randint(1000000000, 9999999999)

def cleanup_old_rooms():
    # Delete rooms older than 7 days
    try:
        cutoff = (datetime.utcnow() - timedelta(days=7)).isoformat()
        # Supabase Python client syntax check: .delete().lt("created_at", cutoff).execute()
        # Need to ensure correct method chaining.
        supabase.table("Room_info").delete().lt("created_at", cutoff).execute()
    except Exception as e:
        print(f"Cleanup failed: {e}")

def create_new_room_logic(topic: str, password: str, include_non_see: bool, items: list[str]) -> int:
    # 1. Cleanup
    cleanup_old_rooms()
    
    # 2. Generate ID & Hash Password
    # Simple retry logic for collision
    for _ in range(3):
        try:
            room_id = generate_room_id()
            hashed_pwd = get_password_hash(password)
            
            # 3. Insert Room
            room_data = {
                "room_id": room_id,
                "room_password": hashed_pwd,
                "include_non_see": include_non_see
            }
            # Execute insert
            res = supabase.table("Room_info").insert(room_data).execute()
            
            # If successful (no exception), insert items
            if items:
                items_data = [
                    {"room_id": room_id, "item_name": item, "order_index": idx}
                    for idx, item in enumerate(items)
                ]
                supabase.table("Room_items").insert(items_data).execute()
            
            return room_id
            
        except Exception as e:
            # Check for duplicate key constraint? Supabase throws
            # Assuming uniqueness collision. Retry.
            print(f"Room creation attempt failed: {e}")
            continue
            
    raise Exception("Failed to create room after retries")
