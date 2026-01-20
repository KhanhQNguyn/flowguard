'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { calculateFloodRisk, RiskOutput } from '@/lib/flood-logic'
import { MOCK_SENSORS, Sensor } from '@/lib/mock-sensors'
import { MOCK_ALERTS, Alert } from '@/lib/mock-alerts'
import {
  fetchWeatherForAllDistricts,
  fetchAlertsForDistrict,
  FlowGuardSensor,
  FlowGuardAlert
} from '@/lib/openweather-service'

// District coordinates for OpenWeather API calls
const DISTRICTS = [
  { name: 'District 1', lat: 10.757, lng: 106.682 },
  { name: 'District 3', lat: 10.795, lng: 106.673 },
  { name: 'District 4', lat: 10.788, lng: 106.703 },
  { name: 'District 7', lat: 10.7356, lng: 106.7019 },
  { name: 'Phú Nhuận', lat: 10.798, lng: 106.686 }
]

interface AppContextType {
  currentDistrict: string
  setCurrentDistrict: (district: string) => void
  currentRisk: RiskOutput | null
  sensors: Sensor[]
  alerts: Alert[]
  lastUpdated: Date
  refreshData: () => void
  isLoadingWeather: boolean
  districts: string[]
  setDistrict: (district: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentDistrict, setCurrentDistrict] = useState('District 7')
  const [currentRisk, setCurrentRisk] = useState<RiskOutput | null>(null)
  const [sensors, setSensors] = useState<Sensor[]>(MOCK_SENSORS)
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS.filter(a => a.isActive))
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [useRealWeather, setUseRealWeather] = useState(true)

  const calculateRiskForDistrict = (district: string) => {
    const sensor = sensors.find(s => s.district === district)
    if (sensor) {
      const risk = calculateFloodRisk({
        rainIntensity: sensor.rainIntensity,
        waterLevel: sensor.waterLevel,
        citizenReports: sensor.reportsNearby,
        tideLevel: sensor.tideLevel
      })
      setCurrentRisk(risk)
    }
  }

  // Fetch real weather data from OpenWeather API
  const fetchWeatherData = async () => {
    if (!useRealWeather) {
      console.log('[FlowGuard] useRealWeather is false, skipping API fetch')
      return
    }

    setIsLoadingWeather(true)
    console.log('[FlowGuard] Starting weather data fetch for', DISTRICTS.length, 'districts')
    
    try {
      // Fetch weather for all districts
      const weatherSensors = await fetchWeatherForAllDistricts(DISTRICTS)
      console.log('[FlowGuard] Received', weatherSensors.length, 'weather sensors from API')
      
      if (weatherSensors.length > 0) {
        // Convert to mock Sensor format for compatibility
        const convertedSensors: Sensor[] = weatherSensors.map(ws => ({
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
          lastUpdate: ws.lastUpdate
        }))
        
        console.log('[FlowGuard] Converted sensors:', convertedSensors)
        convertedSensors.forEach(s => {
          console.log(`[FlowGuard] ${s.district}: waterLevel=${s.waterLevel}cm, rain=${s.rainIntensity}`)
        })
        setSensors(convertedSensors)
        
        // Fetch alerts for all districts and combine
        const allAlerts: Alert[] = []
        for (const district of DISTRICTS) {
          const districtAlerts = await fetchAlertsForDistrict(
            district.lat,
            district.lng,
            district.name
          )
          allAlerts.push(
            ...districtAlerts.map(da => ({
              id: da.id,
              type: da.type,
              severity: da.severity,
              title: da.title,
              message: da.message,
              district: da.district,
              street: undefined,
              createdAt: da.createdAt,
              expiresAt: da.expiresAt,
              isActive: da.isActive
            }))
          )
        }
        
        setAlerts(allAlerts)
        setLastUpdated(new Date())
        console.log('[FlowGuard] Weather data updated from OpenWeather API')
      } else {
        console.warn('[FlowGuard] No weather sensors received from API')
      }
    } catch (error) {
      console.error('[FlowGuard] Error fetching weather data:', error)
      // Gracefully fall back to mock data if API fails
      console.log('[FlowGuard] Falling back to mock data')
    } finally {
      setIsLoadingWeather(false)
    }
  }

  const refreshData = () => {
    if (useRealWeather) {
      fetchWeatherData()
    } else {
      calculateRiskForDistrict(currentDistrict)
      setLastUpdated(new Date())
    }
  }

  // Initial load: fetch real weather data
  useEffect(() => {
    console.log('[FlowGuard] App mounted, fetching initial weather data')
    fetchWeatherData()
  }, [useRealWeather])

  // Recalculate risk when district changes or sensors update
  useEffect(() => {
    calculateRiskForDistrict(currentDistrict)
  }, [currentDistrict, sensors])

  // Auto-refresh every 10 minutes (600 seconds)
  // This keeps us at ~720 calls/day, well within the 1,000 free tier limit
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 600000) // 10 minutes

    return () => clearInterval(interval)
  }, [useRealWeather])

  const districtNames = DISTRICTS.map(d => d.name)

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
        setDistrict: setCurrentDistrict
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
