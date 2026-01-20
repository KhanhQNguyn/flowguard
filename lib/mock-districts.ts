export interface District {
  id: string
  name: string
  nameVi: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  activeAlerts: number
  sensorCount: number
  population: number
}

export const MOCK_DISTRICTS: District[] = [
  {
    id: 'd1',
    name: 'District 1',
    nameVi: 'Quận 1',
    riskLevel: 'LOW',
    activeAlerts: 0,
    sensorCount: 8,
    population: 180000
  },
  {
    id: 'd4',
    name: 'District 4',
    nameVi: 'Quận 4',
    riskLevel: 'MEDIUM',
    activeAlerts: 2,
    sensorCount: 5,
    population: 175000
  },
  {
    id: 'd7',
    name: 'District 7',
    nameVi: 'Quận 7',
    riskLevel: 'HIGH',
    activeAlerts: 4,
    sensorCount: 12,
    population: 310000
  },
  {
    id: 'pn',
    name: 'Phú Nhuận',
    nameVi: 'Phú Nhuận',
    riskLevel: 'LOW',
    activeAlerts: 0,
    sensorCount: 4,
    population: 175000
  },
  {
    id: 'd3',
    name: 'District 3',
    nameVi: 'Quận 3',
    riskLevel: 'MEDIUM',
    activeAlerts: 1,
    sensorCount: 6,
    population: 190000
  },
  {
    id: 'btan',
    name: 'Bình Thạnh',
    nameVi: 'Bình Thạnh',
    riskLevel: 'MEDIUM',
    activeAlerts: 2,
    sensorCount: 7,
    population: 485000
  }
]

export function getDistrictByName(name: string): District | undefined {
  return MOCK_DISTRICTS.find(d => d.name === name || d.nameVi === name)
}

export function getHighRiskDistricts(): District[] {
  return MOCK_DISTRICTS.filter(d => d.riskLevel === 'HIGH')
}
