import os
import requests
import joblib
import pandas as pd
from dotenv import load_dotenv
from pathlib import Path
from config import supabase_client, HCM_LOCATIONS
from services import (
    get_latest_weather_from_db,
    get_weather_for_location_from_db,
    get_latest_water_levels,
    fetch_from_openweather
)

load_dotenv()

# Load model TP.HCM
model_path = Path(__file__).parent / 'hcmc_flood_model.pkl'
model = joblib.load(model_path)
API_KEY = os.getenv("OPENWEATHER_API_KEY")


def get_weather_from_db(lat, lon):
    """
    Get latest weather data from database for given coordinates
    Returns rain_1h and humidity, or None if not found
    """
    if not supabase_client:
        return None
    
    try:
        # Get all latest weather readings
        weather_readings = get_latest_weather_from_db()
        
        # Find matching location by coordinates
        for reading in weather_readings:
            location = reading.get('location', {})
            if location:
                # Check if coordinates match (with small tolerance for float comparison)
                db_lat = location.get('latitude')
                db_lon = location.get('longitude')
                
                if db_lat and db_lon:
                    if abs(db_lat - lat) < 0.01 and abs(db_lon - lon) < 0.01:
                        current_weather = reading.get('current_weather', [])
                        if current_weather and len(current_weather) > 0:
                            weather = current_weather[0]
                            return {
                                'rain_1h': weather.get('rain_1h') or 0.0,
                                'humidity': weather.get('humidity') or 0
                            }
    except Exception as e:
        print(f"[AI] Error getting weather from DB: {e}")
    
    return None


def get_water_level_from_db(location_name=None):
    """
    Get latest water level from system_logs table
    If location_name is provided, returns that sensor's level
    Otherwise returns the first available sensor reading
    """
    if not supabase_client:
        return None
    
    try:
        water_levels = get_latest_water_levels()
        
        if not water_levels:
            return None
        
        if location_name:
            # Find specific location
            for level in water_levels:
                if level.get('location') == location_name:
                    return level.get('water_level_cm')
        else:
            # Return first available
            return water_levels[0].get('water_level_cm')
            
    except Exception as e:
        print(f"[AI] Error getting water level from DB: {e}")
    
    return None


def check_flood_status(lat, lon, water_level=None, use_database=True):
    """
    Check flood status using AI model
    
    Args:
        lat, lon: Coordinates (TP.HCM)
        water_level: Water level from sensor (cm). If None, will fetch from database
        use_database: If True, fetch weather from database. If False, fetch from OpenWeather API
    
    Returns:
        Dictionary with weather data, sensor data, and prediction
    """
    
    # 1. Get weather data (from DB or API)
    if use_database:
        weather_data = get_weather_from_db(lat, lon)
        if weather_data:
            rain_1h = weather_data['rain_1h']
            humidity = weather_data['humidity']
        else:
            # Fallback to API if not in database
            print(f"[AI] Weather not in DB, fetching from API...")
            try:
                weather_api_data = fetch_from_openweather(lat, lon)
                if weather_api_data:
                    current = weather_api_data.get('current', {})
                    rain_1h = current.get('rain', {}).get('1h', 0.0) or 0.0
                    humidity = current.get('humidity', 80)
                else:
                    rain_1h = 0.0
                    humidity = 80
            except Exception as e:
                print(f"[AI] Error fetching from API: {e}, using defaults")
                rain_1h = 0.0
                humidity = 80
    else:
        # Direct API call (original behavior)
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        try:
            res = requests.get(url).json()
            rain_1h = res.get('rain', {}).get('1h', 0.0) or 0.0
            humidity = res['main']['humidity']
        except Exception as e:
            print(f"[AI] Error calling API: {e}, using defaults")
            rain_1h = 0.0
            humidity = 80
    
    # 2. Get water level (from parameter or database)
    if water_level is None:
        water_level = get_water_level_from_db()
        if water_level is None:
            water_level = 120  # Default fallback
    
    # 3. Prepare input for ML model
    # Column order MUST MATCH training: ['rainfall_1h', 'tide_level', 'humidity']
    input_data = pd.DataFrame([[rain_1h, water_level, humidity]], 
                              columns=['rainfall_1h', 'tide_level', 'humidity'])
    
    # 4. AI Prediction
    is_flood = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1] * 100
    
    return {
        "location": {
            "latitude": lat,
            "longitude": lon
        },
        "weather": {
            "rain_1h": round(rain_1h, 2),
            "humidity": humidity,
            "source": "database" if use_database and weather_data else "api"
        },
        "sensor": {
            "water_level_cm": water_level,
            "source": "database" if water_level else "parameter"
        },
        "prediction": {
            "is_flood": bool(is_flood),
            "risk_score": round(probability, 1),
            "message": "CẢNH BÁO NGẬP LỤT!" if is_flood else "An toàn"
        }
    }


def check_flood_for_location(location_name, use_database=True):
    """
    Check flood status for a named location (e.g., "District 7")
    Automatically fetches coordinates and water level for that location
    """
    # Find location in HCM_LOCATIONS
    location = None
    for loc in HCM_LOCATIONS:
        if loc['name'].lower() == location_name.lower():
            location = loc
            break
    
    if not location:
        return {
            "error": f"Location '{location_name}' not found",
            "available_locations": [loc['name'] for loc in HCM_LOCATIONS]
        }
    
    # Get water level for this location's sensor
    water_level = get_water_level_from_db()
    
    return check_flood_status(
        location['lat'], 
        location['lng'], 
        water_level=water_level,
        use_database=use_database
    )


def check_flood_for_all_locations(use_database=True):
    """
    Check flood status for all monitored HCM locations
    Returns list of predictions
    """
    results = []
    water_level = get_water_level_from_db()
    
    for location in HCM_LOCATIONS:
        result = check_flood_status(
            location['lat'],
            location['lng'],
            water_level=water_level,
            use_database=use_database
        )
        result['location_name'] = location['name']
        results.append(result)
    
    return results

# --- TEST CASES FOR DEMO ---
if __name__ == "__main__":
    print("=" * 70)
    print("AI FLOOD PREDICTION - INTEGRATED WITH DATABASE")
    print("=" * 70)
    
    # Test 1: Check flood for a specific location using database
    print("\n--- Test 1: District 7 (using database) ---")
    result1 = check_flood_for_location("District 7", use_database=True)
    print(result1)
    
    # Test 2: Check flood with specific coordinates and water level
    print("\n--- Test 2: Custom coordinates (110cm water level) ---")
    result2 = check_flood_status(10.762, 106.660, water_level=110, use_database=True)
    print(result2)
    
    # Test 3: Direct API call (fallback mode)
    print("\n--- Test 3: Direct API call (fallback) ---")
    result3 = check_flood_status(10.762, 106.660, water_level=110, use_database=False)
    print(result3)
    
    # Test 4: Check all locations
    print("\n--- Test 4: All locations ---")
    results = check_flood_for_all_locations(use_database=True)
    for r in results:
        print(f"{r.get('location_name', 'Unknown')}: {r['prediction']['message']} (Risk: {r['prediction']['risk_score']}%)")
    
    print("\n" + "=" * 70)