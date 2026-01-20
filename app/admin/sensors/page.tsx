'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TrendingUp, TrendingDown, Minus, HelpCircle, Users, X, AlertCircle } from 'lucide-react'

interface Sensor {
  id: number
  name: string
  lat: number
  lng: number
  status: 'online' | 'warning' | 'offline'
  waterLevel: number
  trend: 'rising' | 'stable' | 'falling'
  district: string
  ward: string
  street: string
  rainIntensity: 'Low' | 'Medium' | 'Heavy'
  tideLevel: 'Low' | 'Medium' | 'High'
  reportsNearby: number
  lastUpdate: string
  batteryLevel: number
}

export default function SensorNetworkPage() {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const sensors: Sensor[] = [
    {
      id: 1,
      name: 'FG-D7-001',
      lat: 10.736,
      lng: 106.702,
      status: 'warning',
      waterLevel: 68,
      trend: 'rising',
      district: 'District 7',
      ward: 'Tan Phu Ward',
      street: 'Huynh Tan Phat',
      rainIntensity: 'Heavy',
      tideLevel: 'High',
      reportsNearby: 5,
      lastUpdate: '2 min ago',
      batteryLevel: 85
    },
    {
      id: 2,
      name: 'FG-D7-002',
      lat: 10.738,
      lng: 106.705,
      status: 'online',
      waterLevel: 45,
      trend: 'stable',
      district: 'District 7',
      ward: 'Tan Phu Ward',
      street: 'Nguyen Thi Thap',
      rainIntensity: 'Medium',
      tideLevel: 'Medium',
      reportsNearby: 2,
      lastUpdate: '1 min ago',
      batteryLevel: 92
    },
    {
      id: 3,
      name: 'FG-D4-001',
      lat: 10.788,
      lng: 106.703,
      status: 'warning',
      waterLevel: 72,
      trend: 'rising',
      district: 'District 4',
      ward: 'Ward 1',
      street: 'Nguyen Huu Canh',
      rainIntensity: 'Heavy',
      tideLevel: 'High',
      reportsNearby: 7,
      lastUpdate: '3 min ago',
      batteryLevel: 78
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
      case 'warning':
        return <span className="inline-block w-3 h-3 rounded-full bg-yellow-500" />
      case 'offline':
        return <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
      default:
        return <span className="inline-block w-3 h-3 rounded-full bg-gray-300" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-red-600" />
      case 'stable':
        return <Minus className="w-4 h-4 text-yellow-600" />
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-green-600" />
      default:
        return <HelpCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const filteredSensors = sensors.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.street.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">Sensor Network</h1>
          <p className="text-sm md:text-base text-neutral-600">Monitor real-time IoT sensor status and water levels</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 md:mb-6">
          <Input
            placeholder="Search by sensor name, district, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Sensor Grid - Mobile: 1 col, Tablet: 2 col, Desktop: 3 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {filteredSensors.map((sensor) => (
            <Card
              key={sensor.id}
              className="p-4 md:p-6 cursor-pointer hover:shadow-lg transition-shadow active:shadow-md"
              onClick={() => setSelectedSensor(sensor)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 text-base md:text-lg">{sensor.name}</h3>
                  <p className="text-xs md:text-sm text-neutral-600">{sensor.district}</p>
                </div>
                {getStatusIcon(sensor.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs md:text-sm text-neutral-700">Water Level</span>
                  <span className="font-semibold flex items-center gap-1 text-sm md:text-base">
                    {getTrendIcon(sensor.trend)} {sensor.waterLevel}cm
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-xs md:text-sm text-neutral-700">Battery</span>
                  <span className="font-semibold text-sm md:text-base">{sensor.batteryLevel}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-xs md:text-sm text-neutral-700">Reports Nearby</span>
                  <span className="font-semibold flex items-center gap-1 text-sm md:text-base">
                    <Users className="w-4 h-4" /> {sensor.reportsNearby}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 text-center pt-2 border-t">
                  Updated {sensor.lastUpdate}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Sensor Detail - Mobile: Modal, Desktop: Card */}
        {selectedSensor && (
          <>
            {/* Mobile Modal Background */}
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSelectedSensor(null)}
            />

            {/* Detail Panel */}
            <Card className="fixed bottom-0 left-0 right-0 md:static z-50 md:z-auto md:mt-6 rounded-t-2xl md:rounded-2xl p-4 md:p-6 max-h-[80vh] md:max-h-none overflow-y-auto">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold flex-1">{selectedSensor.name} - Details</h2>
                <button
                  onClick={() => setSelectedSensor(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detail Grid - Fully responsive */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Status</p>
                  <p className="text-sm md:text-base font-semibold flex items-center gap-2">
                    {getStatusIcon(selectedSensor.status)}
                    <span className="uppercase">{selectedSensor.status}</span>
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">Water Level</p>
                  <p className="text-sm md:text-base font-semibold flex items-center gap-2">
                    {getTrendIcon(selectedSensor.trend)} {selectedSensor.waterLevel}cm
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-600 mb-1">Battery</p>
                  <p className="text-sm md:text-base font-semibold">{selectedSensor.batteryLevel}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg col-span-2 md:col-span-1">
                  <p className="text-xs text-purple-600 mb-1">Location</p>
                  <p className="text-sm font-semibold">{selectedSensor.street}</p>
                  <p className="text-xs text-neutral-600">{selectedSensor.ward}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-600 mb-1">Rain</p>
                  <p className="text-sm md:text-base font-semibold">{selectedSensor.rainIntensity}</p>
                </div>
                <div className="p-4 bg-cyan-50 rounded-lg">
                  <p className="text-xs text-cyan-600 mb-1">Tide Level</p>
                  <p className="text-sm md:text-base font-semibold">{selectedSensor.tideLevel}</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-lg">
                  <p className="text-xs text-rose-600 mb-1">Coordinates</p>
                  <p className="text-xs font-mono font-semibold">{selectedSensor.lat.toFixed(4)}</p>
                  <p className="text-xs font-mono font-semibold">{selectedSensor.lng.toFixed(4)}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600 mb-1">Nearby Reports</p>
                  <p className="text-sm md:text-base font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" /> {selectedSensor.reportsNearby}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Last Update</p>
                  <p className="text-sm md:text-base font-semibold">{selectedSensor.lastUpdate}</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
