'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { calculateFloodRisk, RiskOutput } from '@/lib/flood-logic'
import { MOCK_SENSORS, Sensor } from '@/lib/mock-sensors'
import { MOCK_ALERTS, Alert } from '@/lib/mock-alerts'

interface AppContextType {
  currentDistrict: string
  setCurrentDistrict: (district: string) => void
  currentRisk: RiskOutput | null
  sensors: Sensor[]
  alerts: Alert[]
  lastUpdated: Date
  refreshData: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentDistrict, setCurrentDistrict] = useState('District 7')
  const [currentRisk, setCurrentRisk] = useState<RiskOutput | null>(null)
  const [sensors] = useState<Sensor[]>(MOCK_SENSORS)
  const [alerts] = useState<Alert[]>(MOCK_ALERTS.filter(a => a.isActive))
  const [lastUpdated, setLastUpdated] = useState(new Date())

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

  const refreshData = () => {
    calculateRiskForDistrict(currentDistrict)
    setLastUpdated(new Date())
  }

  useEffect(() => {
    calculateRiskForDistrict(currentDistrict)
  }, [currentDistrict])

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData()
    }, 30000)

    return () => clearInterval(interval)
  }, [currentDistrict])

  return (
    <AppContext.Provider
      value={{
        currentDistrict,
        setCurrentDistrict,
        currentRisk,
        sensors,
        alerts,
        lastUpdated,
        refreshData
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
