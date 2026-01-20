export interface Sensor {
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

export const MOCK_SENSORS: Sensor[] = [
  {
    id: 1,
    name: 'Nguyễn Hữu Cảnh',
    lat: 10.788,
    lng: 106.703,
    status: 'online',
    waterLevel: 52,
    trend: 'rising',
    district: 'District 4',
    rainIntensity: 'Heavy',
    tideLevel: 'Medium',
    reportsNearby: 3,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Võ Văn Kiệt',
    lat: 10.757,
    lng: 106.682,
    status: 'online',
    waterLevel: 38,
    trend: 'stable',
    district: 'District 1',
    rainIntensity: 'Medium',
    tideLevel: 'Medium',
    reportsNearby: 1,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Huỳnh Tấn Phát',
    lat: 10.736,
    lng: 106.702,
    status: 'warning',
    waterLevel: 68,
    trend: 'rising',
    district: 'District 7',
    rainIntensity: 'Heavy',
    tideLevel: 'High',
    reportsNearby: 5,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Phan Xích Long',
    lat: 10.798,
    lng: 106.686,
    status: 'online',
    waterLevel: 28,
    trend: 'stable',
    district: 'Phú Nhuận',
    rainIntensity: 'Low',
    tideLevel: 'Low',
    reportsNearby: 0,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Lê Văn Sỹ',
    lat: 10.795,
    lng: 106.673,
    status: 'online',
    waterLevel: 42,
    trend: 'rising',
    district: 'District 3',
    rainIntensity: 'Medium',
    tideLevel: 'Medium',
    reportsNearby: 2,
    lastUpdate: new Date().toISOString()
  }
]

export function getSensorByDistrict(district: string): Sensor | undefined {
  return MOCK_SENSORS.find(s => s.district === district)
}

export function getHighRiskSensors(): Sensor[] {
  return MOCK_SENSORS.filter(s => s.waterLevel > 50 || s.status === 'warning')
}
