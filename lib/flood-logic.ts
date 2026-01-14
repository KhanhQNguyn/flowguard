export type RiskLevel = "LOW" | "MEDIUM" | "HIGH"
export type RainIntensity = "Low" | "Medium" | "Heavy"
export type TideLevel = "Low" | "Medium" | "High"

export interface FloodInputs {
  rainIntensity: RainIntensity
  waterLevel: number // in cm
  citizenReports: number
  tideLevel: TideLevel
}

export interface PredictionPoint {
  time: string
  waterLevel: number
}

export interface DistrictStatus {
  name: string
  risk: RiskLevel
  waterLevel: number
}

export interface SensorData {
  id: number
  name: string
  lat: number
  lng: number
  status: "online" | "offline" | "warning" | "critical"
  waterLevel: number
  trend: "rising" | "stable" | "falling"
  lastUpdate: string
}

export interface AlertData {
  id: number
  type: "system" | "sensor" | "weather" | "community"
  severity: RiskLevel
  title: string
  location: string
  message: string
  time: string
  isRead: boolean
}

// Core risk calculation function
export function calculateFloodRisk(inputs: FloodInputs): RiskLevel {
  const { rainIntensity, waterLevel, citizenReports, tideLevel } = inputs

  let risk: RiskLevel = "LOW"

  // PRIMARY THRESHOLDS
  if (waterLevel > 70) {
    risk = "HIGH"
  } else if (waterLevel > 50) {
    risk = "MEDIUM"
  }

  // RAIN INTENSITY ESCALATION
  if (rainIntensity === "Heavy") {
    if (waterLevel > 50) risk = "HIGH"
    else if (waterLevel > 30) risk = "MEDIUM"
  }

  if (rainIntensity === "Medium") {
    if (waterLevel > 60) risk = "HIGH"
    else if (waterLevel > 40) risk = "MEDIUM"
  }

  // TIDE LEVEL MODIFIER
  if (tideLevel === "High" && waterLevel > 40) {
    if (risk === "MEDIUM") risk = "HIGH"
    else if (risk === "LOW") risk = "MEDIUM"
  }

  // CITIZEN REPORT ESCALATION
  if (citizenReports >= 3 && waterLevel > 35) {
    if (risk === "LOW") risk = "MEDIUM"
    else if (risk === "MEDIUM") risk = "HIGH"
  }

  return risk
}

// Generate prediction timeline data
export function generatePredictionData(currentWaterLevel: number, rainIntensity: RainIntensity): PredictionPoint[] {
  const data: PredictionPoint[] = []
  let level = currentWaterLevel

  // Rate of rise based on rain
  const riseRate = rainIntensity === "Heavy" ? 2 : rainIntensity === "Medium" ? 1 : 0.5

  for (let i = 0; i <= 60; i += 10) {
    data.push({
      time: i === 0 ? "Now" : `+${i}m`,
      waterLevel: Math.round(level),
    })
    level += riseRate * 10
  }

  return data
}

// Calculate time to risk threshold
export function calculateTimeToRisk(currentWaterLevel: number, rainIntensity: RainIntensity, threshold = 70): number {
  const riseRate = rainIntensity === "Heavy" ? 2 : rainIntensity === "Medium" ? 1 : 0.5

  if (currentWaterLevel >= threshold) return 0

  const difference = threshold - currentWaterLevel
  return Math.ceil(difference / riseRate)
}

// Generate district statuses based on base water level
export function generateDistrictStatuses(baseWaterLevel: number, rainIntensity: RainIntensity): DistrictStatus[] {
  const districts = [
    { name: "District 1", modifier: -15 },
    { name: "District 4", modifier: 5 },
    { name: "District 7", modifier: 20 },
    { name: "Bình Thạnh", modifier: -10 },
    { name: "Thủ Đức", modifier: 0 },
  ]

  return districts.map((d) => {
    const waterLevel = Math.max(0, baseWaterLevel + d.modifier)
    const risk = calculateFloodRisk({
      waterLevel,
      rainIntensity,
      citizenReports: 0,
      tideLevel: "Medium",
    })
    return { name: d.name, risk, waterLevel }
  })
}

// Initial sensor data
export const INITIAL_SENSORS: SensorData[] = [
  {
    id: 1,
    name: "Nguyễn Hữu Cảnh",
    lat: 10.788,
    lng: 106.703,
    status: "online",
    waterLevel: 52,
    trend: "rising",
    lastUpdate: "2 min ago",
  },
  {
    id: 2,
    name: "Võ Văn Kiệt",
    lat: 10.757,
    lng: 106.682,
    status: "online",
    waterLevel: 38,
    trend: "stable",
    lastUpdate: "1 min ago",
  },
  {
    id: 3,
    name: "Huỳnh Tấn Phát",
    lat: 10.736,
    lng: 106.702,
    status: "warning",
    waterLevel: 68,
    trend: "rising",
    lastUpdate: "3 min ago",
  },
  {
    id: 4,
    name: "Cầu Kênh Tẻ",
    lat: 10.745,
    lng: 106.715,
    status: "online",
    waterLevel: 42,
    trend: "stable",
    lastUpdate: "5 min ago",
  },
  {
    id: 5,
    name: "Cầu Phú Mỹ",
    lat: 10.732,
    lng: 106.721,
    status: "offline",
    waterLevel: 0,
    trend: "stable",
    lastUpdate: "Offline",
  },
]

// Generate alerts based on current conditions
export function generateAlerts(inputs: FloodInputs, districts: DistrictStatus[]): AlertData[] {
  const alerts: AlertData[] = []
  const risk = calculateFloodRisk(inputs)

  if (risk === "HIGH") {
    alerts.push({
      id: 1,
      type: "system",
      severity: "HIGH",
      title: "HIGH RISK ALERT",
      location: "District 7 – Huỳnh Tấn Phát",
      message: "Water level exceeds 70cm. Avoid travel. Flooding likely.",
      time: "5 minutes ago",
      isRead: false,
    })
  }

  if (inputs.rainIntensity === "Heavy") {
    alerts.push({
      id: 2,
      type: "weather",
      severity: "MEDIUM",
      title: "Heavy Rain Warning",
      location: "HCMC Metropolitan Area",
      message: "Heavy rainfall expected to continue for the next 2 hours.",
      time: "12 minutes ago",
      isRead: false,
    })
  }

  districts
    .filter((d) => d.risk === "MEDIUM")
    .forEach((d, i) => {
      alerts.push({
        id: 10 + i,
        type: "sensor",
        severity: "MEDIUM",
        title: "Water Rising",
        location: d.name,
        message: `Water level at ${d.waterLevel}cm and rising.`,
        time: `${15 + i * 5} minutes ago`,
        isRead: true,
      })
    })

  alerts.push({
    id: 100,
    type: "community",
    severity: "LOW",
    title: "All Clear",
    location: "District 1",
    message: "Conditions normal. No flooding reported.",
    time: "1 hour ago",
    isRead: true,
  })

  return alerts
}
