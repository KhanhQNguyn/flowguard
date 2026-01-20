export interface Sensor {
  id: number
  name: string
  lat: number
  lng: number
  status: 'online' | 'warning' | 'critical' | 'offline'
  waterLevel: number
  district: string
  ward?: string
  street?: string
  rainIntensity?: string
  tideLevel?: string
  reportsNearby?: number
  lastUpdate?: string
  batteryLevel?: number
  trend?: 'rising' | 'stable' | 'falling'
}

export const allSensors: Sensor[] = [
  // District 1 (10 sensors)
  { id: 1, name: 'D1-Sensor-01', lat: 10.7756, lng: 106.7019, status: 'online', waterLevel: 28, district: 'District 1', ward: 'Ward 1', street: 'Tôn Đức Thắng', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 92, trend: 'stable' },
  { id: 2, name: 'D1-Sensor-02', lat: 10.7721, lng: 106.6981, status: 'online', waterLevel: 32, district: 'District 1', ward: 'Ward 2', street: 'Nguyễn Huệ', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 1, lastUpdate: '1 min ago', batteryLevel: 88, trend: 'stable' },
  { id: 3, name: 'D1-Sensor-03', lat: 10.7689, lng: 106.7042, status: 'warning', waterLevel: 58, district: 'District 1', ward: 'Ward 1', street: 'Pasteur', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 2, lastUpdate: '3 min ago', batteryLevel: 85, trend: 'rising' },
  { id: 4, name: 'D1-Sensor-04', lat: 10.7812, lng: 106.6956, status: 'online', waterLevel: 25, district: 'District 1', ward: 'Ward 3', street: 'Lý Tự Trọng', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '1 min ago', batteryLevel: 91, trend: 'stable' },
  { id: 5, name: 'D1-Sensor-05', lat: 10.7645, lng: 106.7098, status: 'online', waterLevel: 35, district: 'District 1', ward: 'Ward 2', street: 'Cộng Hòa', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 1, lastUpdate: '2 min ago', batteryLevel: 89, trend: 'stable' },
  { id: 6, name: 'D1-Sensor-06', lat: 10.7834, lng: 106.7123, status: 'online', waterLevel: 29, district: 'District 1', ward: 'Ward 3', street: 'Trần Hưng Đạo', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '3 min ago', batteryLevel: 86, trend: 'stable' },
  { id: 7, name: 'D1-Sensor-07', lat: 10.7601, lng: 106.6934, status: 'offline', waterLevel: 0, district: 'District 1', ward: 'Ward 1', street: 'Đinh Tiên Hoàng', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '45 min ago', batteryLevel: 0, trend: 'stable' },
  { id: 8, name: 'D1-Sensor-08', lat: 10.7789, lng: 106.7087, status: 'online', waterLevel: 31, district: 'District 1', ward: 'Ward 2', street: 'Võ Văn Kiệt', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 1, lastUpdate: '2 min ago', batteryLevel: 90, trend: 'stable' },
  { id: 9, name: 'D1-Sensor-09', lat: 10.7712, lng: 106.6998, status: 'online', waterLevel: 27, district: 'District 1', ward: 'Ward 3', street: 'Hàng Xanh', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '1 min ago', batteryLevel: 93, trend: 'stable' },
  { id: 10, name: 'D1-Sensor-10', lat: 10.7667, lng: 106.7065, status: 'online', waterLevel: 33, district: 'District 1', ward: 'Ward 1', street: 'Mạc Thiên Tích', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 1, lastUpdate: '2 min ago', batteryLevel: 87, trend: 'stable' },

  // District 4 (10 sensors)
  { id: 11, name: 'D4-Sensor-01', lat: 10.7623, lng: 106.7042, status: 'online', waterLevel: 45, district: 'District 4', ward: 'Ward 1', street: 'Nguyễn Hữu Cảnh', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 2, lastUpdate: '2 min ago', batteryLevel: 84, trend: 'stable' },
  { id: 12, name: 'D4-Sensor-02', lat: 10.7589, lng: 106.7098, status: 'warning', waterLevel: 62, district: 'District 4', ward: 'Ward 2', street: 'Hoàng Sa', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 5, lastUpdate: '1 min ago', batteryLevel: 79, trend: 'rising' },
  { id: 13, name: 'D4-Sensor-03', lat: 10.7556, lng: 106.7012, status: 'online', waterLevel: 38, district: 'District 4', ward: 'Ward 1', street: 'Bạch Đằng', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 1, lastUpdate: '3 min ago', batteryLevel: 81, trend: 'stable' },
  { id: 14, name: 'D4-Sensor-04', lat: 10.7645, lng: 106.7145, status: 'critical', waterLevel: 75, district: 'District 4', ward: 'Ward 3', street: 'Hàng Ngang', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 8, lastUpdate: '1 min ago', batteryLevel: 76, trend: 'rising' },
  { id: 15, name: 'D4-Sensor-05', lat: 10.7512, lng: 106.7067, status: 'online', waterLevel: 42, district: 'District 4', ward: 'Ward 2', street: 'Trương Vĩnh Ký', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 2, lastUpdate: '2 min ago', batteryLevel: 82, trend: 'stable' },
  { id: 16, name: 'D4-Sensor-06', lat: 10.7678, lng: 106.7023, status: 'online', waterLevel: 36, district: 'District 4', ward: 'Ward 1', street: 'Lý Chính Thắng', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 1, lastUpdate: '3 min ago', batteryLevel: 88, trend: 'stable' },
  { id: 17, name: 'D4-Sensor-07', lat: 10.7534, lng: 106.7123, status: 'online', waterLevel: 40, district: 'District 4', ward: 'Ward 3', street: 'Hồ Hảo Hôn', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 1, lastUpdate: '2 min ago', batteryLevel: 83, trend: 'stable' },
  { id: 18, name: 'D4-Sensor-08', lat: 10.7601, lng: 106.6987, status: 'offline', waterLevel: 0, district: 'District 4', ward: 'Ward 2', street: 'Tôn Thất Tùng', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 0, lastUpdate: '2 hours ago', batteryLevel: 5, trend: 'stable' },
  { id: 19, name: 'D4-Sensor-09', lat: 10.7567, lng: 106.7156, status: 'online', waterLevel: 44, district: 'District 4', ward: 'Ward 3', street: 'Lương Định Của', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 2, lastUpdate: '1 min ago', batteryLevel: 85, trend: 'stable' },
  { id: 20, name: 'D4-Sensor-10', lat: 10.7623, lng: 106.7089, status: 'warning', waterLevel: 55, district: 'District 4', ward: 'Ward 1', street: 'Huỳnh Tấn Phát', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 4, lastUpdate: '2 min ago', batteryLevel: 80, trend: 'rising' },

  // District 7 (10 sensors)
  { id: 21, name: 'D7-Sensor-01', lat: 10.7356, lng: 106.7019, status: 'critical', waterLevel: 78, district: 'District 7', ward: 'Tân Phú', street: 'Huỳnh Tấn Phát', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 12, lastUpdate: '1 min ago', batteryLevel: 71, trend: 'rising' },
  { id: 22, name: 'D7-Sensor-02', lat: 10.7289, lng: 106.7234, status: 'warning', waterLevel: 68, district: 'District 7', ward: 'Tân Hưng', street: 'Nguyễn Duy Trinh', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 6, lastUpdate: '2 min ago', batteryLevel: 75, trend: 'rising' },
  { id: 23, name: 'D7-Sensor-03', lat: 10.7423, lng: 106.7156, status: 'online', waterLevel: 48, district: 'District 7', ward: 'Tây Thạnh', street: 'Cao Lỗ', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 2, lastUpdate: '3 min ago', batteryLevel: 87, trend: 'stable' },
  { id: 24, name: 'D7-Sensor-04', lat: 10.7312, lng: 106.6987, status: 'critical', waterLevel: 82, district: 'District 7', ward: 'Tân Phú', street: 'Nguyễn Thái Bình', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 10, lastUpdate: '1 min ago', batteryLevel: 68, trend: 'rising' },
  { id: 25, name: 'D7-Sensor-05', lat: 10.7456, lng: 106.7089, status: 'online', waterLevel: 41, district: 'District 7', ward: 'Tân Hưng', street: 'Lạc Long Quân', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 1, lastUpdate: '2 min ago', batteryLevel: 89, trend: 'stable' },
  { id: 26, name: 'D7-Sensor-06', lat: 10.7267, lng: 106.7123, status: 'warning', waterLevel: 65, district: 'District 7', ward: 'Tây Thạnh', street: 'Phạm Văn Đồng', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 5, lastUpdate: '2 min ago', batteryLevel: 77, trend: 'rising' },
  { id: 27, name: 'D7-Sensor-07', lat: 10.7389, lng: 106.7201, status: 'online', waterLevel: 39, district: 'District 7', ward: 'Tân Hưng', street: 'Tạ Quang Bửu', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '3 min ago', batteryLevel: 91, trend: 'stable' },
  { id: 28, name: 'D7-Sensor-08', lat: 10.7334, lng: 106.7045, status: 'offline', waterLevel: 0, district: 'District 7', ward: 'Tân Phú', street: 'Tạ Quang Bửu', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 0, lastUpdate: '30 min ago', batteryLevel: 8, trend: 'stable' },
  { id: 29, name: 'D7-Sensor-09', lat: 10.7401, lng: 106.6956, status: 'critical', waterLevel: 71, district: 'District 7', ward: 'Tây Thạnh', street: 'Trường Sơn', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 9, lastUpdate: '1 min ago', batteryLevel: 72, trend: 'rising' },
  { id: 30, name: 'D7-Sensor-10', lat: 10.7278, lng: 106.7178, status: 'warning', waterLevel: 59, district: 'District 7', ward: 'Tân Hưng', street: 'Hồ Học Lãm', rainIntensity: 'Heavy', tideLevel: 'High', reportsNearby: 4, lastUpdate: '2 min ago', batteryLevel: 78, trend: 'rising' },

  // Bình Thạnh (10 sensors)
  { id: 31, name: 'BT-Sensor-01', lat: 10.8123, lng: 106.7156, status: 'online', waterLevel: 34, district: 'Bình Thạnh', ward: 'Ward 1', street: 'Quốc Lộ 13', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 90, trend: 'stable' },
  { id: 32, name: 'BT-Sensor-02', lat: 10.8089, lng: 106.7234, status: 'online', waterLevel: 29, district: 'Bình Thạnh', ward: 'Ward 2', street: 'Lê Văn Sỹ', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '1 min ago', batteryLevel: 92, trend: 'stable' },
  { id: 33, name: 'BT-Sensor-03', lat: 10.8156, lng: 106.7089, status: 'warning', waterLevel: 54, district: 'Bình Thạnh', ward: 'Ward 3', street: 'Hoàng Hoa Thám', rainIntensity: 'Medium', tideLevel: 'Medium', reportsNearby: 3, lastUpdate: '2 min ago', batteryLevel: 81, trend: 'rising' },
  { id: 34, name: 'BT-Sensor-04', lat: 10.8045, lng: 106.7201, status: 'online', waterLevel: 37, district: 'Bình Thạnh', ward: 'Ward 1', street: 'Phan Xích Long', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 1, lastUpdate: '3 min ago', batteryLevel: 88, trend: 'stable' },
  { id: 35, name: 'BT-Sensor-05', lat: 10.8178, lng: 106.7123, status: 'online', waterLevel: 32, district: 'Bình Thạnh', ward: 'Ward 2', street: 'Ngô Tất Tố', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 89, trend: 'stable' },
  { id: 36, name: 'BT-Sensor-06', lat: 10.8067, lng: 106.7267, status: 'online', waterLevel: 31, district: 'Bình Thạnh', ward: 'Ward 3', street: 'Trần Não', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '1 min ago', batteryLevel: 91, trend: 'stable' },
  { id: 37, name: 'BT-Sensor-07', lat: 10.8134, lng: 106.7045, status: 'online', waterLevel: 35, district: 'Bình Thạnh', ward: 'Ward 1', street: 'Phan Văn Hân', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 1, lastUpdate: '2 min ago', batteryLevel: 87, trend: 'stable' },
  { id: 38, name: 'BT-Sensor-08', lat: 10.8001, lng: 106.7178, status: 'online', waterLevel: 30, district: 'Bình Thạnh', ward: 'Ward 2', street: 'Trường Chinh', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '3 min ago', batteryLevel: 86, trend: 'stable' },
  { id: 39, name: 'BT-Sensor-09', lat: 10.8178, lng: 106.7201, status: 'online', waterLevel: 33, district: 'Bình Thạnh', ward: 'Ward 3', street: 'Đinh Bộ Lĩnh', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '1 min ago', batteryLevel: 93, trend: 'stable' },
  { id: 40, name: 'BT-Sensor-10', lat: 10.8045, lng: 106.7123, status: 'online', waterLevel: 28, district: 'Bình Thạnh', ward: 'Ward 1', street: 'Tôn Đó', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 90, trend: 'stable' },

  // Thủ Đức (10 sensors)
  { id: 41, name: 'TD-Sensor-01', lat: 10.8456, lng: 106.7512, status: 'online', waterLevel: 26, district: 'Thủ Đức', ward: 'Ward 1', street: 'Võ Văn Ngân', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 91, trend: 'stable' },
  { id: 42, name: 'TD-Sensor-02', lat: 10.8401, lng: 106.7434, status: 'online', waterLevel: 30, district: 'Thủ Đức', ward: 'Ward 2', street: 'Quốc Lộ 1K', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '3 min ago', batteryLevel: 88, trend: 'stable' },
  { id: 43, name: 'TD-Sensor-03', lat: 10.8523, lng: 106.7389, status: 'online', waterLevel: 24, district: 'Thủ Đức', ward: 'Ward 1', street: 'Trần Não', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 92, trend: 'stable' },
  { id: 44, name: 'TD-Sensor-04', lat: 10.8334, lng: 106.7556, status: 'online', waterLevel: 28, district: 'Thủ Đức', ward: 'Ward 3', street: 'Vành Đai Trong', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '1 min ago', batteryLevel: 89, trend: 'stable' },
  { id: 45, name: 'TD-Sensor-05', lat: 10.8267, lng: 106.7478, status: 'online', waterLevel: 25, district: 'Thủ Đức', ward: 'Ward 2', street: 'Phan Van Tri', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 90, trend: 'stable' },
  { id: 46, name: 'TD-Sensor-06', lat: 10.8412, lng: 106.7623, status: 'online', waterLevel: 31, district: 'Thủ Đức', ward: 'Ward 3', street: 'Ngô Gia Tự', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 1, lastUpdate: '3 min ago', batteryLevel: 87, trend: 'stable' },
  { id: 47, name: 'TD-Sensor-07', lat: 10.8589, lng: 106.7401, status: 'online', waterLevel: 22, district: 'Thủ Đức', ward: 'Ward 1', street: 'Quốc Lộ 13', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 93, trend: 'stable' },
  { id: 48, name: 'TD-Sensor-08', lat: 10.8456, lng: 106.7334, status: 'offline', waterLevel: 0, district: 'Thủ Đức', ward: 'Ward 2', street: 'Lê Văn Việt', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '1 hour ago', batteryLevel: 3, trend: 'stable' },
  { id: 49, name: 'TD-Sensor-09', lat: 10.8523, lng: 106.7567, status: 'online', waterLevel: 27, district: 'Thủ Đức', ward: 'Ward 3', street: 'Lý Thái Tổ', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '1 min ago', batteryLevel: 89, trend: 'stable' },
  { id: 50, name: 'TD-Sensor-10', lat: 10.8278, lng: 106.7423, status: 'online', waterLevel: 29, district: 'Thủ Đức', ward: 'Ward 1', street: 'Trương Sơn', rainIntensity: 'Light', tideLevel: 'Low', reportsNearby: 0, lastUpdate: '2 min ago', batteryLevel: 91, trend: 'stable' }
]
