import os
import time
import random
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client

# Try to use shared config first, fallback to local env vars
try:
    from config import supabase_client
    if supabase_client:
        supabase = supabase_client
        print("[Water Level] Using shared Supabase client from config")
    else:
        raise ImportError
except (ImportError, AttributeError):
    # Fallback to local configuration
    load_dotenv()
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY") or os.getenv("SERVICE_ROLE_PRIVATE")
    if url and key:
        supabase: Client = create_client(url, key)
        print("[Water Level] Using local Supabase client")
    else:
        raise ValueError("Supabase configuration not found. Please set SUPABASE_URL and SUPABASE_KEY in .env")

def get_current_mode():
    try:
        response = supabase.table("sensor_config").select("mode").eq("id", 1).execute()
        if response.data:
            return str(response.data[0]['mode']).upper()
    except Exception:
        pass
    return 'SAFE'

def simulate_and_upload():
    current_level = 0.0 
    sensor_location = "Sensor_Tram_A"

    print("--- Bắt đầu mô phỏng theo 3 chế độ (SAFE, WARNING, CRITICAL) ---")

    try:
        while True:
            mode = get_current_mode()
            
            min_val, max_val = 0, 0
            
            if mode == 'SAFE':
                min_val, max_val = 0, 0
                
            elif mode == 'WARNING':
                min_val, max_val = 1, 40
                
            elif mode == 'CRITICAL':
                min_val, max_val = 41, 100
            
            if mode == 'SAFE':
                current_level = 0.0
            else:
                if current_level < min_val or current_level > max_val:
                    current_level = random.uniform(min_val, max_val)
                else:
                    change = random.uniform(1.0, 3.0)
                    direction = random.choice([-1, 1])
                    new_level = current_level + (change * direction)
                    
                    if new_level > max_val: new_level = max_val
                    elif new_level < min_val: new_level = min_val
                    
                    current_level = round(new_level, 2)

            log_id = str(uuid.uuid4())
            data_payload = {
                "id": log_id,
                "water_level_cm": current_level,
                "location": sensor_location,
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }

            try:
                supabase.table("system_logs").insert(data_payload).execute()
                print(f" [Mode: {mode}] Level: {current_level} cm")
            except Exception as e:
                print(f" [Error] {e}")

            time.sleep(2)

    except KeyboardInterrupt:
        print("Stop.")

if __name__ == "__main__":
    simulate_and_upload()