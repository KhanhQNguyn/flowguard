# OpenWeather API Data Storage to Database

## Overview
Your FlowGuard backend now automatically stores OpenWeather API data to Supabase database with **UPSERT pattern** - meaning new weather data replaces old data for each location, keeping your database clean and efficient.

## Implementation Complete ✅

### 1. Database Schema
You need to create the `weather_readings` table in Supabase with this SQL:

```sql
CREATE TABLE IF NOT EXISTS weather_readings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  
  -- Current weather
  temperature NUMERIC(5, 2),
  feels_like NUMERIC(5, 2),
  humidity INTEGER,
  pressure INTEGER,
  clouds INTEGER,
  visibility INTEGER,
  wind_speed NUMERIC(5, 2),
  wind_deg INTEGER,
  
  -- Precipitation
  rain_1h NUMERIC(5, 2),
  snow_1h NUMERIC(5, 2),
  
  -- Weather condition
  weather_main TEXT,
  weather_description TEXT,
  weather_icon TEXT,
  
  -- Timestamps
  weather_dt BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one latest reading per location
  CONSTRAINT unique_location_latest UNIQUE(location_name)
);

-- Create indexes for faster queries
CREATE INDEX idx_weather_location ON weather_readings(location_name);
CREATE INDEX idx_weather_created ON weather_readings(created_at DESC);
```

### 2. Backend Implementation

#### New Service Functions (in `services.py`)

**`store_weather_to_supabase(location_name, lat, lng, weather_data)`**
- Automatically called when OpenWeather API returns data
- Uses UPSERT: deletes old data for location → inserts new data
- Result: Always have ONE latest reading per location

**`get_latest_weather_readings()`**
- Retrieves all stored weather readings from database
- Returns one reading per location (latest only)

**`get_weather_readings_for_location(location_name)`**
- Get weather history for specific location
- Returns latest stored reading

#### Updated Service Functions

**`get_weather_for_all_districts()`**
- Now automatically stores fetched data to database

**`get_weather_for_district(district_name)`**
- Now automatically stores fetched data to database

**`get_weather_for_coordinates(lat, lng)`**
- Now automatically stores fetched data to database

### 3. New API Endpoints

#### Retrieve Stored Weather Data

**`GET /api/weather/stored`**
- Get all latest weather readings from database
- Response:
```json
{
  "success": true,
  "count": 5,
  "timestamp": "2026-01-20T10:30:00",
  "readings": [
    {
      "location_name": "District 1",
      "latitude": 10.757,
      "longitude": 106.682,
      "temperature": 28.5,
      "feels_like": 31.2,
      "humidity": 75,
      "pressure": 1013,
      "weather_main": "Clouds",
      "weather_description": "overcast clouds",
      "updated_at": "2026-01-20T10:30:00"
    }
  ]
}
```

**`GET /api/weather/stored/<location_name>`**
- Get latest weather reading for specific location
- Example: `GET /api/weather/stored/District%207`
- Response:
```json
{
  "success": true,
  "reading": {
    "location_name": "District 7",
    "temperature": 29.1,
    "weather_main": "Rain",
    "updated_at": "2026-01-20T10:32:15"
  }
}
```

## Data Flow

### Automatic Storage

```
Frontend calls /api/weather/all
    ↓
Backend calls OpenWeather API
    ↓
Backend stores data to Supabase (UPSERT)
    ↓
Frontend receives weather data
    ↓
Database has latest weather for each location
```

### Database Query

```
Frontend/Admin calls /api/weather/stored
    ↓
Backend queries Supabase
    ↓
Returns latest weather readings (one per location)
```

## UPSERT Pattern Explained

### Why UPSERT?

Without UPSERT (Bad):
```
Time 10:00 → Store District 7 weather → 1 record
Time 10:05 → Store District 7 weather → 2 records (duplicate)
Time 10:10 → Store District 7 weather → 3 records (more duplicates)
Result: Database gets bloated with stale data
```

With UPSERT (Good):
```
Time 10:00 → Delete old District 7 data → Store new → 1 record
Time 10:05 → Delete old District 7 data → Store new → 1 record (replaced)
Time 10:10 → Delete old District 7 data → Store new → 1 record (replaced)
Result: Always have ONE latest reading per location
```

### Implementation

```python
def store_weather_to_supabase(location_name, lat, lng, weather_data):
    # Delete old data for this location
    supabase_client.table('weather_readings').delete().eq('location_name', location_name).execute()
    
    # Insert new data
    supabase_client.table('weather_readings').insert(data).execute()
```

## Setup Instructions

### Step 1: Create Table in Supabase
1. Go to: `https://app.supabase.com` → Your Project → SQL Editor
2. Create new query
3. Copy the SQL schema above
4. Run it

### Step 2: Test the Backend

```bash
cd backend
python backend_weather_service.py
```

You should see:
```
[Supabase] ✓ Connected to zojxcmetxhbcxoszebdz.supabase.co
[Backend] ✓ Got OpenWeather data for lat=10.7356, lng=106.7019
[Supabase] ✓ Weather stored for District 7: 28.5°C, Clouds
```

### Step 3: Verify Data in Supabase
1. Go to Supabase Dashboard
2. Navigate to `weather_readings` table
3. Should see 5 records (one per HCM district)
4. Each new API call replaces old data (due to UNIQUE constraint)

## Frontend Usage

### Example: Get stored weather data

```typescript
// In React component
useEffect(() => {
  const fetchStoredWeather = async () => {
    const response = await fetch('http://localhost:5000/api/weather/stored')
    const data = await response.json()
    setWeatherReadings(data.readings)
  }
  fetchStoredWeather()
}, [])
```

### Example: Get weather for specific location

```typescript
const response = await fetch('http://localhost:5000/api/weather/stored/District%207')
const data = await response.json()
console.log(`District 7 temperature: ${data.reading.temperature}°C`)
```

## Storage Behavior

| Scenario | Result |
|----------|--------|
| First API call for District 7 | Creates 1 record |
| Second API call for District 7 | Replaces record (1 record total) |
| Third API call for District 1 | Adds new record (2 records total) |
| Call every district 5 times | 5 records total (one per district) |

## Data Retention

- **Current Implementation**: Keeps only latest reading per location
- **Future Options**:
  - Keep hourly readings (with timestamp-based deletion)
  - Keep daily weather (aggregated)
  - Archive old data to separate table

## API Endpoints Summary

| Endpoint | Purpose | Storage |
|----------|---------|---------|
| `/api/weather/all` | Get current weather | ✅ Auto-stores |
| `/api/weather/district/<name>` | Get weather by district | ✅ Auto-stores |
| `/api/weather/coords/<lat>/<lng>` | Get weather by coordinates | ✅ Auto-stores |
| `/api/weather/stored` | Retrieve stored weather | 📖 Read-only |
| `/api/weather/stored/<location>` | Get stored weather for location | 📖 Read-only |

## Troubleshooting

### Issue: "Invalid API key" error
**Solution**: Check `.env` file has correct `SUPABASE_KEY` (should start with `sb_secret_`)

### Issue: No data in database
**Solution**: 
1. Verify table exists: `SELECT * FROM weather_readings;`
2. Check backend is running: `python backend_weather_service.py`
3. Check logs for errors: Look for `[Supabase]` error messages

### Issue: Data not updating
**Solution**: UPSERT requires unique location name. Check that location names match exactly.

## Performance Benefits

- ✅ No duplicate weather data
- ✅ Fast queries (indexed on location_name)
- ✅ Small database footprint
- ✅ Always have latest data
- ✅ Easy to query weather history

## Next Steps

1. ✅ Create `weather_readings` table in Supabase
2. ✅ Restart backend: `python backend_weather_service.py`
3. ✅ Verify data appears in database
4. ✅ Add frontend component to display stored weather
5. ✅ Create weather history dashboard (optional)
