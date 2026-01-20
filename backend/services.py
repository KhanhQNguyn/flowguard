"""
Service Functions for FlowGuard Backend
Handles OpenWeather API calls and water level data collection
"""

import requests
import json
import random
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
    """
    results = []
    
    for location in HCM_LOCATIONS:
        print(f"[Backend] Fetching {location['name']}...")
        
        weather_data = fetch_from_openweather(location['lat'], location['lng'])
        
        if weather_data:
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
    """
    location = next((loc for loc in HCM_LOCATIONS if loc['name'].lower() == district_name.lower()), None)
    
    if not location:
        return None
    
    return fetch_from_openweather(location['lat'], location['lng'])


def get_weather_for_coordinates(lat: float, lng: float):
    """
    Fetch weather data for custom coordinates
    """
    return fetch_from_openweather(lat, lng)


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
