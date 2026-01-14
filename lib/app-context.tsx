"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import {
  type RiskLevel,
  type RainIntensity,
  type TideLevel,
  type FloodInputs,
  type PredictionPoint,
  type DistrictStatus,
  type SensorData,
  type AlertData,
  calculateFloodRisk,
  generatePredictionData,
  calculateTimeToRisk,
  generateDistrictStatuses,
  generateAlerts,
} from "./flood-logic"
import { MOCK_SENSORS } from "./mock-data"

interface AppState {
  // Environmental inputs
  rainIntensity: RainIntensity
  waterLevel: number
  tideLevel: TideLevel
  citizenReports: number

  // Computed outputs
  currentRisk: RiskLevel
  predictionData: PredictionPoint[]
  districtStatus: DistrictStatus[]
  timeToRisk: number
  sensors: SensorData[]
  alerts: AlertData[]

  // UI state
  showDemoControls: boolean
  mapLayers: {
    heatmap: boolean
    sensors: boolean
    reports: boolean
    tide: boolean
  }

  // Actions
  setRainIntensity: (value: RainIntensity) => void
  setWaterLevel: (value: number) => void
  setTideLevel: (value: TideLevel) => void
  setCitizenReports: (value: number) => void
  setShowDemoControls: (show: boolean) => void
  toggleMapLayer: (layer: keyof AppState["mapLayers"]) => void
  resetToDefault: () => void
}

const DEFAULT_STATE = {
  rainIntensity: "Heavy" as RainIntensity,
  waterLevel: 45,
  tideLevel: "Medium" as TideLevel,
  citizenReports: 3,
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [rainIntensity, setRainIntensity] = useState<RainIntensity>(DEFAULT_STATE.rainIntensity)
  const [waterLevel, setWaterLevel] = useState(DEFAULT_STATE.waterLevel)
  const [tideLevel, setTideLevel] = useState<TideLevel>(DEFAULT_STATE.tideLevel)
  const [citizenReports, setCitizenReports] = useState(DEFAULT_STATE.citizenReports)
  const [showDemoControls, setShowDemoControls] = useState(false)
  const [mapLayers, setMapLayers] = useState({
    heatmap: true,
    sensors: true,
    reports: true,
    tide: false,
  })

  // Compute derived state
  const inputs: FloodInputs = { rainIntensity, waterLevel, citizenReports, tideLevel }
  const currentRisk = calculateFloodRisk(inputs)
  const predictionData = generatePredictionData(waterLevel, rainIntensity)
  const districtStatus = generateDistrictStatuses(waterLevel, rainIntensity)
  const timeToRisk = calculateTimeToRisk(waterLevel, rainIntensity)
  const alerts = generateAlerts(inputs, districtStatus)

  // Update sensors based on water level
  const sensors = MOCK_SENSORS.map((s) => ({
    ...s,
    waterLevel: s.status === "offline" ? 0 : Math.max(0, s.waterLevel + (waterLevel - 45)),
    status:
      s.status === "offline"
        ? ("offline" as const)
        : s.waterLevel + (waterLevel - 45) > 60
          ? ("critical" as const)
          : s.waterLevel + (waterLevel - 45) > 50
            ? ("warning" as const)
            : ("online" as const),
  }))

  const toggleMapLayer = useCallback((layer: keyof typeof mapLayers) => {
    setMapLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }, [])

  const resetToDefault = useCallback(() => {
    setRainIntensity(DEFAULT_STATE.rainIntensity)
    setWaterLevel(DEFAULT_STATE.waterLevel)
    setTideLevel(DEFAULT_STATE.tideLevel)
    setCitizenReports(DEFAULT_STATE.citizenReports)
  }, [])

  return (
    <AppContext.Provider
      value={{
        rainIntensity,
        waterLevel,
        tideLevel,
        citizenReports,
        currentRisk,
        predictionData,
        districtStatus,
        timeToRisk,
        sensors,
        alerts,
        showDemoControls,
        mapLayers,
        setRainIntensity,
        setWaterLevel,
        setTideLevel,
        setCitizenReports,
        setShowDemoControls,
        toggleMapLayer,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
