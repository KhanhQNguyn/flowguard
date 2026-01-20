"""
FlowGuard Backend Weather Service - Main Flask Application
Handles routing and API endpoints

Requirements:
    pip install -r requirements.txt

Run:
    python backend_weather_service.py
    
Server runs at: http://localhost:5000
"""

from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

from config import (
    HCM_LOCATIONS,
    WATER_LEVEL_SENSORS,
    MOCK_DISTRICTS,
    MOCK_ALERTS,
    MOCK_SENSORS,
    supabase_client,
    API_KEY
)
from services import (
    fetch_from_openweather,
    upload_water_level_to_supabase,
    get_latest_water_levels,
    get_weather_for_all_districts,
    get_weather_for_district,
    get_weather_for_coordinates,
    get_all_weather_alerts
)

app = Flask(__name__)
CORS(app)

print(f"\n[Backend] Initialized at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"[Backend] API Key: {API_KEY[:10]}...")
print(f"[Backend] Monitoring {len(HCM_LOCATIONS)} HCM locations")
print(f"[Backend] Monitoring {len(WATER_LEVEL_SENSORS)} water level sensors")


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


@app.route('/api/water-level/latest', methods=['GET'])
def get_latest_water_levels():
    """
    Get latest water level readings from Supabase
    """
    print(f"\n[Backend] REQUEST: GET /api/water-level/latest")
    
    if not supabase_client:
        return jsonify({
            'success': False,
            'error': 'Supabase not configured'
        }), 503
    
    try:
        response = supabase_client.table('system_logs').select('*').execute()
        
        data = response.data if hasattr(response, 'data') else []
        
        return jsonify({
            'success': True,
            'count': len(data),
            'timestamp': datetime.now().isoformat(),
            'readings': data
        })
    except Exception as e:
        print(f"[Backend] ERROR: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/water-level/sensors', methods=['GET'])
def get_water_level_sensors():
    """
    Get list of water level sensors
    """
    print(f"\n[Backend] REQUEST: GET /api/water-level/sensors")
    
    return jsonify({
        'success': True,
        'count': len(WATER_LEVEL_SENSORS),
        'sensors': WATER_LEVEL_SENSORS
    })


# ============================================
# MVP MOCK DATA ENDPOINTS
# ============================================

@app.route('/api/districts/summary', methods=['GET'])
def get_districts_summary():
    """
    Get all districts with summary (alert count, risk level)
    Used by frontend for 'Nearby Districts' component
    """
    print(f"\n[Backend] REQUEST: GET /api/districts/summary")
    
    return jsonify({
        'success': True,
        'count': len(MOCK_DISTRICTS),
        'timestamp': datetime.now().isoformat(),
        'districts': MOCK_DISTRICTS
    })


@app.route('/api/alerts/active', methods=['GET'])
def get_active_alerts():
    """
    Get all active alerts
    """
    print(f"\n[Backend] REQUEST: GET /api/alerts/active")
    
    active_alerts = [a for a in MOCK_ALERTS if a.get('isActive', True)]
    
    return jsonify({
        'success': True,
        'count': len(active_alerts),
        'timestamp': datetime.now().isoformat(),
        'alerts': active_alerts
    })


@app.route('/api/alerts/by-district/<district_name>', methods=['GET'])
def get_alerts_by_district(district_name):
    """
    Get alerts for specific district
    """
    print(f"\n[Backend] REQUEST: GET /api/alerts/by-district/{district_name}")
    
    district_alerts = [a for a in MOCK_ALERTS if a['district'].lower() == district_name.lower()]
    
    return jsonify({
        'success': True,
        'district': district_name,
        'count': len(district_alerts),
        'timestamp': datetime.now().isoformat(),
        'alerts': district_alerts
    })


@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    """
    Get all sensors with their current status
    """
    print(f"\n[Backend] REQUEST: GET /api/sensors")
    
    return jsonify({
        'success': True,
        'count': len(MOCK_SENSORS),
        'timestamp': datetime.now().isoformat(),
        'sensors': MOCK_SENSORS
    })


@app.route('/api/sensors/<int:sensor_id>', methods=['GET'])
def get_sensor_detail(sensor_id):
    """
    Get specific sensor details
    """
    print(f"\n[Backend] REQUEST: GET /api/sensors/{sensor_id}")
    
    sensor = next((s for s in MOCK_SENSORS if s['id'] == sensor_id), None)
    
    if not sensor:
        return jsonify({
            'success': False,
            'error': f'Sensor {sensor_id} not found'
        }), 404
    
    return jsonify({
        'success': True,
        'timestamp': datetime.now().isoformat(),
        'sensor': sensor
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
            'GET /api/locations': 'Get monitored locations',
            'GET /api/water-level/latest': 'Get latest water level readings',
            'GET /api/water-level/sensors': 'Get water level sensors',
            'GET /api/districts/summary': 'Get districts with alert counts & risk levels',
            'GET /api/alerts/active': 'Get all active alerts',
            'GET /api/alerts/by-district/<name>': 'Get alerts for specific district',
            'GET /api/sensors': 'Get all sensor statuses',
            'GET /api/sensors/<id>': 'Get specific sensor details'
        }
    }), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# ============================================
# BACKGROUND SCHEDULER
# ============================================

def start_water_level_collector():
    """
    Start the background scheduler to collect water level data every 10 seconds
    """
    scheduler = BackgroundScheduler()
    
    # Schedule water level updates every 10 seconds
    scheduler.add_job(upload_water_level_to_supabase, 'interval', seconds=10)
    
    scheduler.start()
    print(f"[Scheduler] Water level collector started (10s intervals)")


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("FlowGuard Weather Backend Service")
    print("="*60)
    print(f"Starting server at http://localhost:5000")
    print(f"CORS enabled for frontend")
    print(f"Supabase: {'✓ Connected' if supabase_client else '✗ Not configured'}")
    print("\nAvailable endpoints:")
    print("  GET http://localhost:5000/health")
    print("  GET http://localhost:5000/api/weather/all")
    print("  GET http://localhost:5000/api/weather/district/District%207")
    print("  GET http://localhost:5000/api/weather/coords/10.757/106.682")
    print("  GET http://localhost:5000/api/weather/alerts")
    print("  GET http://localhost:5000/api/locations")
    print("  GET http://localhost:5000/api/water-level/latest")
    print("  GET http://localhost:5000/api/water-level/sensors")
    print("\n  MVP Mock Data Endpoints:")
    print("  GET http://localhost:5000/api/districts/summary")
    print("  GET http://localhost:5000/api/alerts/active")
    print("  GET http://localhost:5000/api/alerts/by-district/District%207")
    print("  GET http://localhost:5000/api/sensors")
    print("  GET http://localhost:5000/api/sensors/1")
    print("\nPress Ctrl+C to stop")
    print("="*60 + "\n")
    
    # Start water level collector if Supabase is configured
    if supabase_client:
        start_water_level_collector()
    
    app.run(debug=True, port=5000, host='localhost')
