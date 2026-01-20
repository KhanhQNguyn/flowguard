/**
 * OpenWeather API Service
 * Handles all API calls to One Call API 3.0 and transforms data for FlowGuard
 */

export interface OpenWeatherResponse {
  lat: number
  lon: number
  timezone: string
  current: CurrentWeather
  hourly: HourlyWeather[]
  daily: DailyWeather[]
  alerts?: WeatherAlert[]
}

export interface CurrentWeather {
  dt: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  rain?: { '1h': number }
  snow?: { '1h': number }
  weather: WeatherCondition[]
}

export interface HourlyWeather {
  dt: number
  temp: number
  humidity: number
  pressure: number
  clouds: number
  wind_speed: number
  pop: number // Probability of precipitation
  rain?: { '1h': number }
  weather: WeatherCondition[]
}

export interface DailyWeather {
  dt: number
  temp: { day: number; night: number; min: number; max: number }
  humidity: number
  pressure: number
  wind_speed: number
  pop: number
  rain?: number
  weather: WeatherCondition[]
  summary: string
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherAlert {
  sender_name: string
  event: string
  start: number
  end: number
  description: string
  tags: string[]
}

/**
 * Fetch weather data from OpenWeather One Call API 3.0
 */
export async function fetchOpenWeatherData(
  lat: number,
  lon: number
): Promise<OpenWeatherResponse | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  if (!apiKey) {
    console.error('[OpenWeather] API key not configured. Check .env.local file.')
    return null
  }

  try {
    const url = new URL('https://api.openweathermap.org/data/3.0/onecall')
    url.searchParams.append('lat', lat.toString())
    url.searchParams.append('lon', lon.toString())
    url.searchParams.append('appid', apiKey)
    url.searchParams.append('units', 'metric')
    url.searchParams.append('lang', 'en')

    console.log(`[OpenWeather] Fetching data for lat=${lat}, lon=${lon}`)

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[OpenWeather] API error: ${response.status}`)
      console.error(`[OpenWeather] Response: ${errorText}`)
      
      if (response.status === 401) {
        console.error('[OpenWeather] 401 Unauthorized - Check your API key validity')
        console.error('[OpenWeather] API Key used:', apiKey.substring(0, 10) + '...')
      }
      return null
    }

    const data: OpenWeatherResponse = await response.json()
    return data
  } catch (error) {
    console.error('[OpenWeather] Fetch error:', error)
    return null
  }
}

/**
 * Transform OpenWeather daily rain data to FlowGuard intensity levels
 * Based on daily rain volume from OpenWeather daily forecast
 * 3cm (30mm) and below: low risk
 * 3-8cm (30-80mm): medium risk
 * 8cm (80mm) and above: high risk
 */
export function determineRainIntensity(
  dailyRainMm?: number
): 'Low' | 'Medium' | 'Heavy' {
  if (!dailyRainMm) return 'Low'
  if (dailyRainMm >= 80) return 'Heavy'      // 8cm (80mm) and above
  if (dailyRainMm >= 30) return 'Medium'     // 3cm (30mm) to 8cm
  return 'Low'                               // Below 3cm (30mm)
}

/**
 * Estimate water level from daily rain volume
 * Water level is primarily based on daily rainfall (street level reference),
 * with humidity and clouds providing ±10% adjustment of the rain volume
 */
export function estimateWaterLevel(
  dailyRainMm: number,
  humidity?: number,
  clouds?: number
): number {
  // Base: daily rain volume converted to cm (street water level)
  let level = dailyRainMm / 10

  // Calculate adjustment range: ±10% of rain volume
  const maxAdjustment = level * 0.1

  // Humidity adjustment: high humidity increases water level (more water retention)
  let humidityFactor = 0
  if (humidity !== undefined) {
    // Normalize humidity to -1 to 1 range (centered at 50%)
    humidityFactor = (humidity - 50) / 50
    // Clamp to [-1, 1]
    humidityFactor = Math.max(-1, Math.min(1, humidityFactor))
  }

  // Clouds adjustment: more clouds increase water level (more rain expected)
  let cloudsFactor = 0
  if (clouds !== undefined) {
    // Normalize clouds to -1 to 1 range (centered at 50%)
    cloudsFactor = (clouds - 50) / 50
    // Clamp to [-1, 1]
    cloudsFactor = Math.max(-1, Math.min(1, cloudsFactor))
  }

  // Apply combined adjustment: average of humidity and clouds factors, scaled by maxAdjustment
  const adjustment = maxAdjustment * (humidityFactor + cloudsFactor) / 2
  level += adjustment

  // Cap at 0-100cm range
  return Math.max(0, Math.min(Math.round(level), 100))
}

/**
 * Estimate tide level from atmospheric pressure
 * Low pressure indicates high tide conditions
 */
export function estimateTideLevel(pressure: number): 'Low' | 'Medium' | 'High' {
  // Standard sea level pressure is ~1013 hPa
  if (pressure < 1010) return 'High'
  if (pressure < 1013) return 'Medium'
  return 'Low'
}

/**
 * Determine water trend from pressure change and current conditions
 */
export function determineWaterTrend(
  currentPressure: number,
  humidity: number
): 'rising' | 'stable' | 'falling' {
  // If pressure is low and humidity is high: rising
  if (currentPressure < 1010 && humidity > 75) {
    return 'rising'
  }
  // If pressure is high and humidity is low: falling
  if (currentPressure > 1015 && humidity < 60) {
    return 'falling'
  }
  return 'stable'
}

/**
 * Determine sensor status based on weather conditions
 */
export function determineSensorStatus(
  rainIntensity: 'Low' | 'Medium' | 'Heavy',
  waterLevel: number
): 'online' | 'warning' | 'offline' {
  if (waterLevel > 60 || rainIntensity === 'Heavy') {
    return 'warning'
  }
  return 'online'
}

/**
 * Transform OpenWeather alert to FlowGuard alert format
 */
export function transformAlert(
  alert: WeatherAlert,
  district: string
): FlowGuardAlert {
  const severity: 'low' | 'medium' | 'high' =
    alert.tags.includes('warning') || alert.event.includes('Warning')
      ? 'high'
      : alert.tags.includes('watch') || alert.event.includes('Watch')
        ? 'medium'
        : 'low'

  const type: 'flood' | 'rain' | 'tide' | 'traffic' =
    alert.event.toLowerCase().includes('flood')
      ? 'flood'
      : alert.event.toLowerCase().includes('rain')
        ? 'rain'
        : alert.event.toLowerCase().includes('tide')
          ? 'tide'
          : 'traffic'

  return {
    id: `${alert.event}-${alert.start}`,
    type,
    severity,
    title: alert.event,
    message: alert.description,
    district,
    createdAt: new Date(alert.start * 1000).toISOString(),
    expiresAt: new Date(alert.end * 1000).toISOString(),
    isActive: alert.end * 1000 > Date.now()
  }
}

/**
 * FlowGuard Alert interface
 */
export interface FlowGuardAlert {
  id: string
  type: 'flood' | 'rain' | 'tide' | 'traffic'
  severity: 'low' | 'medium' | 'high'
  title: string
  message: string
  district: string
  createdAt: string
  expiresAt: string
  isActive: boolean
}

/**
 * Transform OpenWeather data to FlowGuard Sensor format
 */
export interface FlowGuardSensor {
  id: number
  name: string
  lat: number
  lng: number
  status: 'online' | 'warning' | 'offline'
  waterLevel: number
  trend: 'rising' | 'stable' | 'falling'
  district: string
  rainIntensity: 'Low' | 'Medium' | 'Heavy'
  tideLevel: 'Low' | 'Medium' | 'High'
  reportsNearby: number
  lastUpdate: string
}

export async function transformOpenWeatherToSensor(
  weatherData: OpenWeatherResponse,
  district: string,
  sensorId: number = 1
): Promise<FlowGuardSensor> {
  const current = weatherData.current
  // Use daily rain volume (in mm) from OpenWeather forecast
  // OpenWeather daily.rain is already in mm, no conversion needed
  const dailyRainMm = (weatherData.daily[0]?.rain || 0)
  
  console.log(`[OpenWeather] ${district}: daily rain = ${dailyRainMm}mm, daily array length = ${weatherData.daily.length}`)
  if (weatherData.daily[0]) {
    console.log(`[OpenWeather] ${district}: daily[0] = `, weatherData.daily[0])
  }
  
  const rainIntensity = determineRainIntensity(dailyRainMm)
  const waterLevel = estimateWaterLevel(dailyRainMm, current.humidity, current.clouds)
  const tideLevel = estimateTideLevel(current.pressure)
  const trend = determineWaterTrend(current.pressure, current.humidity)
  const status = determineSensorStatus(rainIntensity, waterLevel)

  return {
    id: sensorId,
    name: `Weather Station - ${district}`,
    lat: weatherData.lat,
    lng: weatherData.lon,
    status,
    waterLevel,
    trend,
    district,
    rainIntensity,
    tideLevel,
    reportsNearby: 0, // Will be updated by community reports separately
    lastUpdate: new Date(current.dt * 1000).toISOString()
  }
}

/**
 * Fetch and transform weather data for multiple districts
 */
export async function fetchWeatherForAllDistricts(
  districts: Array<{ name: string; lat: number; lng: number }>
): Promise<FlowGuardSensor[]> {
  console.log('[OpenWeather] Fetching for districts:', districts.map(d => `${d.name} (${d.lat}, ${d.lng})`))
  
  const promises = districts.map(async (district, index) => {
    const weather = await fetchOpenWeatherData(district.lat, district.lng)
    if (!weather) {
      console.warn(`[OpenWeather] No data returned for ${district.name}`)
      return null
    }

    return transformOpenWeatherToSensor(weather, district.name, index + 1)
  })

  const results = await Promise.all(promises)
  return results.filter((sensor): sensor is FlowGuardSensor => sensor !== null)
}

/**
 * Fetch and transform alerts for a district
 */
export async function fetchAlertsForDistrict(
  lat: number,
  lng: number,
  district: string
): Promise<FlowGuardAlert[]> {
  const weather = await fetchOpenWeatherData(lat, lng)
  if (!weather || !weather.alerts) return []

  return weather.alerts.map((alert) => transformAlert(alert, district))
}
