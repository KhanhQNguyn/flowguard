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
from typing import Literal

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
    get_all_weather_alerts,
    store_weather_to_existing_schema,
    get_latest_weather_from_db,
    get_weather_for_location_from_db
)
from ai_training import (
    check_flood_status,
    check_flood_for_location,
    check_flood_for_all_locations
)

app = Flask(__name__)
# Configure CORS to allow requests from Next.js frontend
CORS(app, 
     resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "*"]}},
     supports_credentials=True)

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
        # Order by created_at desc if available to get freshest readings first
    print('[Backend] Querying Supabase system_logs for latest water levels...')
    response = supabase_client.table('system_logs').select('*').order('created_at', desc=True).limit(100).execute()
    print('[Backend] Supabase system_logs rows:', len(response.data) if hasattr(response, 'data') and response.data else 0)
        
        data = response.data if hasattr(response, 'data') else []
        
    result = {
            'success': True,
            'count': len(data),
            'timestamp': datetime.now().isoformat(),
            'readings': data
    }
    print('[Backend] Returning latest water levels payload:', { 'count': result['count'] })
    return jsonify(result)
    except Exception as e:
        print(f"[Backend] ERROR: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/water-level/mode', methods=['GET', 'POST'])
def water_level_mode():
    """
    GET: Return current simulation mode from Supabase sensor_config (id=1)
    POST: Update mode. Body: {"mode": "SAFE"|"WARNING"|"CRITICAL"}
    """
    from flask import request
    print(f"\n[Backend] REQUEST: {request.method} /api/water-level/mode")

    if not supabase_client:
        return jsonify({'success': False, 'error': 'Supabase not configured'}), 503

    try:
    if request.method == 'GET':
            try:
                print('[Backend] Fetching sensor_config mode (id=1)')
                resp = supabase_client.table('sensor_config').select('mode').eq('id', 1).execute()
                mode = (resp.data[0]['mode'] if resp.data else 'SAFE')
            except Exception:
                mode = 'SAFE'
            print('[Backend] Mode GET result:', mode)
            return jsonify({'success': True, 'mode': mode})

        # POST
    data = request.get_json(silent=True) or {}
    print('[Backend] Mode POST body:', data)
        mode = str(data.get('mode', '')).upper()
        valid: tuple[Literal['SAFE','WARNING','CRITICAL'], ...] = ('SAFE', 'WARNING', 'CRITICAL')
        if mode not in valid:
            return jsonify({'success': False, 'error': 'Invalid mode. Use SAFE, WARNING, or CRITICAL.'}), 400

        # Try update first
        try:
            print('[Backend] Updating sensor_config mode to', mode)
            update_resp = supabase_client.table('sensor_config').update({'mode': mode}).eq('id', 1).execute()
            # If no row updated, insert
            if not getattr(update_resp, 'data', None):
                print('[Backend] No existing row updated, inserting new mode row')
                supabase_client.table('sensor_config').insert({'id': 1, 'mode': mode}).execute()
        except Exception:
            # Fallback to insert
            print('[Backend] Update failed, inserting mode row')
            supabase_client.table('sensor_config').insert({'id': 1, 'mode': mode}).execute()

        print('[Backend] Mode updated to', mode)
        return jsonify({'success': True, 'mode': mode})
    except Exception as e:
        print(f"[Backend] ERROR (mode): {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/test/save-weather', methods=['GET'])
def test_save_weather():
    """
    TEST ENDPOINT: Manually trigger weather data fetch & save to database
    This is for debugging - remove in production
    """
    print("\n[TEST] Manually triggering fetch_and_store_all_weather()...")
    fetch_and_store_all_weather()
    return jsonify({
        'success': True,
        'message': 'Weather data fetch & save triggered. Check console for debug output.'
    })


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
# WEATHER DATA STORAGE ENDPOINTS
# ============================================

@app.route('/api/weather/stored', methods=['GET'])
def get_stored_weather():
    """
    Get latest stored weather from existing schema
    Returns: weather_request + location + current_weather with condition
    """
    print(f"\n[Backend] REQUEST: GET /api/weather/stored")
    
    weather_readings = get_latest_weather_from_db()
    
    return jsonify({
        'success': True,
        'count': len(weather_readings),
        'timestamp': datetime.now().isoformat(),
        'readings': weather_readings
    })


@app.route('/api/weather/stored/<int:location_id>', methods=['GET'])
def get_stored_weather_for_location(location_id):
    """
    Get latest stored weather for specific location from existing schema
    """
    print(f"\n[Backend] REQUEST: GET /api/weather/stored/{location_id}")
    
    reading = get_weather_for_location_from_db(location_id)
    
    if not reading:
        return jsonify({
            'success': False,
            'error': f'No weather data found for location {location_id}'
        }), 404
    
    return jsonify({
        'success': True,
        'timestamp': datetime.now().isoformat(),
        'reading': reading
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
# AI FLOOD PREDICTION ENDPOINTS
# ============================================

@app.route('/api/flood/predict', methods=['GET'])
def predict_flood():
    """
    Predict flood status for given coordinates
    Query params: lat, lng, water_level (optional)
    
    Example: /api/flood/predict?lat=10.762&lng=106.660&water_level=110
    """
    print(f"\n[Backend] REQUEST: GET /api/flood/predict")
    
    try:
        from flask import request
        lat = float(request.args.get('lat', 10.762))
        lng = float(request.args.get('lng', 106.660))
        water_level = request.args.get('water_level')
        use_database = request.args.get('use_database', 'true').lower() == 'true'
        
        if water_level:
            water_level = float(water_level)
        
        result = check_flood_status(lat, lng, water_level=water_level, use_database=use_database)
        
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'prediction': result
        })
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid parameter: {str(e)}'
        }), 400
    except Exception as e:
        print(f"[Backend] ERROR: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/flood/predict/location/<location_name>', methods=['GET'])
def predict_flood_for_location(location_name):
    """
    Predict flood status for a named location (e.g., District 7)
    
    Example: /api/flood/predict/location/District%207
    """
    print(f"\n[Backend] REQUEST: GET /api/flood/predict/location/{location_name}")
    
    try:
        from flask import request
        use_database = request.args.get('use_database', 'true').lower() == 'true'
        
        result = check_flood_for_location(location_name, use_database=use_database)
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error'],
                'available_locations': result.get('available_locations', [])
            }), 404
        
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'location': location_name,
            'prediction': result
        })
    except Exception as e:
        print(f"[Backend] ERROR: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/flood/predict/all', methods=['GET'])
def predict_flood_all():
    """
    Predict flood status for all monitored locations
    Uses latest water level and weather data from database
    
    Example: /api/flood/predict/all
    """
    print(f"\n[Backend] REQUEST: GET /api/flood/predict/all")
    
    try:
        from flask import request
        use_database = request.args.get('use_database', 'true').lower() == 'true'
        
        results = check_flood_for_all_locations(use_database=use_database)
        
        # Count high-risk locations
        high_risk_count = sum(1 for r in results if r['prediction']['is_flood'])
        
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'total_locations': len(results),
            'high_risk_count': high_risk_count,
            'predictions': results
        })
    except Exception as e:
        print(f"[Backend] ERROR: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


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
            'GET /api/weather/stored': 'Get stored weather from database',
            'GET /api/weather/stored/<location_id>': 'Get stored weather for specific location',
            'GET /api/locations': 'Get monitored locations',
            'GET /api/water-level/latest': 'Get latest water level readings',
            'GET /api/water-level/sensors': 'Get water level sensors',
            'GET /api/districts/summary': 'Get districts with alert counts & risk levels',
            'GET /api/alerts/active': 'Get all active alerts',
            'GET /api/alerts/by-district/<name>': 'Get alerts for specific district',
            'GET /api/sensors': 'Get all sensor statuses',
            'GET /api/sensors/<id>': 'Get specific sensor details',
            'GET /api/flood/predict': 'Predict flood for coordinates (params: lat, lng, water_level)',
            'GET /api/flood/predict/location/<name>': 'Predict flood for named location',
            'GET /api/flood/predict/all': 'Predict flood for all monitored locations'
        }
    }), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# ============================================
# SCHEDULED BACKGROUND TASKS
# ============================================

def fetch_and_store_all_weather():
    """
    Fetch weather data from OpenWeather API for all locations
    and store to Supabase database (UPSERT pattern)
    
    Called every 5 minutes by the scheduler
    """
    print(f"\n{'='*70}")
    print(f"[Scheduler] WEATHER FETCH CYCLE at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*70}")
    
    if not supabase_client:
        print("[Scheduler] ✗ Supabase not configured, skipping weather fetch")
        print("="*70)
        return
    
    success_count = 0
    error_count = 0
    
    print(f"[Scheduler] Processing {len(HCM_LOCATIONS)} locations...\n")
    
    for i, location in enumerate(HCM_LOCATIONS, 1):
        print(f"[Scheduler] [{i}/{len(HCM_LOCATIONS)}] {location['name']} ({location['lat']}, {location['lng']})")
        try:
            # Fetch data from OpenWeather API
            print(f"[DEBUG]    Fetching from OpenWeather API...")
            weather_data = fetch_from_openweather(location['lat'], location['lng'])
            
            if weather_data:
                print(f"[DEBUG]    ✓ API Response received, keys: {list(weather_data.keys())}")
                print(f"[DEBUG]    Calling store_weather_to_existing_schema...")
                # Store to database with UPSERT pattern (delete old + insert new)
                store_result = store_weather_to_existing_schema(
                    location['name'],
                    location['lat'],
                    location['lng'],
                    weather_data
                )
                if store_result:
                    success_count += 1
                    print(f"[Scheduler] ✓ {location['name']}: SUCCESS\n")
                else:
                    error_count += 1
                    print(f"[Scheduler] ✗ {location['name']}: FAILED (store returned False)\n")
            else:
                error_count += 1
                print(f"[Scheduler] ✗ {location['name']}: FAILED (no API data)\n")
                
        except Exception as e:
            error_count += 1
            print(f"[Scheduler] ✗ {location['name']}: EXCEPTION: {type(e).__name__}: {str(e)}\n")
            import traceback
            traceback.print_exc()
    
    print(f"{'='*70}")
    print(f"[Scheduler] CYCLE COMPLETE: {success_count} successful, {error_count} failed")
    print(f"{'='*70}\n")


# ============================================
# BACKGROUND SCHEDULER
# ============================================

def start_water_level_collector():
    """
    Start the background scheduler to collect water level data every 10 seconds
    and fetch weather data every 5 minutes
    """
    scheduler = BackgroundScheduler()
    
    # Schedule water level updates every 10 seconds
    scheduler.add_job(upload_water_level_to_supabase, 'interval', seconds=10)
    print(f"[Scheduler] ✓ Water level job scheduled (10s intervals)")
    
    # Schedule weather data fetch every 5 minutes (300 seconds)
    scheduler.add_job(fetch_and_store_all_weather, 'interval', seconds=300)
    print(f"[Scheduler] ✓ Weather data job scheduled (5min intervals)")
    
    scheduler.start()
    print(f"[Scheduler] ✓ Scheduler started successfully\n")



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
    print("\n  AI Flood Prediction Endpoints:")
    print("  GET http://localhost:5000/api/flood/predict?lat=10.762&lng=106.660")
    print("  GET http://localhost:5000/api/flood/predict/location/District%207")
    print("  GET http://localhost:5000/api/flood/predict/all")
    print("\nPress Ctrl+C to stop")
    print("="*60 + "\n")
    
    # Start water level collector if Supabase is configured
    if supabase_client:
        start_water_level_collector()
    
    # Allow connections from other hosts (0.0.0.0) for better compatibility
    app.run(debug=True, port=5000, host='0.0.0.0')
