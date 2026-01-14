import type { SensorData, AlertData } from "./flood-logic"

export interface Report {
  id: number
  image: string
  location: string
  district: string
  waterDepth: string
  userName: string
  verified: boolean
  aiConfidence: number
  timestamp: string
  lat: number
  lng: number
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  district: string
  avatarInitials: string
}

export const MOCK_USER: User = {
  id: 1,
  name: "Frank Nguyen",
  email: "frank@example.com",
  phone: "+84 90 123 4567",
  district: "District 7",
  avatarInitials: "FN",
}

export const MOCK_SENSORS: SensorData[] = [
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

export const MOCK_ALERTS: AlertData[] = [
  {
    id: 1,
    type: "system",
    severity: "HIGH",
    title: "HIGH RISK ALERT - Flooding Expected",
    location: "District 7 – Huỳnh Tấn Phát",
    message: "Water level exceeds 70cm. Avoid travel. Flooding likely within 15 minutes.",
    time: "5 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    type: "weather",
    severity: "MEDIUM",
    title: "Heavy Rain Warning",
    location: "HCMC Metropolitan Area",
    message: "Heavy rainfall expected to continue for the next 2 hours. Prepare for potential flooding.",
    time: "12 minutes ago",
    isRead: false,
  },
  {
    id: 3,
    type: "sensor",
    severity: "MEDIUM",
    title: "Water Rising - Monitor Closely",
    location: "District 4 – Cầu Kênh Tẻ",
    message: "Water level at 55cm and rising. May reach warning threshold within 30 minutes.",
    time: "18 minutes ago",
    isRead: true,
  },
  {
    id: 4,
    type: "community",
    severity: "LOW",
    title: "Minor Street Flooding",
    location: "Bình Thạnh – Xô Viết Nghệ Tĩnh",
    message: "Citizen reports indicate minor ponding on side streets. Main roads clear.",
    time: "25 minutes ago",
    isRead: true,
  },
  {
    id: 5,
    type: "system",
    severity: "LOW",
    title: "All Clear - District 1",
    location: "District 1",
    message: "Conditions normal. Water levels stable. No flooding reported.",
    time: "1 hour ago",
    isRead: true,
  },
  {
    id: 6,
    type: "sensor",
    severity: "MEDIUM",
    title: "Sensor Alert - Rising Trend",
    location: "Thủ Đức – Highway 1A",
    message: "Water level increased 15cm in last 30 minutes. Monitoring closely.",
    time: "1.5 hours ago",
    isRead: true,
  },
  {
    id: 7,
    type: "weather",
    severity: "LOW",
    title: "Rain Subsiding",
    location: "Eastern Districts",
    message: "Rainfall intensity decreasing. Conditions expected to improve within 1 hour.",
    time: "2 hours ago",
    isRead: true,
  },
  {
    id: 8,
    type: "community",
    severity: "LOW",
    title: "Drainage Cleared",
    location: "District 7 – Phú Mỹ Hưng",
    message: "City crews have cleared blocked drainage. Water receding.",
    time: "3 hours ago",
    isRead: true,
  },
]

export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    image: "/flooded-street-with-water-reaching-car-tires.jpg",
    location: "Nguyễn Hữu Cảnh Street",
    district: "District 4",
    waterDepth: "Knee-deep (30-50cm)",
    userName: "Minh T.",
    verified: true,
    aiConfidence: 94,
    timestamp: "10 min ago",
    lat: 10.788,
    lng: 106.703,
  },
  {
    id: 2,
    image: "/water-flooding-residential-street.jpg",
    location: "Huỳnh Tấn Phát Avenue",
    district: "District 7",
    waterDepth: "Ankle-deep (10-20cm)",
    userName: "Lan N.",
    verified: true,
    aiConfidence: 89,
    timestamp: "25 min ago",
    lat: 10.736,
    lng: 106.702,
  },
  {
    id: 3,
    image: "/urban-street-with-minor-flooding.jpg",
    location: "Võ Văn Kiệt Boulevard",
    district: "District 1",
    waterDepth: "Minor ponding (<10cm)",
    userName: "Duc P.",
    verified: false,
    aiConfidence: 72,
    timestamp: "45 min ago",
    lat: 10.757,
    lng: 106.682,
  },
  {
    id: 4,
    image: "/flooded-intersection-with-motorbikes.jpg",
    location: "Xô Viết Nghệ Tĩnh",
    district: "Bình Thạnh",
    waterDepth: "Knee-deep (30-50cm)",
    userName: "Hoa L.",
    verified: true,
    aiConfidence: 91,
    timestamp: "1 hour ago",
    lat: 10.801,
    lng: 106.712,
  },
  {
    id: 5,
    image: "/water-on-highway-during-rain.jpg",
    location: "Highway 1A",
    district: "Thủ Đức",
    waterDepth: "Ankle-deep (10-20cm)",
    userName: "Tuan V.",
    verified: true,
    aiConfidence: 87,
    timestamp: "1.5 hours ago",
    lat: 10.852,
    lng: 106.751,
  },
  {
    id: 6,
    image: "/residential-area-with-flood-water.jpg",
    location: "Phú Mỹ Hưng",
    district: "District 7",
    waterDepth: "Minor ponding (<10cm)",
    userName: "Kim A.",
    verified: false,
    aiConfidence: 65,
    timestamp: "2 hours ago",
    lat: 10.729,
    lng: 106.718,
  },
]

// Pagination helper
export function paginate<T>(items: T[], page: number, perPage = 10) {
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    items: items.slice(start, end),
    totalPages: Math.ceil(items.length / perPage),
    currentPage: page,
    total: items.length,
  }
}

// Filter alerts
export function filterAlerts(
  alerts: AlertData[],
  filters: {
    severity?: string
    district?: string
  },
): AlertData[] {
  return alerts.filter((alert) => {
    if (filters.severity && filters.severity !== "all" && alert.severity !== filters.severity) {
      return false
    }
    if (filters.district && filters.district !== "all" && !alert.location.includes(filters.district)) {
      return false
    }
    return true
  })
}

// Filter reports
export function filterReports(
  reports: Report[],
  filters: {
    verified?: string
    district?: string
  },
): Report[] {
  return reports.filter((report) => {
    if (filters.verified === "verified" && !report.verified) return false
    if (filters.verified === "pending" && report.verified) return false
    if (filters.district && filters.district !== "all" && report.district !== filters.district) {
      return false
    }
    return true
  })
}
