"""
Service Functions for FlowGuard Backend
Handles OpenWeather API calls and stores to existing Supabase schema
"""

import requests
import json
import random
import uuid
from datetime import datetime
from config import (
    API_KEY,
    OPENWEATHER_API_URL,
    supabase_client,
    WATER_LEVEL_SENSORS,
    HCM_LOCATIONS
)


# ============================================
# OPENWEATHER API FUNCTIONS
# ============================================

def fetch_from_openweather(lat: float, lng: float) -> dict | None:
    """
    Internal function to call OpenWeather API
    This is called from backend, API key is hidden from frontend
    """
    try:
        params = {
            'lat': lat,
            'lon': lng,
            'appid': API_KEY,
            'units': 'metric',
            'lang': 'en'
        }
        
        response = requests.get(OPENWEATHER_API_URL, params=params, timeout=10)
        
        if response.status_code == 401:
            print(f"[Backend] ERROR: 401 Unauthorized - Invalid API key")
            return None
        
        if response.status_code != 200:
            print(f"[Backend] ERROR: {response.status_code} - {response.text}")
            return None
        
        data = response.json()
        print(f"[Backend] ✓ Got OpenWeather data for lat={lat}, lng={lng}")
        return data
        
    except requests.exceptions.Timeout:
        print(f"[Backend] ERROR: Request timeout for lat={lat}, lng={lng}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"[Backend] ERROR: Request failed - {e}")
        return None
    except json.JSONDecodeError:
        print(f"[Backend] ERROR: Invalid JSON response")
        return None


def store_weather_to_existing_schema(location_name: str, lat: float, lng: float, weather_data: dict):
    """
    Store weather data to existing Supabase schema tables:
    - location: geographic coordinates
    - weather_request: API request metadata
    - weather_condition: weather condition codes
    - current_weather: current weather data
    
    Uses UPSERT pattern: deletes old data for location → inserts new data
    """
    if not supabase_client or not weather_data:
        print(f"[DEBUG] ✗ store_weather_to_existing_schema skipped: supabase_client={bool(supabase_client)}, weather_data={bool(weather_data)}")
        return False
    
    print(f"[DEBUG] Starting to store weather for {location_name} (lat={lat}, lng={lng})")
    
    try:
        # Step 1: Get or create location entry
        location_data = {
            'latitude': lat,
            'longitude': lng,
            'timezone': weather_data.get('timezone', 'Asia/Ho_Chi_Minh')
        }
        print(f"[DEBUG] Step 1: Deleting old location entries for ({lat}, {lng})...")
        
        # Delete old location entry for these coordinates
        try:
            delete_result = supabase_client.table('location').delete().eq('latitude', lat).eq('longitude', lng).execute()
            print(f"[DEBUG] Step 1a: Deleted old entries")
        except Exception as del_e:
            print(f"[DEBUG] Step 1a: Delete failed (continuing): {del_e}")
            pass
        
        # Insert new location
        print(f"[DEBUG] Step 1b: Inserting location data: {location_data}")
        location_response = supabase_client.table('location').insert(location_data).execute()
        print(f"[DEBUG] Step 1c: Location insert response: {location_response.data}")
        location_id = location_response.data[0]['location_id'] if location_response.data else None
        
        if not location_id:
            print(f"[DEBUG] ✗ Error: Could not get location_id from response")
            return False
        
        print(f"[DEBUG] Step 1d: Got location_id = {location_id}")
        
        # Step 2: Insert weather request metadata
        request_data = {
            'location_id': location_id,
            'request_time': datetime.utcnow().isoformat(),
            'source': 'openweather_api'
        }
        print(f"[DEBUG] Step 2a: Inserting request data: {request_data}")
        
        request_response = supabase_client.table('weather_request').insert(request_data).execute()
        print(f"[DEBUG] Step 2b: Request insert response: {request_response.data}")
        request_id = request_response.data[0]['request_id'] if request_response.data else None
        
        if not request_id:
            print(f"[DEBUG] ✗ Error: Could not get request_id from response")
            return False
        
        print(f"[DEBUG] Step 2c: Got request_id = {request_id}")
        
        # Step 3: Store weather condition
        current = weather_data.get('current', {})
        weather_condition = current.get('weather', [{}])[0]
        condition_id = weather_condition.get('id')
        
        print(f"[DEBUG] Step 3a: Weather condition = {weather_condition}")
        
        if condition_id:
            condition_data = {
                'api_id': condition_id,
                'main': weather_condition.get('main'),
                'description': weather_condition.get('description'),
                'icon': weather_condition.get('icon')
            }
            print(f"[DEBUG] Step 3b: Checking for existing condition with api_id={condition_id}")
            
            # Check if condition exists, if not insert it
            try:
                existing = supabase_client.table('weather_condition').select('*').eq('api_id', condition_id).execute()
                print(f"[DEBUG] Step 3c: Existing conditions: {existing.data}")
                if not existing.data:
                    print(f"[DEBUG] Step 3d: Inserting new condition: {condition_data}")
                    supabase_client.table('weather_condition').insert(condition_data).execute()
                    # Get the new condition_id
                    new_condition = supabase_client.table('weather_condition').select('*').eq('api_id', condition_id).execute()
                    print(f"[DEBUG] Step 3e: New condition response: {new_condition.data}")
                    condition_id = new_condition.data[0]['condition_id'] if new_condition.data else condition_id
                else:
                    # IMPORTANT: Extract the database condition_id from existing record
                    condition_id = existing.data[0]['condition_id']
                    print(f"[DEBUG] Step 3e: Using existing condition_id = {condition_id}")
            except Exception as cond_e:
                print(f"[DEBUG] Step 3: Condition insert error (continuing): {cond_e}")
                pass
        
        # Step 4: Store current weather data
        current_weather_data = {
            'request_id': request_id,
            'dt': current.get('dt'),
            'temp': current.get('temp'),
            'feels_like': current.get('feels_like'),
            'pressure': current.get('pressure'),
            'humidity': current.get('humidity'),
            'dew_point': current.get('dew_point'),
            'uvi': current.get('uvi'),
            'clouds': current.get('clouds'),
            'visibility': current.get('visibility'),
            'wind_speed': current.get('wind_speed'),
            'wind_deg': current.get('wind_deg'),
            'wind_gust': current.get('wind_gust'),
            'rain_1h': current.get('rain', {}).get('1h'),
            'snow_1h': current.get('snow', {}).get('1h'),
            'condition_id': condition_id
        }
        
        print(f"[DEBUG] Step 4a: Current weather data: {current_weather_data}")
        
        # Delete old current weather for this request
        try:
            print(f"[DEBUG] Step 4b: Deleting old current weather for request_id={request_id}")
            supabase_client.table('current_weather').delete().eq('request_id', request_id).execute()
        except Exception as del_e:
            print(f"[DEBUG] Step 4b: Delete failed (continuing): {del_e}")
            pass
        
        # Insert new current weather
        print(f"[DEBUG] Step 4c: Inserting new current weather")
        weather_response = supabase_client.table('current_weather').insert(current_weather_data).execute()
        print(f"[DEBUG] Step 4d: Current weather insert response: {weather_response.data}")
        
        print(f"[Supabase] ✓ Weather stored for {location_name}: {current_weather_data['temp']}°C, {weather_condition.get('main')}")
        return True
        
    except Exception as e:
        print(f"[DEBUG] ✗ Exception in store_weather_to_existing_schema: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


# ============================================
# WATER LEVEL FUNCTIONS
# ============================================

def update_water_level(sensor):
    """
    Simulate water level change for a sensor
    """
    change = random.uniform(1.0, 2.0)
    direction = random.choice([-1, 1])
    new_level = sensor['current_level'] + (change * direction)
    
    # Keep within bounds
    if new_level > 195:
        new_level = 195
    elif new_level < 0:
        new_level = 0
    
    sensor['current_level'] = round(new_level, 2)
    return sensor['current_level']


def upload_water_level_to_supabase():
    """
    Upload water level data to Supabase (runs every 10 seconds)
    Uses UPSERT: replaces data for same location instead of creating duplicates
    """
    if not supabase_client:
        return
    
    try:
        for sensor in WATER_LEVEL_SENSORS:
            # Update water level
            water_level = update_water_level(sensor)
            
            # Prepare data
            data = {
                'id': str(uuid.uuid4()),  # Generate UUID for the id field
                'water_level_cm': water_level,
                'location': sensor['location'],
                # created_at is auto-handled by Supabase
            }
            
            # UPSERT: Delete old data for this location, then insert new
            # This prevents duplicates and always keeps the latest reading
            try:
                # First, delete old entries for this location
                supabase_client.table('system_logs').delete().eq('location', sensor['location']).execute()
                
                # Then insert new data
                response = supabase_client.table('system_logs').insert(data).execute()
                print(f"[Supabase] ✓ {sensor['location']}: {water_level} cm")
                
            except Exception as e:
                print(f"[Supabase] Error for {sensor['location']}: {e}")
                
    except Exception as e:
        print(f"[Supabase] Error updating water levels: {e}")


def get_latest_water_levels():
    """
    Retrieve latest water level readings from Supabase
    """
    if not supabase_client:
        return []
    
    try:
        response = supabase_client.table('system_logs').select('*').execute()
        return response.data if hasattr(response, 'data') else []
    except Exception as e:
        print(f"[Supabase] Error retrieving water levels: {e}")
        return []

# ============================================
# DATA RETRIEVAL FUNCTIONS
# ============================================

def get_weather_for_all_districts():
    """
    Fetch weather data for all HCM districts
    Automatically stores data to existing Supabase schema when fetched
    """
    results = []
    
    for location in HCM_LOCATIONS:
        print(f"[Backend] Fetching {location['name']}...")
        
        weather_data = fetch_from_openweather(location['lat'], location['lng'])
        
        if weather_data:
            # Store to existing Supabase schema
            store_weather_to_existing_schema(location['name'], location['lat'], location['lng'], weather_data)
            
            results.append({
                'location_name': location['name'],
                'latitude': location['lat'],
                'longitude': location['lng'],
                'weather_data': weather_data
            })
    
    return results


def get_weather_for_district(district_name: str):
    """
    Fetch weather data for specific district
    Automatically stores data to existing Supabase schema when fetched
    """
    location = next((loc for loc in HCM_LOCATIONS if loc['name'].lower() == district_name.lower()), None)
    
    if not location:
        return None
    
    weather_data = fetch_from_openweather(location['lat'], location['lng'])
    
    if weather_data:
        # Store to existing Supabase schema
        store_weather_to_existing_schema(location['name'], location['lat'], location['lng'], weather_data)
    
    return weather_data


def get_weather_for_coordinates(lat: float, lng: float):
    """
    Fetch weather data for custom coordinates
    Automatically stores data to existing Supabase schema when fetched
    """
    weather_data = fetch_from_openweather(lat, lng)
    
    if weather_data:
        # Store to existing Supabase schema
        location_name = f"Custom_{lat:.4f}_{lng:.4f}"
        store_weather_to_existing_schema(location_name, lat, lng, weather_data)
    
    return weather_data


def get_all_weather_alerts():
    """
    Fetch weather alerts for all HCM locations
    """
    alerts = []
    
    for location in HCM_LOCATIONS:
        weather_data = fetch_from_openweather(location['lat'], location['lng'])
        
        if weather_data and 'alerts' in weather_data:
            for alert in weather_data['alerts']:
                alerts.append({
                    'location': location['name'],
                    'alert': alert
                })
    
    return alerts


def get_latest_weather_from_db():
    """
    Retrieve latest weather from database (existing schema)
    Joins: weather_request → location → current_weather → weather_condition
    """
    if not supabase_client:
        return []
    
    try:
        # Get the latest weather request for each location
        response = supabase_client.table('weather_request').select(
            '*, location(latitude, longitude, timezone), current_weather(*, weather_condition(*))'
        ).order('request_time', desc=True).limit(5).execute()
        
        return response.data if hasattr(response, 'data') else []
    except Exception as e:
        print(f"[Supabase] Error retrieving weather: {e}")
        return []


def get_weather_for_location_from_db(location_id: int):
    """
    Get latest weather for specific location from database
    """
    if not supabase_client:
        return None
    
    try:
        response = supabase_client.table('weather_request').select(
            '*, location(latitude, longitude, timezone), current_weather(*, weather_condition(*))'
        ).eq('location_id', location_id).order('request_time', desc=True).limit(1).execute()
        
        data = response.data if hasattr(response, 'data') else []
        return data[0] if data else None
    except Exception as e:
        print(f"[Supabase] Error retrieving weather for location {location_id}: {e}")
        return None
