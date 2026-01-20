# Water Level Integration Guide

## Overview

The backend now integrates water level sensor data collection with Supabase database. Water level readings are collected every 10 seconds and stored in the `system_logs` table.

## Key Features

✅ **Automatic UPSERT** - Replaces old readings for each sensor instead of creating duplicates
✅ **Background Scheduler** - Runs every 10 seconds automatically
✅ **3 Sensor Simulation** - Simulates realistic water level changes
✅ **Supabase Integration** - Stores data persistently in database

## Configuration

### 1. Environment Variables

The `.env` file must contain:

```
OPENWEATHER_API_KEY=your_key
SUPABASE_URL=https://zojxcmetxhbcxoszebdz.supabase.co
SUPABASE_KEY=sb_publishable_MBc5hYW7zNAxdEbcN5uIHA_GUtO47zC
```

### 2. Database Schema

The `system_logs` table structure:

```sql
CREATE TABLE system_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    water_level_cm double precision NOT NULL,
    location text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);
```

**Key Point:** Each location can only have ONE latest reading (UPSERT strategy)

## How It Works

### Water Level Collection Process

```
Every 10 seconds:
  1. For each sensor (Sensor_Tram_A, Sensor_Tram_B, Sensor_Tram_C):
     - Simulate water level change (±1-2 cm)
     - Keep within bounds (0-195 cm)
  
  2. Delete old data for this location (prevents duplicates)
  
  3. Insert new water level reading into system_logs
```

### UPSERT Strategy

Instead of accumulating data:

**OLD (Bad):** Every 10 seconds = 6 readings/min × 1440 min = 8,640 readings/day per sensor!

**NEW (Good):** Only ONE latest reading per sensor at any time

Example:
```
Time: 10:00:00 - Insert Sensor_Tram_A: 100.5 cm
Time: 10:00:10 - Delete old, Insert Sensor_Tram_A: 101.2 cm  ← replaces previous
Time: 10:00:20 - Delete old, Insert Sensor_Tram_A: 99.8 cm   ← replaces previous
```

Result: Always ONE reading per sensor = clean, efficient database

## New API Endpoints

### Get Latest Water Level Readings

```bash
curl http://localhost:5000/api/water-level/latest
```

Response:
```json
{
  "success": true,
  "count": 3,
  "timestamp": "2026-01-20T10:30:45.123456",
  "readings": [
    {
      "id": "uuid-...",
      "water_level_cm": 101.2,
      "location": "Sensor_Tram_A",
      "created_at": "2026-01-20T10:30:42"
    },
    {
      "id": "uuid-...",
      "water_level_cm": 85.7,
      "location": "Sensor_Tram_B",
      "created_at": "2026-01-20T10:30:42"
    },
    {
      "id": "uuid-...",
      "water_level_cm": 119.3,
      "location": "Sensor_Tram_C",
      "created_at": "2026-01-20T10:30:42"
    }
  ]
}
```

### Get Water Level Sensors

```bash
curl http://localhost:5000/api/water-level/sensors
```

Response:
```json
{
  "success": true,
  "count": 3,
  "sensors": [
    {"location": "Sensor_Tram_A", "current_level": 101.2},
    {"location": "Sensor_Tram_B", "current_level": 85.7},
    {"location": "Sensor_Tram_C", "current_level": 119.3}
  ]
}
```

## Installation & Running

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run the backend
python backend_weather_service.py
```

You should see:
```
[Scheduler] Water level collector started (10s intervals)
[Supabase] ✓ Sensor_Tram_A: 101.2 cm
[Supabase] ✓ Sensor_Tram_B: 85.7 cm
[Supabase] ✓ Sensor_Tram_C: 119.3 cm
```

## Modifying Sensors

To change sensor configuration, edit `backend_weather_service.py`:

```python
WATER_LEVEL_SENSORS = [
    {'location': 'Sensor_Tram_A', 'current_level': 100.0},
    {'location': 'Sensor_Tram_B', 'current_level': 85.0},
    {'location': 'Sensor_Tram_C', 'current_level': 120.0},
]
```

## Collection Interval

Current interval: **10 seconds**

To change, edit this line:
```python
scheduler.add_job(upload_water_level_to_supabase, 'interval', seconds=10)  # Change 10 to desired seconds
```

## Troubleshooting

### "Supabase not configured"
- Check `.env` file has `SUPABASE_URL` and `SUPABASE_KEY`
- Verify credentials are correct in Supabase dashboard

### Collection not starting
- Check Supabase connection is successful (startup logs should show ✓)
- Verify `apscheduler` is installed: `pip list | grep apscheduler`

### Data not appearing in Supabase
1. Check backend logs for errors
2. Verify `system_logs` table exists in Supabase
3. Check table structure matches schema above

## Production Notes

- Increase collection interval (current 10s is aggressive)
- Consider: 60s (1/min) = 1,440 readings/day per sensor
- Set `debug=False` for production deployment
