import os
import time
import random
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# --- CẤU HÌNH SUPABASE ---
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
if not url or not key:
    raise ValueError("Lỗi: Không tìm thấy SUPABASE_URL hoặc SUPABASE_KEY trong file .env")
    
supabase: Client = create_client(url, key)

def simulate_and_upload():
    current_level = 100.0
    sensor_location = "Sensor_Tram_A"

    print(f"--- Bắt đầu gửi dữ liệu IoT (có UUID) tới Supabase ---")

    try:
        while True:
            # --- Logic Random Mực nước ---
            change = random.uniform(1.0, 2.0)
            direction = random.choice([-1, 1])
            new_level = current_level + (change * direction)

            if new_level > 195: new_level = 195
            elif new_level < 0: new_level = 0
            
            current_level = round(new_level, 2)

            # --- 2. Tạo UUID ngẫu nhiên ---
            # uuid4() tạo ra UUID ngẫu nhiên hoàn toàn
            log_id = str(uuid.uuid4()) 

            # --- 3. Cập nhật Payload ---
            data_payload = {
                "id": log_id,  # <--- Thêm trường ID vào đây
                "water_level_cm": current_level,
                "location": sensor_location,
            }

            try:
                response = supabase.table("system_logs").insert(data_payload).execute()
                print(f" [Uploaded] ID: {log_id[:8]}... | Level: {current_level} cm")
            
            except Exception as e:
                print(f" [Error] Lỗi gửi dữ liệu: {e}")

            time.sleep(2)

    except KeyboardInterrupt:
        print("\n--- Đã dừng mô phỏng ---")

if __name__ == "__main__":
    simulate_and_upload()