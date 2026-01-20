import requests
import joblib
import pandas as pd

# Load model TP.HCM
model = joblib.load('hcmc_flood_model.pkl')
API_KEY = "YOUR_OPENWEATHER_KEY"

def check_flood_status(lat, lon, simulated_tide_level=120):
    """
    lat, lon: Tọa độ (TP.HCM)
    simulated_tide_level: Mực nước từ IoT sensor (cm). Mặc định 120cm (chưa ngập).
    """
    
    # 1. Gọi OpenWeather
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    try:
        res = requests.get(url).json()
        
        # Lấy lượng mưa (xử lý nếu trời không mưa)
        rain_1h = res.get('rain', {}).get('1h', 0.0)
        humidity = res['main']['humidity']
        
    except Exception as e:
        # Fallback nếu mất mạng lúc demo
        print(f"Lỗi API: {e}, dùng data mặc định")
        rain_1h = 0.0
        humidity = 80

    # 2. Chuẩn bị Input cho Model
    # Thứ tự cột PHẢI GIỐNG lúctrain: ['rainfall_1h', 'tide_level', 'humidity']
    input_data = pd.DataFrame([[rain_1h, simulated_tide_level, humidity]], 
                              columns=['rainfall_1h', 'tide_level', 'humidity'])
    
    # 3. AI Dự báo
    is_flood = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1] * 100
    
    return {
        "weather": {
            "rain_1h": rain_1h,
            "humidity": humidity
        },
        "sensor": {
            "tide_level_cm": simulated_tide_level
        },
        "prediction": {
            "is_flood": bool(is_flood),
            "risk_score": round(probability, 1),
            "message": "CẢNH BÁO NGẬP LỤT!" if is_flood else "An toàn"
        }
    }

# --- TEST CASE CHO DEMO ---
# Case 1: Trời quang, Triều thấp (Sáng sớm)
print("--- Test 1: Bình thường ---")
print(check_flood_status(10.762, 106.660, simulated_tide_level=110))

# Case 2: Mưa to (Fake data mưa), Triều cường cao (Chiều tối rằm)
# Giả lập mưa 60mm (bạn có thể chỉnh code để fake mưa nếu OpenWeather đang trả về 0)
print("\n--- Test 2: Ngập nặng ---")
# Hack nhẹ để test model: ép mưa = 60mm
# (Trong code thật bạn lấy từ API, nhưng khi demo nhớ chuẩn bị nút bấm để 'Inject' mưa giả)
model_input_test = pd.DataFrame([[60.0, 165.0, 90]], columns=['rainfall_1h', 'tide_level', 'humidity'])
pred = model.predict(model_input_test)[0]
print(f"Kết quả Fake Test: {'NGẬP' if pred else 'KHÔNG'}")