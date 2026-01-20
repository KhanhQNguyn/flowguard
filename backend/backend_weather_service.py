"""
FlowGuard Backend Weather Service
Handles OpenWeather API calls and serves data to frontend
API calls are hidden on backend (secure), frontend only receives data

Requirements:
    pip install -r requirements.txt

Run:
    python backend_weather_service.py
    
Server runs at: http://localhost:5000
"""

import os
import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

API_KEY = os.getenv('OPENWEATHER_API_KEY')
if not API_KEY:
    print("ERROR: OPENWEATHER_API_KEY not set in .env file")
    exit(1)

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# HCM Districts (same as FlowGuard)
HCM_LOCATIONS = [
    {'name': 'District 1', 'lat': 10.757, 'lng': 106.682},
    {'name': 'District 3', 'lat': 10.795, 'lng': 106.673},
    {'name': 'District 4', 'lat': 10.788, 'lng': 106.703},
    {'name': 'District 7', 'lat': 10.7356, 'lng': 106.7019},
    {'name': 'Phú Nhuận', 'lat': 10.798, 'lng': 106.686},
]

OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/3.0/onecall'

print(f"[Backend] Initialized at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"[Backend] API Key: {API_KEY[:10]}...")
print(f"[Backend] Monitoring {len(HCM_LOCATIONS)} HCM locations")


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
# API ENDPOINTS
# ============================================

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'FlowGuard Weather Backend',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/weather/all', methods=['GET'])
def get_all_weather():
    """
    Get weather for all HCM districts
    Frontend calls this to get all sensor data
    """
    print(f"\n[Backend] REQUEST: GET /api/weather/all")
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
    
    print(f"[Backend] ✓ Returning {len(results)} weather datasets")
    return jsonify({
        'success': True,
        'count': len(results),
        'timestamp': datetime.now().isoformat(),
        'data': results
    })


@app.route('/api/weather/district/<district_name>', methods=['GET'])
def get_weather_by_district(district_name):
    """
    Get weather for specific district
    Frontend calls this for individual district
    
    Example: /api/weather/district/District%207
    """
    print(f"\n[Backend] REQUEST: GET /api/weather/district/{district_name}")
    
    # Find location
    location = None
    for loc in HCM_LOCATIONS:
        if loc['name'].lower() == district_name.lower():
            location = loc
            break
    
    if not location:
        print(f"[Backend] ERROR: District '{district_name}' not found")
        return jsonify({
            'success': False,
            'error': f'District "{district_name}" not found',
            'available_districts': [loc['name'] for loc in HCM_LOCATIONS]
        }), 404
    
    print(f"[Backend] Fetching for {location['name']}...")
    weather_data = fetch_from_openweather(location['lat'], location['lng'])
    
    if not weather_data:
        print(f"[Backend] ERROR: Failed to fetch weather")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch weather from OpenWeather'
        }), 500
    
    print(f"[Backend] ✓ Returning weather for {location['name']}")
    return jsonify({
        'success': True,
        'location_name': location['name'],
        'latitude': location['lat'],
        'longitude': location['lng'],
        'timestamp': datetime.now().isoformat(),
        'data': weather_data
    })


@app.route('/api/weather/coords/<float:lat>/<float:lng>', methods=['GET'])
def get_weather_by_coords(lat, lng):
    """
    Get weather for custom coordinates
    Example: /api/weather/coords/10.757/106.682
    """
    print(f"\n[Backend] REQUEST: GET /api/weather/coords/{lat}/{lng}")
    
    weather_data = fetch_from_openweather(lat, lng)
    
    if not weather_data:
        return jsonify({
            'success': False,
            'error': 'Failed to fetch weather'
        }), 500
    
    return jsonify({
        'success': True,
        'latitude': lat,
        'longitude': lng,
        'timestamp': datetime.now().isoformat(),
        'data': weather_data
    })


@app.route('/api/weather/alerts', methods=['GET'])
def get_all_alerts():
    """
    Get weather alerts for all HCM locations
    """
    print(f"\n[Backend] REQUEST: GET /api/weather/alerts")
    
    alerts = []
    
    for location in HCM_LOCATIONS:
        weather_data = fetch_from_openweather(location['lat'], location['lng'])
        
        if weather_data and 'alerts' in weather_data:
            for alert in weather_data['alerts']:
                alerts.append({
                    'location': location['name'],
                    'alert': alert
                })
    
    print(f"[Backend] ✓ Found {len(alerts)} total alerts")
    return jsonify({
        'success': True,
        'count': len(alerts),
        'timestamp': datetime.now().isoformat(),
        'alerts': alerts
    })


@app.route('/api/locations', methods=['GET'])
def get_locations():
    """
    Get list of monitored locations
    """
    print(f"\n[Backend] REQUEST: GET /api/locations")
    
    return jsonify({
        'success': True,
        'count': len(HCM_LOCATIONS),
        'locations': HCM_LOCATIONS
    })


# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'available_endpoints': {
            'GET /health': 'Health check',
            'GET /api/weather/all': 'Get weather for all districts',
            'GET /api/weather/district/<name>': 'Get weather for specific district',
            'GET /api/weather/coords/<lat>/<lng>': 'Get weather for coordinates',
            'GET /api/weather/alerts': 'Get all weather alerts',
            'GET /api/locations': 'Get monitored locations'
        }
    }), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("FlowGuard Weather Backend Service")
    print("="*60)
    print(f"Starting server at http://localhost:5000")
    print(f"CORS enabled for frontend")
    print("\nAvailable endpoints:")
    print("  GET http://localhost:5000/health")
    print("  GET http://localhost:5000/api/weather/all")
    print("  GET http://localhost:5000/api/weather/district/District%207")
    print("  GET http://localhost:5000/api/weather/coords/10.757/106.682")
    print("  GET http://localhost:5000/api/weather/alerts")
    print("  GET http://localhost:5000/api/locations")
    print("\nPress Ctrl+C to stop")
    print("="*60 + "\n")
    
    app.run(debug=True, port=5000, host='localhost')
