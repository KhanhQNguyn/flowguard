# Backend Setup & Running

## Structure
```
backend/
├── backend_weather_service.py  (Main Flask app)
├── requirements.txt             (Python dependencies)
└── .env                        (API key)
```

## Installation

From the `backend/` directory:
```bash
pip install -r requirements.txt
```

## Running

From the `backend/` directory:
```bash
python backend_weather_service.py
```

Server runs at: `http://localhost:5000`

## Testing

```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/weather/coords/10.7356/106.7019
```

See `../BACKEND_SETUP.md` for complete guide.
