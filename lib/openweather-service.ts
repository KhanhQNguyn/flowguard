/**
 * OpenWeather API Service
 * Handles all API calls to One Call API 3.0 and transforms data for FlowGuard
 */

export interface OpenWeatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts?: WeatherAlert[];
}

export interface CurrentWeather {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  rain?: { "1h": number };
  snow?: { "1h": number };
  weather: WeatherCondition[];
}

export interface HourlyWeather {
  dt: number;
  temp: number;
  humidity: number;
  pressure: number;
  clouds: number;
  wind_speed: number;
  pop: number; // Probability of precipitation
  rain?: { "1h": number };
  weather: WeatherCondition[];
}

export interface DailyWeather {
  dt: number;
  temp: { day: number; night: number; min: number; max: number };
  humidity: number;
  pressure: number;
  wind_speed: number;
  pop: number;
  rain?: number;
  weather: WeatherCondition[];
  summary: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

/**
 * Fetch weather data from Python Backend Service
 * Backend handles OpenWeather API calls and keeps API key secure
 */
export async function fetchOpenWeatherData(
  lat: number,
  lon: number,
): Promise<OpenWeatherResponse | null> {
  // Prefer Supabase (stored schema) if configured for frontend
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;
  console.log("[FG:OpenWeather] Env SUPABASE", {
    supabaseUrl: !!supabaseUrl,
    supabaseKey: !!supabaseKey,
  });

  if (supabaseUrl && supabaseKey) {
    try {
      // @ts-ignore Optional dependency; ignore type resolution if not installed
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      console.log("[FG:OpenWeather] Using Supabase client");
      // 1) Find location_id for given coordinates
      console.log("[FG:OpenWeather] Query location", { lat, lon });
      const locRes = await supabase
        .from("location")
        .select("location_id, latitude, longitude, timezone")
        .eq("latitude", lat)
        .eq("longitude", lon)
        .limit(1)
        .maybeSingle();

      if (!locRes || !locRes.data) {
        console.warn(
          "[Supabase] No location found for coordinates; returning null",
        );
        return null;
      }

      const locationId = locRes.data.location_id;
      console.log("[FG:OpenWeather] Location found", { locationId });

      // 2) Get latest weather_request for this location
      const reqRes = await supabase
        .from("weather_request")
        .select("request_id, request_time")
        .eq("location_id", locationId)
        .order("request_time", { ascending: false })
        .limit(1)
        .maybeSingle();
      console.log("[FG:OpenWeather] Latest request", reqRes?.data);

      if (!reqRes || !reqRes.data) {
        console.warn("[Supabase] No weather_request found; returning null");
        return null;
      }

      const requestId = reqRes.data.request_id;
      console.log("[FG:OpenWeather] Using requestId", { requestId });

      // 3) Current weather (joined condition)
      const curRes = await supabase
        .from("current_weather")
        .select(
          "dt, temp, feels_like, pressure, humidity, clouds, visibility, wind_speed, wind_deg, wind_gust, rain_1h, snow_1h, condition_id",
        )
        .eq("request_id", requestId)
        .limit(1)
        .maybeSingle();
      console.log("[FG:OpenWeather] Current weather row", curRes?.data);

      if (!curRes || !curRes.data) {
        console.warn("[Supabase] No current_weather found; returning null");
        return null;
      }

      const condRes = curRes.data.condition_id
        ? await supabase
            .from("weather_condition")
            .select("id:api_id, main, description, icon")
            .eq("condition_id", curRes.data.condition_id)
            .limit(1)
            .maybeSingle()
        : { data: null };
      console.log("[FG:OpenWeather] Condition row", condRes?.data);

      // 4) Hourly weather
      const hourlyRes = await supabase
        .from("hourly_weather")
        .select(
          "dt, temp, humidity, pressure, clouds, wind_speed, pop, rain_1h, condition_id",
        )
        .eq("request_id", requestId)
        .order("dt", { ascending: true });
      console.log("[FG:OpenWeather] Hourly count", hourlyRes.data?.length);

      const hourly: HourlyWeather[] = (hourlyRes.data || []).map((h: any) => ({
        dt: Number(h.dt),
        temp: Number(h.temp ?? 0),
        humidity: Number(h.humidity ?? 0),
        pressure: Number(h.pressure ?? 0),
        clouds: Number(h.clouds ?? 0),
        wind_speed: Number(h.wind_speed ?? 0),
        pop: Number(h.pop ?? 0),
        rain: h.rain_1h != null ? { "1h": Number(h.rain_1h) } : undefined,
        weather: [],
      }));

      // 5) Daily weather
      const dailyRes = await supabase
        .from("daily_weather")
        .select(
          "dt, temp_day:temp_day, temp_night:temp_night, temp_min, temp_max, humidity, pressure, wind_speed, pop, rain, summary",
        )
        .eq("request_id", requestId)
        .order("dt", { ascending: true });
      console.log("[FG:OpenWeather] Daily count", dailyRes.data?.length);

      const daily: DailyWeather[] = (dailyRes.data || []).map((d: any) => ({
        dt: Number(d.dt),
        temp: {
          day: Number(d.temp_day ?? 0),
          night: Number(d.temp_night ?? 0),
          min: Number(d.temp_min ?? 0),
          max: Number(d.temp_max ?? 0),
        },
        humidity: Number(d.humidity ?? 0),
        pressure: Number(d.pressure ?? 0),
        wind_speed: Number(d.wind_speed ?? 0),
        pop: Number(d.pop ?? 0),
        rain: d.rain != null ? Number(d.rain) : undefined,
        weather: [],
        summary: String(d.summary ?? ""),
      }));

      // 6) Alerts
      const alertsRes = await supabase
        .from("weather_alerts")
        .select("sender_name, event, start, end, description")
        .eq("request_id", requestId);
      console.log("[FG:OpenWeather] Alerts count", alertsRes.data?.length);

      const alerts: WeatherAlert[] = (alertsRes.data || []).map((a: any) => ({
        sender_name: String(a.sender_name ?? ""),
        event: String(a.event ?? ""),
        start: Number(a.start ?? 0),
        end: Number(a.end ?? 0),
        description: String(a.description ?? ""),
        tags: [],
      }));

      const current: CurrentWeather = {
        dt: Number(curRes.data.dt),
        temp: Number(curRes.data.temp ?? 0),
        feels_like: Number(curRes.data.feels_like ?? 0),
        pressure: Number(curRes.data.pressure ?? 0),
        humidity: Number(curRes.data.humidity ?? 0),
        clouds: Number(curRes.data.clouds ?? 0),
        visibility: Number(curRes.data.visibility ?? 0),
        wind_speed: Number(curRes.data.wind_speed ?? 0),
        wind_deg: Number(curRes.data.wind_deg ?? 0),
        rain:
          curRes.data.rain_1h != null
            ? { "1h": Number(curRes.data.rain_1h) }
            : undefined,
        snow:
          curRes.data.snow_1h != null
            ? { "1h": Number(curRes.data.snow_1h) }
            : undefined,
        weather:
          condRes && condRes.data ? [condRes.data as WeatherCondition] : [],
      };

      const result: OpenWeatherResponse = {
        lat,
        lon,
        timezone: String(locRes.data.timezone || "Asia/Ho_Chi_Minh"),
        current,
        hourly,
        daily,
        alerts,
      };

      console.log("[FG:OpenWeather] ✓ Loaded weather from stored schema");
      return result;
    } catch (err) {
      console.error("[FG:OpenWeather] Error fetching stored weather:", err);
      // Fall through to backend fetch
    }
  }

  // Fallback: use backend service URL
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const backendUrl = `${baseUrl}/api/weather/coords/${lat}/${lon}`;
    console.log(`[FG:OpenWeather] Fetching from backend`, { backendUrl });
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[FG:OpenWeather] Backend error`, {
        status: response.status,
        errorText,
      });
      return null;
    }
    const backendResponse = await response.json();
    if (!backendResponse?.success) {
      console.error(
        "[FG:OpenWeather] Backend request failed:",
        backendResponse.error,
      );
      return null;
    }
    const data: OpenWeatherResponse = backendResponse.data;
    console.log("[FG:OpenWeather] ✓ Received weather data from backend");
    return data;
  } catch (error) {
    console.error("[FG:OpenWeather] Backend fetch error:", error);
    return null;
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
  dailyRainMm?: number,
): "Low" | "Medium" | "Heavy" {
  if (!dailyRainMm) return "Low";
  if (dailyRainMm >= 80) return "Heavy"; // 8cm (80mm) and above
  if (dailyRainMm >= 30) return "Medium"; // 3cm (30mm) to 8cm
  return "Low"; // Below 3cm (30mm)
}

/**
 * Estimate water level from daily rain volume
 * Water level is primarily based on daily rainfall (street level reference),
 * with humidity and clouds providing ±10% adjustment of the rain volume
 */
export function estimateWaterLevel(
  dailyRainMm: number,
  humidity?: number,
  clouds?: number,
): number {
  // Base: daily rain volume converted to cm (street water level)
  let level = dailyRainMm / 10;

  // Calculate adjustment range: ±10% of rain volume
  const maxAdjustment = level * 0.1;

  // Humidity adjustment: high humidity increases water level (more water retention)
  let humidityFactor = 0;
  if (humidity !== undefined) {
    // Normalize humidity to -1 to 1 range (centered at 50%)
    humidityFactor = (humidity - 50) / 50;
    // Clamp to [-1, 1]
    humidityFactor = Math.max(-1, Math.min(1, humidityFactor));
  }

  // Clouds adjustment: more clouds increase water level (more rain expected)
  let cloudsFactor = 0;
  if (clouds !== undefined) {
    // Normalize clouds to -1 to 1 range (centered at 50%)
    cloudsFactor = (clouds - 50) / 50;
    // Clamp to [-1, 1]
    cloudsFactor = Math.max(-1, Math.min(1, cloudsFactor));
  }

  // Apply combined adjustment: average of humidity and clouds factors, scaled by maxAdjustment
  const adjustment = (maxAdjustment * (humidityFactor + cloudsFactor)) / 2;
  level += adjustment;

  // Cap at 0-100cm range
  return Math.max(0, Math.min(Math.round(level), 100));
}

/**
 * Estimate tide level from atmospheric pressure
 * Low pressure indicates high tide conditions
 */
export function estimateTideLevel(pressure: number): "Low" | "Medium" | "High" {
  // Standard sea level pressure is ~1013 hPa
  if (pressure < 1010) return "High";
  if (pressure < 1013) return "Medium";
  return "Low";
}

/**
 * Determine water trend from pressure change and current conditions
 */
export function determineWaterTrend(
  currentPressure: number,
  humidity: number,
): "rising" | "stable" | "falling" {
  // If pressure is low and humidity is high: rising
  if (currentPressure < 1010 && humidity > 75) {
    return "rising";
  }
  // If pressure is high and humidity is low: falling
  if (currentPressure > 1015 && humidity < 60) {
    return "falling";
  }
  return "stable";
}

/**
 * Determine sensor status based on weather conditions
 */
export function determineSensorStatus(
  rainIntensity: "Low" | "Medium" | "Heavy",
  waterLevel: number,
): "online" | "warning" | "offline" {
  if (waterLevel > 60 || rainIntensity === "Heavy") {
    return "warning";
  }
  return "online";
}

/**
 * Transform OpenWeather alert to FlowGuard alert format
 */
export function transformAlert(
  alert: WeatherAlert,
  district: string,
): FlowGuardAlert {
  const severity: "low" | "medium" | "high" =
    alert.tags.includes("warning") || alert.event.includes("Warning")
      ? "high"
      : alert.tags.includes("watch") || alert.event.includes("Watch")
        ? "medium"
        : "low";

  const type: "flood" | "rain" | "tide" | "traffic" = alert.event
    .toLowerCase()
    .includes("flood")
    ? "flood"
    : alert.event.toLowerCase().includes("rain")
      ? "rain"
      : alert.event.toLowerCase().includes("tide")
        ? "tide"
        : "traffic";

  return {
    id: `${alert.event}-${alert.start}`,
    type,
    severity,
    title: alert.event,
    message: alert.description,
    district,
    createdAt: new Date(alert.start * 1000).toISOString(),
    expiresAt: new Date(alert.end * 1000).toISOString(),
    isActive: alert.end * 1000 > Date.now(),
  };
}

/**
 * FlowGuard Alert interface
 */
export interface FlowGuardAlert {
  id: string;
  type: "flood" | "rain" | "tide" | "traffic";
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
  district: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

/**
 * Transform OpenWeather data to FlowGuard Sensor format
 */
export interface FlowGuardSensor {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: "online" | "warning" | "offline";
  waterLevel: number;
  trend: "rising" | "stable" | "falling";
  district: string;
  rainIntensity: "Low" | "Medium" | "Heavy";
  tideLevel: "Low" | "Medium" | "High";
  reportsNearby: number;
  lastUpdate: string;
}

export async function transformOpenWeatherToSensor(
  weatherData: OpenWeatherResponse,
  district: string,
  sensorId: number = 1,
): Promise<FlowGuardSensor> {
  const current = weatherData.current;
  // Use daily rain volume (in mm) from OpenWeather forecast
  // OpenWeather daily.rain is already in mm, no conversion needed
  const dailyRainMm = weatherData.daily[0]?.rain || 0;

  console.log(
    `[OpenWeather] ${district}: daily rain = ${dailyRainMm}mm, daily array length = ${weatherData.daily.length}`,
  );
  if (weatherData.daily[0]) {
    console.log(`[OpenWeather] ${district}: daily[0] = `, weatherData.daily[0]);
  }

  const rainIntensity = determineRainIntensity(dailyRainMm);
  const waterLevel = estimateWaterLevel(
    dailyRainMm,
    current.humidity,
    current.clouds,
  );
  const tideLevel = estimateTideLevel(current.pressure);
  const trend = determineWaterTrend(current.pressure, current.humidity);
  const status = determineSensorStatus(rainIntensity, waterLevel);

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
    lastUpdate: new Date(current.dt * 1000).toISOString(),
  };
}

/**
 * Fetch and transform weather data for multiple districts
 */
export async function fetchWeatherForAllDistricts(
  districts: Array<{ name: string; lat: number; lng: number }>,
): Promise<FlowGuardSensor[]> {
  console.log(
    "[OpenWeather] Fetching for districts:",
    districts.map((d) => `${d.name} (${d.lat}, ${d.lng})`),
  );

  const promises = districts.map(async (district, index) => {
    const weather = await fetchOpenWeatherData(district.lat, district.lng);
    if (!weather) {
      console.warn(`[OpenWeather] No data returned for ${district.name}`);
      return null;
    }

    return transformOpenWeatherToSensor(weather, district.name, index + 1);
  });

  const results = await Promise.all(promises);
  return results.filter((sensor): sensor is FlowGuardSensor => sensor !== null);
}

/**
 * Fetch and transform alerts for a district
 */
export async function fetchAlertsForDistrict(
  lat: number,
  lng: number,
  district: string,
): Promise<FlowGuardAlert[]> {
  const weather = await fetchOpenWeatherData(lat, lng);
  if (!weather || !weather.alerts) return [];

  return weather.alerts.map((alert) => transformAlert(alert, district));
}
