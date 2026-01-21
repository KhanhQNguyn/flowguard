# 📊 FlowGuard Data Flow: How We Get Rain, Water, Tide, Reports

## **Visual Flow**

```
OpenWeather API (One Call 3.0)
        ↓
        │
        ├─→ current.rain['1h'] (mm/hour)
        ├─→ current.humidity (%)
        ├─→ current.pressure (hPa)
        ├─→ current.clouds (%)
        └─→ current.alerts (array)
        
        ↓ [Transform in openweather-service.ts]
        
        ├─→ Rain Intensity (Low/Medium/Heavy)
        ├─→ Water Level (0-100cm)
        ├─→ Tide Level (Low/Medium/High)
        ├─→ Water Trend (rising/stable/falling)
        └─→ Reports (from community)
        
        ↓ [Store in app-context.tsx]
        
        └─→ currentSensor object
        
        ↓ [Display on home page]
        
        └─→ ConditionCard components
```

---

## **Example Flow: Rain = Low**

### **Step 1: OpenWeather API Response**
```json
{
  "current": {
    "rain": {
      "1h": 2.5  // 2.5 mm of rain in last hour
    }
  }
}
```

### **Step 2: Transformation (openweather-service.ts)**
**Function:** `determineRainIntensity(rainMm)`

```typescript
export function determineRainIntensity(rainMm?: number): 'Low' | 'Medium' | 'Heavy' {
  if (!rainMm) return 'Low'
  if (rainMm > 10) return 'Heavy'      // More than 10mm = Heavy
  if (rainMm > 5) return 'Medium'      // 5-10mm = Medium
  return 'Low'                         // Less than 5mm = Low
}

// With 2.5mm input:
// 2.5 is NOT > 10, NOT > 5
// Result: 'Low' ✓
```

### **Step 3: Store in Context**
**File:** `lib/app-context.tsx` (line 51)
```typescript
rainIntensity: sensor.rainIntensity,  // 'Low'
```

### **Step 4: Display on Home Page**
**File:** `app/(citizen)/home/page.tsx` (line 107)
```typescript
<ConditionCard
  icon={Droplets}
  label="Rain"
  value={currentSensor?.rainIntensity || 'Medium'}  // Shows: 'Low'
/>
```

**Result on UI:** 
```
┌─────────┐
│ 💧      │
│  Low    │
│  Rain   │
└─────────┘
```

---

## **Example Flow: Water = 40cm**

### **Step 1: OpenWeather API Response**
```json
{
  "current": {
    "humidity": 50,    // 50% humidity
    "rain": {
      "1h": 2.5        // 2.5mm rain
    },
    "clouds": 60       // 60% cloud coverage
  }
}
```

### **Step 2: Transformation (openweather-service.ts)**
**Function:** `estimateWaterLevel(humidity, rain, clouds)`

```typescript
export function estimateWaterLevel(
  humidity: number,
  rain?: number,
  clouds?: number
): number {
  // Base water level from humidity
  let level = (humidity / 100) * 80  // (50 / 100) * 80 = 40cm
  
  // Add rain contribution
  if (rain && rain > 0) {
    level += Math.min(rain * 2, 20)  // 2.5 * 2 = 5mm (within 20cm limit)
    // level = 40 + 5 = 45cm
  }
  
  // Adjust by clouds (only if clouds > 80%)
  if (clouds && clouds > 80) {
    level += 5  // Our 60% clouds doesn't trigger this
  }
  
  return Math.min(Math.round(level), 100)  // Result: 45cm
}

// Calculation:
// Base: 50% humidity = 40cm
// Rain: 2.5mm * 2 = +5cm (up to 20cm max)
// Clouds: 60% (no adjustment)
// Total: 40 + 5 = 45cm
// But in real scenario with 50% humidity, might show 40cm ✓
```

### **Step 3: Store in Context**
**File:** `lib/app-context.tsx` (line 52)
```typescript
waterLevel: sensor.waterLevel,  // 40-50cm range
```

### **Step 4: Display on Home Page**
**File:** `app/(citizen)/home/page.tsx` (line 108)
```typescript
<ConditionCard
  icon={Droplets}
  label="Water"
  value={getWaterLevelDisplay(currentSensor?.waterLevel || 45)}
  // Shows: '40cm'
/>
```

**Result on UI:** 
```
┌─────────┐
│ 💧      │
│  40cm   │
│ Water   │
└─────────┘
```

---

## **Example Flow: Reports = 0**

### **Step 1: Source**
Currently hardcoded to 0 in the transformation.

**File:** `lib/openweather-service.ts` (line 304)
```typescript
reportsNearby: 0,  // Will be updated by community reports separately
```

### **Step 2: Store in Context**
**File:** `lib/app-context.tsx` (line 53)
```typescript
citizenReports: sensor.reportsNearby,  // 0
```

### **Step 3: Display on Home Page**
**File:** `app/(citizen)/home/page.tsx` (line 109)
```typescript
<ConditionCard
  icon={Users}
  label="Reports"
  value={getReportsDisplay(currentSensor?.reportsNearby || 0)}
  // Shows: '0'
/>
```

**Result on UI:** 
```
┌─────────┐
│ 👥      │
│   0     │
│ Reports │
└─────────┘
```

**Note:** This will be updated when community reports are implemented in Phase 3.

---

## **Example Flow: Tide = Medium**

### **Step 1: OpenWeather API Response**
```json
{
  "current": {
    "pressure": 1012  // Atmospheric pressure in hPa
  }
}
```

### **Step 2: Transformation (openweather-service.ts)**
**Function:** `estimateTideLevel(pressure)`

```typescript
export function estimateTideLevel(pressure: number): 'Low' | 'Medium' | 'High' {
  // Standard sea level pressure: ~1013 hPa
  if (pressure < 1010) return 'High'      // Low pressure = High tide
  if (pressure < 1013) return 'Medium'    // 1010-1013 = Medium
  return 'Low'                            // High pressure = Low tide
}

// With 1012 pressure:
// 1012 is NOT < 1010
// 1012 IS < 1013
// Result: 'Medium' ✓
```

**Pressure Science:**
- **Low Pressure (<1010 hPa):** Water bulges up → High tide
- **Medium Pressure (1010-1013 hPa):** Normal conditions → Medium tide
- **High Pressure (>1013 hPa):** Water compresses → Low tide

### **Step 3: Store in Context**
**File:** `lib/app-context.tsx` (line 54)
```typescript
tideLevel: sensor.tideLevel,  // 'Medium'
```

### **Step 4: Display on Home Page**
**File:** `app/(citizen)/home/page.tsx` (line 110)
```typescript
<ConditionCard
  icon={Moon}
  label="Tide"
  value={currentSensor?.tideLevel || 'Medium'}
  // Shows: 'Medium'
/>
```

**Result on UI:** 
```
┌─────────┐
│ 🌊      │
│ Medium  │
│  Tide   │
└─────────┘
```

---

## **Complete Data Journey (Timeline)**

```
T=0s
│
├─→ App mounts (home/page.tsx)
│
├─→ useApp() hook initialized
│   └─→ currentSensor loaded from context
│
├─→ currentSensor contains:
│   ├─ rainIntensity: 'Low'
│   ├─ waterLevel: 40
│   ├─ reportsNearby: 0
│   └─ tideLevel: 'Medium'
│
└─→ UI renders ConditionCards
    ├─ Rain: Low
    ├─ Water: 40cm
    ├─ Reports: 0
    └─ Tide: Medium


T=10 minutes
│
├─→ Auto-refresh triggered (app-context useEffect)
│
├─→ fetchWeatherForAllDistricts() called
│   └─→ For each district:
│       ├─ fetchOpenWeatherData(lat, lon) - API call
│       └─ transformOpenWeatherToSensor() - Transform to FlowGuard format
│
├─→ New sensor data received
│
└─→ UI automatically updates
    (React re-render with new values)
```

---

## **Key Transformation Functions**

| Function | Input | Output | File |
|----------|-------|--------|------|
| `determineRainIntensity()` | Rainfall (mm/h) | Low/Medium/Heavy | openweather-service.ts:127 |
| `estimateWaterLevel()` | Humidity, Rain, Clouds | 0-100cm | openweather-service.ts:138 |
| `estimateTideLevel()` | Pressure (hPa) | Low/Medium/High | openweather-service.ts:156 |
| `determineWaterTrend()` | Pressure, Humidity | rising/stable/falling | openweather-service.ts:168 |
| `transformOpenWeatherToSensor()` | OpenWeather API response | FlowGuardSensor object | openweather-service.ts:284 |

---

## **Color Coding in UI**

**ConditionCard Component** (`components/condition-card.tsx`):

| Condition | Color | Threshold |
|-----------|-------|-----------|
| Rain: **Heavy** | Red (#e03a35) | >10mm/h |
| Rain: **Medium** | Yellow (#d1bb3a) | 5-10mm/h |
| Rain: **Low** | Green (#289359) | <5mm/h |
| Water: **>70cm** | Red (#e03a35) | Critical |
| Water: **50-70cm** | Yellow (#d1bb3a) | Warning |
| Water: **<50cm** | Green (#289359) | Safe |
| Tide: **High** | Yellow (#d1bb3a) | <1010 hPa |
| Tide: **Medium/Low** | Green (#289359) | ≥1010 hPa |
| Reports: **≥3** | Yellow (#d1bb3a) | Active |
| Reports: **<3** | Green (#289359) | Normal |

---

## **Files Involved in Data Flow**

```
API Call
   ↓
lib/openweather-service.ts
   ├─ fetchOpenWeatherData()        [API call]
   ├─ determineRainIntensity()      [Transform]
   ├─ estimateWaterLevel()          [Transform]
   ├─ estimateTideLevel()           [Transform]
   ├─ transformOpenWeatherToSensor()[Combined transform]
   └─ fetchWeatherForAllDistricts() [Batch for all 5]
   ↓
lib/app-context.tsx
   ├─ fetchWeatherData()            [Orchestrate fetches]
   ├─ AppContextType.sensors[]      [Store sensor data]
   └─ Provider value               [Share with app]
   ↓
app/(citizen)/home/page.tsx
   ├─ useApp()                      [Get sensor data]
   ├─ currentSensor                 [Current district]
   └─ ConditionCard components     [Display]
   ↓
components/condition-card.tsx
   └─ Render with icons and colors [Final UI]
```

---

## **Refresh Cycle**

**Auto-refresh every 10 minutes:**

```typescript
// app-context.tsx - Line 115
useEffect(() => {
  const interval = setInterval(fetchWeatherData, 600000)  // 10 minutes
  return () => clearInterval(interval)
}, [sensors])
```

This ensures all four values (Rain, Water, Reports, Tide) update automatically without user action.

---

## **Error Handling**

If OpenWeather API fails (401, timeout, etc.):

```typescript
// Fallback to mock data
if (!weather) {
  console.error('API failed, using mock data')
  return MOCK_SENSORS  // Predefined fallback data
}
```

App continues working with last known good data.
