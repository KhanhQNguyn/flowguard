export const cityOverview = {
  totalDistricts: 5,
  overallRisk: 'MEDIUM',
  activeHighAlerts: 3,
  sensorHealth: 94,
  activeUsers: 1247
}

export const districtMetrics = [
  {
    id: 1,
    name: 'District 1',
    risk: 'LOW',
    sensorsOnline: 9,
    sensorsTotal: 10,
    activeAlerts: 0,
    userReports: 2,
    trend: 'stable',
    avgWaterLevel: 30
  },
  {
    id: 4,
    name: 'District 4',
    risk: 'HIGH',
    sensorsOnline: 9,
    sensorsTotal: 10,
    activeAlerts: 2,
    userReports: 8,
    trend: 'rising',
    avgWaterLevel: 52
  },
  {
    id: 7,
    name: 'District 7',
    risk: 'CRITICAL',
    sensorsOnline: 8,
    sensorsTotal: 10,
    activeAlerts: 3,
    userReports: 12,
    trend: 'rising',
    avgWaterLevel: 67
  },
  {
    id: 'BT',
    name: 'Bình Thạnh',
    risk: 'LOW',
    sensorsOnline: 10,
    sensorsTotal: 10,
    activeAlerts: 1,
    userReports: 1,
    trend: 'stable',
    avgWaterLevel: 31
  },
  {
    id: 'TD',
    name: 'Thủ Đức',
    risk: 'LOW',
    sensorsOnline: 9,
    sensorsTotal: 10,
    activeAlerts: 0,
    userReports: 0,
    trend: 'stable',
    avgWaterLevel: 27
  }
]

export const criticalAlerts = [
  {
    id: 1,
    severity: 'HIGH',
    location: 'Huỳnh Tấn Phát, District 7',
    timestamp: '2026-01-19T17:25:00',
    source: 'Sensor #21 + 12 user reports',
    status: 'active',
    affectedArea: '0.8km radius',
    waterLevel: 78
  },
  {
    id: 2,
    severity: 'HIGH',
    location: 'Nguyễn Hữu Cảnh, District 4',
    timestamp: '2026-01-19T17:20:00',
    source: 'Sensor #14 + 8 user reports',
    status: 'active',
    affectedArea: '0.5km radius',
    waterLevel: 75
  },
  {
    id: 3,
    severity: 'MEDIUM',
    location: 'Hoàng Sa, District 4',
    timestamp: '2026-01-19T17:15:00',
    source: 'Sensor #12 + 5 user reports',
    status: 'active',
    affectedArea: '0.3km radius',
    waterLevel: 62
  }
]

export const sensorPerformance = {
  total: 50,
  online: 47,
  offline: 3,
  averageUptime: 98.5,
  requiresMaintenance: ['Sensor #7', 'Sensor #18', 'Sensor #28', 'Sensor #48'],
  dataQuality: 96.2
}

export const userParticipation = {
  confirmationsToday: 342,
  accuracyRate: 89.5,
  districtActivity: [
    { district: 'District 7', reports: 45, users: 234 },
    { district: 'District 4', reports: 38, users: 198 },
    { district: 'District 1', reports: 12, users: 87 },
    { district: 'Bình Thạnh', reports: 8, users: 54 },
    { district: 'Thủ Đức', reports: 2, users: 23 }
  ],
  flowPointsDistributed: 5130,
  newSignups: 23
}

export const predictionAccuracy = {
  overall: 87.3,
  falsePositiveRate: 8.2,
  falseNegativeRate: 4.5,
  confidenceDistribution: {
    high: 245,
    medium: 89,
    low: 12
  },
  improvementTrend: [
    { week: 'Week 1', accuracy: 82, fpRate: 12, fnRate: 6 },
    { week: 'Week 2', accuracy: 85, fpRate: 10, fnRate: 5 },
    { week: 'Week 3', accuracy: 87, fpRate: 8.2, fnRate: 4.5 }
  ]
}

export const responseMetrics = {
  detectionToAlert: { actual: 1.8, target: 2.0, unit: 'minutes', met: true },
  alertToNotification: { actual: 0.3, target: 0.5, unit: 'minutes', met: true },
  acknowledgmentTime: { actual: 4.2, target: 5.0, unit: 'minutes', met: true },
  resolutionTime: { actual: 18, target: 20, unit: 'minutes', met: true },
  slaCompliance: 96.8
}

export const historicalTrends = {
  monthlyIncidents: [
    { month: 'Jan', count: 12, year: 2025 },
    { month: 'Feb', count: 18, year: 2025 },
    { month: 'Mar', count: 14, year: 2025 },
    { month: 'Apr', count: 22, year: 2025 },
    { month: 'May', count: 8, year: 2025 },
    { month: 'Jun', count: 25, year: 2025 },
    { month: 'Jul', count: 5, year: 2025 },
    { month: 'Aug', count: 3, year: 2025 },
    { month: 'Sep', count: 7, year: 2025 },
    { month: 'Oct', count: 9, year: 2025 },
    { month: 'Nov', count: 11, year: 2025 },
    { month: 'Dec', count: 6, year: 2025 }
  ],
  frequentlyFlooded: [
    { street: 'Huỳnh Tấn Phát', incidents: 24, district: 'District 7' },
    { street: 'Nguyễn Hữu Cảnh', incidents: 19, district: 'District 4' },
    { street: 'Nguyễn Duy Trinh', incidents: 16, district: 'District 7' },
    { street: 'Lạc Long Quân', incidents: 14, district: 'District 7' },
    { street: 'Hoàng Sa', incidents: 12, district: 'District 4' },
    { street: 'Hà Nội', incidents: 11, district: 'District 1' },
    { street: 'Quốc Lộ 13', incidents: 10, district: 'Bình Thạnh' },
    { street: 'Trường Chinh', incidents: 9, district: 'Bình Thạnh' },
    { street: 'Lý Chính Thắng', incidents: 8, district: 'District 4' },
    { street: 'Phan Xích Long', incidents: 7, district: 'Bình Thạnh' }
  ],
  hourlyPattern: Array(24).fill(0).map((_, i) => ({
    hour: i,
    incidents: Math.floor(Math.random() * 15) + 2,
    year: 2025
  }))
}

export const systemHealth = {
  apiResponseTime: 145,
  dbQueryPerformance: 89,
  alertDeliveryRate: 99.2,
  appCrashRate: 0.3,
  serverUptime: 99.8
}

export const quickStats = {
  totalReports: 487,
  pendingVerification: 23,
  resolvedToday: 34,
  activeOperators: 8,
  systemStatus: 'operational'
}
