export interface Alert {
  id: string
  type: 'flood' | 'rain' | 'tide' | 'traffic'
  severity: 'low' | 'medium' | 'high'
  title: string
  message: string
  district: string
  street?: string
  createdAt: string
  expiresAt: string
  isActive: boolean
}

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    type: 'flood',
    severity: 'high',
    title: 'Flood Warning',
    message: 'Water level rising rapidly on Huỳnh Tấn Phát. Avoid travel if possible.',
    district: 'District 7',
    street: 'Huỳnh Tấn Phát',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    isActive: true
  },
  {
    id: 'a2',
    type: 'rain',
    severity: 'medium',
    title: 'Heavy Rain Alert',
    message: 'Heavy rainfall expected in the next 2 hours. Plan accordingly.',
    district: 'District 4',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 3600000).toISOString(),
    isActive: true
  },
  {
    id: 'a3',
    type: 'tide',
    severity: 'medium',
    title: 'High Tide Warning',
    message: 'High tide expected at 6:30 PM. Low-lying areas may experience water rise.',
    district: 'District 7',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 4 * 3600000).toISOString(),
    isActive: true
  },
  {
    id: 'a4',
    type: 'flood',
    severity: 'low',
    title: 'Minor Flooding',
    message: 'Minor water accumulation reported. Drive carefully.',
    district: 'District 3',
    street: 'Lê Văn Sỹ',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 1 * 3600000).toISOString(),
    isActive: true
  }
]

export function getActiveAlerts(): Alert[] {
  return MOCK_ALERTS.filter(a => a.isActive)
}

export function getAlertsByDistrict(district: string): Alert[] {
  return MOCK_ALERTS.filter(a => a.district === district && a.isActive)
}

export function getHighSeverityAlerts(): Alert[] {
  return MOCK_ALERTS.filter(a => a.severity === 'high' && a.isActive)
}
