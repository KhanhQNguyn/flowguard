"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { calculateFloodRisk, RiskOutput } from "@/lib/flood-logic";
import { MOCK_SENSORS, Sensor } from "@/lib/mock-sensors";
import { MOCK_ALERTS, Alert } from "@/lib/mock-alerts";
import {
  fetchWeatherForAllDistricts,
  fetchAlertsForDistrict,
  FlowGuardSensor,
  FlowGuardAlert,
} from "@/lib/openweather-service";
import { createClient } from "@supabase/supabase-js";

// District coordinates for OpenWeather API calls
const DISTRICTS = [
  { name: "District 1", lat: 10.757, lng: 106.682 },
  { name: "District 3", lat: 10.795, lng: 106.673 },
  { name: "District 4", lat: 10.788, lng: 106.703 },
  { name: "District 7", lat: 10.7356, lng: 106.7019 },
  { name: "Phú Nhuận", lat: 10.798, lng: 106.686 },
];

interface AppContextType {
  currentDistrict: string;
  setCurrentDistrict: (district: string) => void;
  currentRisk: RiskOutput | null;
  sensors: Sensor[];
  alerts: Alert[];
  lastUpdated: Date;
  refreshData: () => void;
  isLoadingWeather: boolean;
  districts: string[];
  setDistrict: (district: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentDistrict, setCurrentDistrict] = useState("District 7");
  const [currentRisk, setCurrentRisk] = useState<RiskOutput | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>(MOCK_SENSORS);
  const [alerts, setAlerts] = useState<Alert[]>(
    MOCK_ALERTS.filter((a) => a.isActive),
  );
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [useRealWeather, setUseRealWeather] = useState(true);

  // Supabase client (frontend-safe keys)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  const supabase =
    supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  const calculateRiskForDistrict = (district: string) => {
    const sensor = sensors.find((s) => s.district === district);
    if (sensor) {
      const risk = calculateFloodRisk({
        rainIntensity: sensor.rainIntensity,
        waterLevel: sensor.waterLevel,
        citizenReports: sensor.reportsNearby,
        tideLevel: sensor.tideLevel,
      });
      setCurrentRisk(risk);
    }
  };

  // Helper function to create timeout fetch
  const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeout = 5000,
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Fetch mock-like data from Supabase (fallback to local mocks)
  const fetchMockData = async () => {
    console.log("[FlowGuard] Fetching data from Supabase (mock-compatible)");
    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

      // Try loading sensors from a 'sensors' table
      const { data: sensorRows, error: sensorsErr } = await supabase
        .from("sensors")
        .select(
          "id,name,lat,lng,status,waterLevel,trend,district,rainIntensity,tideLevel,reportsNearby",
        )
        .limit(100);

      if (sensorsErr) {
        console.warn("[FlowGuard] Supabase sensors error:", sensorsErr.message);
      }

      if (sensorRows && sensorRows.length > 0) {
        const supaSensors: Sensor[] = sensorRows.map((s: any) => ({
          id: s.id,
          name: s.name,
          lat: s.lat,
          lng: s.lng,
          status: s.status,
          waterLevel: s.waterLevel,
          trend: s.trend,
          district: s.district,
          rainIntensity: s.rainIntensity,
          tideLevel: s.tideLevel,
          reportsNearby: s.reportsNearby,
          lastUpdate: s.lastUpdate ?? new Date().toISOString(),
        }));
        setSensors(supaSensors);
        console.log(
          "[FlowGuard] ✓ Sensors loaded from Supabase:",
          supaSensors.length,
        );
      } else {
        console.log("[FlowGuard] Using local MOCK_SENSORS (no Supabase rows)");
        setSensors(MOCK_SENSORS);
      }

      // Try loading alerts from an 'alerts' table
      const { data: alertRows, error: alertsErr } = await supabase
        .from("alerts")
        .select(
          "id,type,severity,title,message,district,street,isActive,createdAt,expiresAt",
        )
        .eq("isActive", true)
        .limit(200);

      if (alertsErr) {
        console.warn("[FlowGuard] Supabase alerts error:", alertsErr.message);
      }

      if (alertRows && alertRows.length > 0) {
        const supaAlerts: Alert[] = alertRows.map((a: any) => ({
          id: a.id,
          type: a.type,
          severity: a.severity,
          title: a.title,
          message: a.message,
          district: a.district,
          street: a.street,
          createdAt: a.createdAt
            ? new Date(a.createdAt).toISOString()
            : new Date().toISOString(),
          expiresAt: a.expiresAt
            ? new Date(a.expiresAt).toISOString()
            : new Date(Date.now() + 3600000).toISOString(),
          isActive: a.isActive,
        }));
        setAlerts(supaAlerts);
        console.log(
          "[FlowGuard] ✓ Alerts loaded from Supabase:",
          supaAlerts.length,
        );
      } else {
        console.log("[FlowGuard] Using local MOCK_ALERTS (no Supabase rows)");
        setAlerts(MOCK_ALERTS.filter((a) => a.isActive));
      }

      setLastUpdated(new Date());
    } catch (error: any) {
      console.warn(
        "[FlowGuard] Supabase fetch failed:",
        error.message || error,
      );
      console.log("[FlowGuard] Falling back to local mock data");
      if (sensors.length === 0) setSensors(MOCK_SENSORS);
      if (alerts.length === 0) setAlerts(MOCK_ALERTS.filter((a) => a.isActive));
      setLastUpdated(new Date());
    }
  };

  // Fetch real weather data from OpenWeather API (via backend)
  const fetchWeatherData = async () => {
    if (!useRealWeather) {
      console.log("[FlowGuard] useRealWeather is false, skipping API fetch");
      return;
    }

    setIsLoadingWeather(true);
    console.log(
      "[FlowGuard] Starting weather data fetch for",
      DISTRICTS.length,
      "districts",
    );

    try {
      // First fetch mock data (sensors + alerts)
      await fetchMockData();

      // Fetch weather for all districts
      const weatherSensors = await fetchWeatherForAllDistricts(DISTRICTS);
      console.log(
        "[FlowGuard] Received",
        weatherSensors.length,
        "weather sensors from API",
      );

      if (weatherSensors.length > 0) {
        // Convert to mock Sensor format for compatibility
        const convertedSensors: Sensor[] = weatherSensors.map((ws) => ({
          id: ws.id,
          name: ws.name,
          lat: ws.lat,
          lng: ws.lng,
          status: ws.status,
          waterLevel: ws.waterLevel,
          trend: ws.trend,
          district: ws.district,
          rainIntensity: ws.rainIntensity,
          tideLevel: ws.tideLevel,
          reportsNearby: ws.reportsNearby,
          lastUpdate: ws.lastUpdate,
        }));

        console.log("[FlowGuard] Converted sensors:", convertedSensors);
        convertedSensors.forEach((s) => {
          console.log(
            `[FlowGuard] ${s.district}: waterLevel=${s.waterLevel}cm, rain=${s.rainIntensity}`,
          );
        });
        setSensors(convertedSensors);

        // Fetch alerts for all districts and combine
        const allAlerts: Alert[] = [];
        for (const district of DISTRICTS) {
          const districtAlerts = await fetchAlertsForDistrict(
            district.lat,
            district.lng,
            district.name,
          );
          allAlerts.push(
            ...districtAlerts.map((da) => ({
              id: da.id,
              type: da.type,
              severity: da.severity,
              title: da.title,
              message: da.message,
              district: da.district,
              street: undefined,
              createdAt: da.createdAt,
              expiresAt: da.expiresAt,
              isActive: da.isActive,
            })),
          );
        }

        setAlerts(allAlerts);
        setLastUpdated(new Date());
        console.log("[FlowGuard] Weather data updated from OpenWeather API");
      } else {
        console.warn("[FlowGuard] No weather sensors received from API");
      }
    } catch (error) {
      console.error("[FlowGuard] Error fetching weather data:", error);
      // Gracefully fall back to mock data if API fails
      console.log("[FlowGuard] Falling back to mock data");
      await fetchMockData();
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const refreshData = () => {
    if (useRealWeather) {
      fetchWeatherData();
    } else {
      fetchMockData();
      calculateRiskForDistrict(currentDistrict);
      setLastUpdated(new Date());
    }
  };

  // Initial load: fetch mock-compatible data first, then real weather data
  useEffect(() => {
    console.log("[FlowGuard] App mounted, fetching initial data");
    fetchWeatherData();
  }, [useRealWeather]);

  // Recalculate risk when district changes or sensors update
  useEffect(() => {
    calculateRiskForDistrict(currentDistrict);
  }, [currentDistrict, sensors]);

  // Auto-refresh every 10 minutes (600 seconds)
  // This keeps us at ~720 calls/day, well within the 1,000 free tier limit
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [useRealWeather]);

  const districtNames = DISTRICTS.map((d) => d.name);

  return (
    <AppContext.Provider
      value={{
        currentDistrict,
        setCurrentDistrict,
        currentRisk,
        sensors,
        alerts,
        lastUpdated,
        refreshData,
        isLoadingWeather,
        districts: districtNames,
        setDistrict: setCurrentDistrict,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
