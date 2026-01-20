# 🗺️ FlowGuard Navigation & Map Implementation Guide

## **Overview**

FlowGuard uses **two different mapping solutions** for different purposes:

1. **Navigation Page**: Google Maps for routing (citizen feature)
2. **Admin Map**: Leaflet for sensor visualization (admin feature)

---

## **Part 1: Google Maps Navigation (Citizen Feature)**

### **Location: `app/(citizen)/navigate/page.tsx`**

This is how citizens navigate to destinations while avoiding flooded areas.

### **How It Works**

#### **Step 1: User Enters Destination**
```tsx
const handleFindRoute = () => {
  if (destination) {
    setShowRoute(true)  // Show route suggestions
  }
}
```

#### **Step 2: Show Safe Route Suggestions**
```tsx
<RouteSuggestion 
  destination={destination}
  onStartNavigation={handleStartNavigation}
/>
```

The `RouteSuggestion` component:
- Shows multiple route options (safe/normal/time-saving)
- Displays risk levels for each route
- Recommends safe routes based on current flood data

#### **Step 3: Open Google Maps Integration**
```tsx
const handleStartNavigation = () => {
  // Build the destination string with city context
  const encodedDestination = encodeURIComponent(
    destination + ', Ho Chi Minh City, Vietnam'
  )
  
  // Open Google Maps with navigation API
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`,
    '_blank'
  )
  
  setTripStarted(true)
}
```

**Key Points:**
- Uses **Google Maps Directions API** via URL parameters
- Appends city context (HCMC, Vietnam) for accuracy
- Opens in new tab/window using `window.open()`
- Sets `tripStarted` flag to detect when user returns

### **Step 4: Post-Trip Feedback**

After user navigates and returns to app:

```tsx
// Detect when user returns to app
useEffect(() => {
  if (!tripStarted) return

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && tripStarted) {
      // User returned to app - show feedback modal
      setTimeout(() => {
        setShowPostTrip(true)
      }, 800)
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}, [tripStarted])
```

**Flow:**
1. User taps "Start Navigation" → Opens Google Maps
2. User navigates using Google Maps
3. User returns to FlowGuard app
4. `visibilitychange` event triggers
5. Post-trip modal appears asking:
   - Did you arrive safely?
   - Did you need to detour?
   - Did you encounter flooding?

### **Step 5: Earn Rewards**

Based on feedback:

```tsx
const handleTripConfirm = (
  outcome: 'safe' | 'detour' | 'flooded',
  result: { points: number; reason: string }
) => {
  setTripStarted(false)

  if (result.points > 0) {
    setRewardData(result)
    // Show reward modal
    setTimeout(() => {
      setShowRewardSuccess(true)
    }, 300)
  }
}
```

**Reward Logic:**
- Safe route + arrived on time = +5 FlowPoints
- Used detour = +3 FlowPoints
- Reported flooding = +2 FlowPoints

---

## **Part 2: Leaflet Map (Admin Feature)**

### **Location: `components/map-component.tsx` and `app/admin/map/page.tsx`**

This is used for real-time sensor monitoring on admin dashboard.

### **Key Features**

#### **Initialization**
```typescript
const map = L.map(mapRef.current, {
  center: [10.7756, 106.7019],  // HCMC center
  zoom: 12,
  zoomControl: true,
  scrollWheelZoom: true,
  minZoom: 10,
  maxZoom: 18
})

// Use OpenStreetMap tiles (free)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
```

#### **Sensor Markers**
```typescript
sensors.forEach((sensor) => {
  const color = getStatusColor(sensor.status)
  
  const html = `
    <div class="sensor-marker" style="...">
      ${sensor.waterLevel}cm
    </div>
  `
  
  const marker = L.marker([sensor.lat, sensor.lng], {
    icon: L.divIcon({
      html: html,
      className: 'leaflet-marker-icon-custom',
      iconSize: [40, 40]
    })
  })
  
  marker.on('click', () => onSelectSensor(sensor))
  marker.addTo(map)
})
```

#### **Map Interactions**
- Click sensor marker → Show details
- Zoom/pan → Navigate map
- Recenter button → Fit all sensors in view

---

## **Architecture Comparison**

| Feature | Navigation Page | Admin Map |
|---------|---|---|
| **Library** | Google Maps (external) | Leaflet (installed) |
| **User Type** | Citizens | Admins |
| **Purpose** | Route finding & navigation | Sensor monitoring |
| **Integration** | URL-based (opens in new tab) | Embedded in app |
| **Tiles** | Google Maps | OpenStreetMap |
| **Real-time** | No | Yes (sensor data) |
| **Offline** | No | Partially (cached tiles) |

---

## **Data Flow**

### **Navigation Flow**
```
User enters destination
       ↓
System suggests safe routes (from route-engine.ts)
       ↓
User clicks "Start Navigation"
       ↓
Opens Google Maps in new tab
       ↓
User navigates in Google Maps
       ↓
User returns to FlowGuard
       ↓
Visibility change detected
       ↓
Post-trip modal shows
       ↓
User provides feedback (safe/detour/flooded)
       ↓
Rewards calculated and displayed
```

### **Admin Map Flow**
```
Admin dashboard loads
       ↓
App context fetches weather data from OpenWeather
       ↓
Sensors array updated with real water levels
       ↓
Leaflet map renders with sensors
       ↓
Admin can click sensors for details
       ↓
Real-time updates every 10 minutes
```

---

## **Key Files**

| File | Purpose |
|------|---------|
| `app/(citizen)/navigate/page.tsx` | Navigation UI & Google Maps integration |
| `components/route-suggestion.tsx` | Safe route recommendations |
| `components/post-trip-modal.tsx` | Trip feedback collection |
| `components/reward-success-modal.tsx` | Show earned FlowPoints |
| `components/map-component.tsx` | Leaflet map for sensors |
| `app/admin/map/page.tsx` | Admin map dashboard |
| `lib/route-engine.ts` | Route calculation logic |
| `lib/app-context.tsx` | Real-time sensor data |

---

## **Why Two Maps?**

### **Google Maps for Navigation**
- ✅ Best for turn-by-turn routing
- ✅ Real-time traffic data
- ✅ Proven navigation UX
- ✅ Mobile app integration
- ❌ Costs money at scale
- ❌ Can't embed turn-by-turn in web app (requires expensive API)

### **Leaflet for Admin**
- ✅ Free and open source
- ✅ Can embed in app
- ✅ Works offline with cached tiles
- ✅ Fast and lightweight
- ✅ Full customization
- ❌ No turn-by-turn routing
- ❌ Requires more configuration

---

## **Current Limitations**

1. **Google Maps not directly embedded** - Opens in new tab (can't show inline)
   - To embed: Requires paid Google Maps API key and embedding
   
2. **Route calculation is mock-based** - Not real routing
   - Would need: Google Directions API or Open Route Service

3. **Manual post-trip feedback** - Users must tell us they arrived
   - Could improve with: GPS tracking, geofencing, push notifications

4. **Admin map is sensor-visualization only** - No routing for admins
   - Good for: Monitoring flood status
   - Not for: Planning admin travel routes

---

## **Future Enhancements**

### **For Navigation:**
- [ ] Embed Google Maps iframe for inline navigation preview
- [ ] Use Open Route Service for free turn-by-turn routing
- [ ] Add GPS tracking to auto-detect trip completion
- [ ] Show real-time flooding updates during navigation

### **For Admin:**
- [ ] Add heatmap for flood-prone areas
- [ ] Show weather alerts on map
- [ ] Route optimization for maintenance crews
- [ ] Real-time sensor status dashboard

---

## **Testing Navigation Flow**

1. **Go to:** `/navigate`
2. **Enter:** "Bitexco Financial Tower" (or any location)
3. **Click:** "Find Safe Route"
4. **Review:** Suggested routes
5. **Click:** "Start Navigation"
6. **Result:** Opens Google Maps in new tab
7. **Go back** to FlowGuard
8. **See:** Post-trip feedback modal
9. **Complete:** Trip feedback to earn rewards

---

## **Technical Notes**

### **Google Maps URL Format**
```
https://www.google.com/maps/dir/?api=1&destination={encoded_destination}
```

Parameters:
- `api=1` - Enables directions API
- `destination` - Encoded destination address
- Optional: `origin`, `waypoints`, `travelmode`

### **Leaflet Initialization**
```typescript
// Required: Attach to DOM element
const map = L.map(domElement, options)

// Add tile layer (free OpenStreetMap)
L.tileLayer(url, options).addTo(map)

// Add markers
L.marker([lat, lng]).addTo(map)
```

### **Sensor Status Colors**
- 🟢 Green (online) - Safe
- 🟡 Yellow (warning) - Caution
- 🔴 Red (offline) - Check manually

---

## **Related Components**

- `DestinationInput` - Where user types address
- `RouteSuggestion` - Shows multiple route options
- `AvoidList` - Shows areas to avoid
- `PostTripModal` - Collects trip feedback
- `RewardSuccessModal` - Shows earned points
- `MapComponent` - Leaflet map for admin

All working together to provide **safe, rewarded navigation** in flood-prone HCMC! 🌊🚗✨
