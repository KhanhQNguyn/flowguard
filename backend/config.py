"""
Configuration and Mock Data for FlowGuard Backend
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# ============================================
# ENVIRONMENT & API CONFIGURATION
# ============================================

API_KEY = os.getenv('OPENWEATHER_API_KEY')
if not API_KEY:
    print("ERROR: OPENWEATHER_API_KEY not set in .env file")
    exit(1)

# Supabase Configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase_client = None

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: Supabase not configured - water level collection disabled")
else:
    try:
        supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"[Supabase] ✓ Connected to {SUPABASE_URL.split('//')[1]}")
    except Exception as e:
        print(f"[Supabase] ✗ Connection failed: {e}")
        print("[Supabase] Make sure you're using the SERVICE ROLE KEY, not the Publishable key")
        print("[Supabase] Get it from: Supabase Dashboard → Settings → API → Service role secret")
        supabase_client = None

OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/3.0/onecall'

# ============================================
# HCM LOCATIONS & SENSORS
# ============================================

HCM_LOCATIONS = [
    {'name': 'District 1', 'lat': 10.757, 'lng': 106.682},
    {'name': 'District 3', 'lat': 10.795, 'lng': 106.673},
    {'name': 'District 4', 'lat': 10.788, 'lng': 106.703},
    {'name': 'District 7', 'lat': 10.7356, 'lng': 106.7019},
    {'name': 'Phú Nhuận', 'lat': 10.798, 'lng': 106.686},
]

WATER_LEVEL_SENSORS = [
    {'location': 'Sensor_Tram_A', 'current_level': 100.0},
    {'location': 'Sensor_Tram_B', 'current_level': 85.0},
    {'location': 'Sensor_Tram_C', 'current_level': 120.0},
]

# ============================================
# MVP MOCK DATA (can be replaced with real data later)
# ============================================

MOCK_DISTRICTS = [
    {'id': 'd1', 'name': 'District 1', 'nameVi': 'Quận 1', 'riskLevel': 'LOW', 'activeAlerts': 0, 'sensorCount': 8, 'population': 180000},
    {'id': 'd4', 'name': 'District 4', 'nameVi': 'Quận 4', 'riskLevel': 'MEDIUM', 'activeAlerts': 2, 'sensorCount': 5, 'population': 175000},
    {'id': 'd7', 'name': 'District 7', 'nameVi': 'Quận 7', 'riskLevel': 'HIGH', 'activeAlerts': 4, 'sensorCount': 12, 'population': 310000},
    {'id': 'pn', 'name': 'Phú Nhuận', 'nameVi': 'Phú Nhuận', 'riskLevel': 'LOW', 'activeAlerts': 0, 'sensorCount': 4, 'population': 175000},
    {'id': 'd3', 'name': 'District 3', 'nameVi': 'Quận 3', 'riskLevel': 'MEDIUM', 'activeAlerts': 1, 'sensorCount': 6, 'population': 165000},
]

MOCK_ALERTS = [
    {'id': 'a1', 'type': 'flood', 'severity': 'high', 'title': 'Flood Warning', 'message': 'Water level rising rapidly on Huỳnh Tấn Phát. Avoid travel if possible.', 'district': 'District 7', 'street': 'Huỳnh Tấn Phát', 'isActive': True},
    {'id': 'a2', 'type': 'rain', 'severity': 'medium', 'title': 'Heavy Rain Alert', 'message': 'Heavy rainfall expected in the next 2 hours. Plan accordingly.', 'district': 'District 4', 'isActive': True},
    {'id': 'a3', 'type': 'tide', 'severity': 'medium', 'title': 'High Tide Warning', 'message': 'High tide expected at 6:30 PM. Low-lying areas may experience water rise.', 'district': 'District 7', 'isActive': True},
    {'id': 'a4', 'type': 'flood', 'severity': 'medium', 'title': 'Flood Risk', 'message': 'Water levels are elevated. Monitor the situation.', 'district': 'District 7', 'street': 'Võ Văn Kiệt', 'isActive': True},
    {'id': 'a5', 'type': 'rain', 'severity': 'low', 'title': 'Light Rain', 'message': 'Light rainfall in the afternoon.', 'district': 'District 3', 'isActive': True},
]

MOCK_SENSORS = [
    {'id': 1, 'name': 'Nguyễn Hữu Cảnh', 'lat': 10.788, 'lng': 106.703, 'status': 'online', 'waterLevel': 52, 'trend': 'rising', 'district': 'District 4', 'rainIntensity': 'Heavy', 'tideLevel': 'Medium', 'reportsNearby': 3},
    {'id': 2, 'name': 'Võ Văn Kiệt', 'lat': 10.757, 'lng': 106.682, 'status': 'online', 'waterLevel': 38, 'trend': 'stable', 'district': 'District 1', 'rainIntensity': 'Medium', 'tideLevel': 'Medium', 'reportsNearby': 1},
    {'id': 3, 'name': 'Huỳnh Tấn Phát', 'lat': 10.7356, 'lng': 106.7019, 'status': 'warning', 'waterLevel': 78, 'trend': 'rising', 'district': 'District 7', 'rainIntensity': 'Heavy', 'tideLevel': 'High', 'reportsNearby': 12},
    {'id': 4, 'name': 'Đường 3/2', 'lat': 10.795, 'lng': 106.673, 'status': 'online', 'waterLevel': 45, 'trend': 'falling', 'district': 'District 3', 'rainIntensity': 'Medium', 'tideLevel': 'Low', 'reportsNearby': 2},
    {'id': 5, 'name': 'Phan Văn Hân', 'lat': 10.798, 'lng': 106.686, 'status': 'online', 'waterLevel': 32, 'trend': 'stable', 'district': 'Phú Nhuận', 'rainIntensity': 'Low', 'tideLevel': 'Low', 'reportsNearby': 0},
]
