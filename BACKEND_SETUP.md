# FlowGuard Backend Service Setup Guide

## Overview
The backend service handles all OpenWeather API calls and serves data to the frontend. This keeps your API key secure (not exposed in the browser) and allows you to save data to a database later.

## Architecture
```
Frontend (TypeScript/React)
    ↓ (HTTP calls)
Python Backend Service (Flask)
    ↓ (API calls)
OpenWeather API
```

## Installation

### 1. Install Python Dependencies
From the `backend/` directory:
```bash
cd backend
pip install -r requirements.txt
```

This installs:
- `flask` - Web framework
- `flask-cors` - Enable frontend requests
- `requests` - HTTP library
- `python-dotenv` - Load environment variables

### 2. Check Environment Setup
The `.env` file should already have your API key in the `backend/` folder:
```
OPENWEATHER_API_KEY=518c3bdb153d9c5c6345260769e60916
```

## Running the Backend

### Start the server (from `backend/` directory):
```bash
python backend_weather_service.py
```

You should see:
```
============================================================
FlowGuard Weather Backend Service
============================================================
Starting server at http://localhost:5000
CORS enabled for frontend

Available endpoints:
  GET http://localhost:5000/health
  GET http://localhost:5000/api/weather/all
  GET http://localhost:5000/api/weather/district/District%207
  GET http://localhost:5000/api/weather/coords/10.757/106.682
  GET http://localhost:5000/api/weather/alerts
  GET http://localhost:5000/api/locations

Press Ctrl+C to stop
============================================================
```

## Testing the Backend

### Health Check:
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "service": "FlowGuard Weather Backend",
  "timestamp": "2026-01-20T10:30:45.123456"
}
```

### Get Weather for Specific Coordinates:
```bash
curl http://localhost:5000/api/weather/coords/10.7356/106.7019
```

### Get Weather for Specific District:
```bash
curl http://localhost:5000/api/weather/district/District%207
```

### Get All Districts Weather:
```bash
curl http://localhost:5000/api/weather/all
```

### Get Weather Alerts:
```bash
curl http://localhost:5000/api/weather/alerts
```

## Frontend Configuration

The frontend is already configured to call the backend. When you run the frontend:

```bash
npm run dev
```

The frontend will:
1. Request your location (GPS)
2. Call the Python backend at `http://localhost:5000/api/weather/coords/<lat>/<lng>`
3. Display the weather data

## Troubleshooting

### Backend Won't Start
- **Error: `ModuleNotFoundError`** - Run `pip install -r requirements_backend.txt`
- **Error: `Address already in use`** - Port 5000 is busy. Close other apps or change port in `backend_weather_service.py` line 245

### Frontend Can't Connect to Backend
- **Error in console: "Failed to fetch"** - Make sure backend is running
- **Check:** Is `http://localhost:5000/health` accessible?
- **Solution:** Start backend first, then frontend

### API Key Errors
- **Error: `401 Unauthorized`** - API key is invalid
- **Check:** `.env` file has correct key
- **Solution:** Update `.env` with new key from OpenWeather

### CORS Errors
CORS should be automatically enabled. If you see "CORS policy" errors:
- Make sure Flask-CORS is installed: `pip show flask-cors`
- Restart backend after reinstalling

## Environment Variables

**`python backend_weather_service.py`** reads from `.env`:
- `OPENWEATHER_API_KEY` - Your OpenWeather API key (keep secret!)

## Backend Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/weather/all` | GET | Weather for all 5 HCM districts |
| `/api/weather/district/<name>` | GET | Weather for specific district |
| `/api/weather/coords/<lat>/<lng>` | GET | Weather for any coordinates |
| `/api/weather/alerts` | GET | Active weather alerts |
| `/api/locations` | GET | List monitored locations |

## Response Format

All endpoints return JSON with structure:
```json
{
  "success": true,
  "data": { ... OpenWeather data ... },
  "timestamp": "2026-01-20T10:30:45.123456"
}
```

## Next Steps

After backend is running:

### Option 1: Save to Database (Future)
Connect `openweather_supabase_collector.py` to periodically save weather data to your Supabase database

### Option 2: Add More Features
- Real-time alerts
- Historical data analysis
- District-specific recommendations

## Production Deployment

For production:
1. Change `debug=True` to `debug=False` in `backend/backend_weather_service.py`
2. Use production WSGI server: `gunicorn backend_weather_service.py`
3. Deploy to cloud (Heroku, AWS, Azure, etc.)
4. Update frontend to use production URL instead of `localhost:5000`

## Support

- **OpenWeather API:** https://openweathermap.org/api/one-call-3
- **Flask Documentation:** https://flask.palletsprojects.com/
- **Python Requests:** https://docs.python-requests.org/
