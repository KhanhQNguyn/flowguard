import os
import time
import random
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Hàm lấy chế độ hiện tại từ bảng sensor_config
def get_current_mode():
    try:
        # Lấy dòng có id = 1
        response = supabase.table("sensor_config").select("mode").eq("id", 1).execute()
        if response.data:
            return response.data[0]['mode'] # Trả về 'SAFE', 'WARNING', 'CRITICAL'
    except Exception:
        pass
    return 'SAFE' # Mặc định nếu lỗi

def simulate_and_upload():
    # Giá trị khởi tạo
    current_level = 0.0 
    sensor_location = "Sensor_Tram_A"

    print("--- Bắt đầu mô phỏng theo 3 chế độ (SAFE, WARNING, CRITICAL) ---")

    try:
        while True:
            # 1. Đọc chế độ từ Database (do Frontend điều khiển)
            mode = get_current_mode()
            
            # 2. Cấu hình giới hạn dựa trên chế độ
            min_val, max_val = 0, 0
            
            if mode == 'SAFE':
                # Chế độ an toàn: Mức nước bằng 0 (hoặc xấp xỉ 0)
                min_val, max_val = 0, 0
                
            elif mode == 'WARNING':
                # Chế độ cảnh báo: 1cm - 40cm
                min_val, max_val = 1, 40
                
            elif mode == 'CRITICAL':
                # Chế độ nguy hiểm: 41cm - 100cm
                min_val, max_val = 41, 100
            
            # 3. Logic điều chỉnh mực nước
            if mode == 'SAFE':
                current_level = 0.0
            else:
                # Nếu mực nước hiện tại đang nằm NGOÀI vùng cho phép (do mới chuyển chế độ)
                # Thì gán ngay nó vào điểm bắt đầu của vùng đó để demo cho nhanh thấy
                if current_level < min_val or current_level > max_val:
                    current_level = random.uniform(min_val, max_val)
                else:
                    # Nếu đang ở trong vùng rồi thì nhấp nhô nhẹ (Random Walk)
                    change = random.uniform(1.0, 3.0) # Nhảy 1-3cm cho sinh động
                    direction = random.choice([-1, 1])
                    new_level = current_level + (change * direction)
                    
                    # Đảm bảo không văng ra khỏi range của chế độ hiện tại
                    if new_level > max_val: new_level = max_val
                    elif new_level < min_val: new_level = min_val
                    
                    current_level = round(new_level, 2)

            # 4. Gửi dữ liệu (Log)
            log_id = str(uuid.uuid4())
            data_payload = {
                "id": log_id,
                "water_level_cm": current_level,
                "location": sensor_location
            }

            try:
                supabase.table("system_logs").insert(data_payload).execute()
                print(f" [Mode: {mode}] Level: {current_level} cm")
            except Exception as e:
                print(f" [Error] {e}")

            # Chờ 2 giây
            time.sleep(2)

    except KeyboardInterrupt:
        print("Stop.")

if __name__ == "__main__":
    simulate_and_upload()