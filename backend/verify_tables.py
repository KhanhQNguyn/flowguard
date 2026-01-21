from config import supabase_client

print("=" * 70)
print("DATABASE TABLE POPULATION VERIFICATION")
print("=" * 70)

tables = [
    ('location', 'Locations stored'),
    ('weather_request', 'Weather requests'),
    ('weather_condition', 'Weather conditions'),
    ('current_weather', 'Current weather records'),
    ('minutely_weather', 'Minutely weather records'),
    ('hourly_weather', 'Hourly weather records'),
    ('daily_weather', 'Daily weather records'),
    ('weather_alerts', 'Weather alerts'),
    ('system_logs', 'Water level sensor logs')
]

for table_name, description in tables:
    try:
        response = supabase_client.table(table_name).select('count', count='exact').execute()
        count = response.count
        status = "✓" if count > 0 else "⚠"
        print(f"{status} {description:40} | {table_name:20} | Records: {count}")
    except Exception as e:
        print(f"✗ {description:40} | {table_name:20} | Error: {str(e)[:50]}")

print("\n" + "=" * 70)
print("DETAILED BREAKDOWN")
print("=" * 70)

# Location details
print("\n[Locations]")
locations = supabase_client.table('location').select('*').execute()
print(f"Total: {len(locations.data)}")
for loc in locations.data[-5:]:
    print(f"  - ({loc['latitude']}, {loc['longitude']}) - {loc['timezone']}")

# Current weather by location
print("\n[Current Weather]")
current = supabase_client.table('current_weather').select('request_id, temp, condition_id').execute()
print(f"Total: {len(current.data)}")
for cw in current.data[-5:]:
    print(f"  - Request {cw['request_id']}: {cw['temp']}°C, Condition ID: {cw['condition_id']}")

# Minutely weather count
print("\n[Minutely Weather]")
minutely = supabase_client.table('minutely_weather').select('count', count='exact').execute()
print(f"Total: {minutely.count} records (Expected: ~300 = 5 locations × 60 minutes)")

# Hourly weather count
print("\n[Hourly Weather]")
hourly = supabase_client.table('hourly_weather').select('count', count='exact').execute()
print(f"Total: {hourly.count} records (Expected: ~240 = 5 locations × 48 hours)")

# Daily weather count
print("\n[Daily Weather]")
daily = supabase_client.table('daily_weather').select('count', count='exact').execute()
print(f"Total: {daily.count} records (Expected: ~40 = 5 locations × 8 days)")

# Weather alerts
print("\n[Weather Alerts]")
alerts = supabase_client.table('weather_alerts').select('count', count='exact').execute()
print(f"Total: {alerts.count} records (may be 0 if no alerts)")

print("\n" + "=" * 70)
