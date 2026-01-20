'use client'

import { X, TrendingUp, Battery, Signal, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'

interface Sensor {
  id: number
  name: string
  waterLevel: number
  status: 'online' | 'warning' | 'critical' | 'offline'
  district: string
  lat: number
  lng: number
  street?: string
  ward?: string
  batteryLevel?: number
  rainIntensity?: string
  reportsNearby?: number
  trend?: 'rising' | 'stable' | 'falling'
}

interface SensorInfoPanelProps {
  sensor: Sensor | null
  onClose: () => void
  onRequestMaintenance: () => void
  onViewHistory: () => void
}

export function SensorInfoPanel({
  sensor,
  onClose,
  onRequestMaintenance,
  onViewHistory
}: SensorInfoPanelProps) {
  if (!sensor) return null

  // Generate mini trend data
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    time: i,
    level: sensor.waterLevel + Math.floor(Math.random() * 10 - 5)
  }))

  const statusColors = {
    online: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    offline: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
  }

  const colors = statusColors[sensor.status as keyof typeof statusColors]

  const getTrendIcon = () => {
    switch (sensor.trend) {
      case 'rising':
        return <TrendingUp className="w-5 h-5 text-red-600" />
      case 'falling':
        return <TrendingUp className="w-5 h-5 text-green-600 rotate-180" />
      default:
        return <TrendingUp className="w-5 h-5 text-yellow-600" />
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:right-4 md:left-auto md:w-96 z-50">
      <Card className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-4 ${colors.bg} border-b ${colors.border}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{sensor.name}</h3>
              <p className="text-sm text-gray-600">{sensor.district}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors.text} bg-white/70`}>
            {sensor.status.toUpperCase()}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Current Reading */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Current Reading</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Water Level</p>
                <p className="text-2xl font-bold text-blue-900">{sensor.waterLevel}cm</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-600 mb-1">Trend</p>
                <div className="flex items-center gap-2">
                  {getTrendIcon()}
                  <p className="text-lg font-bold text-purple-900">
                    {sensor.trend === 'rising' ? '+' : sensor.trend === 'falling' ? '-' : '±'}5cm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Trend Chart */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Last 2 Hours</h4>
            <div className="h-24 bg-gray-50 rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="level"
                    stroke="#289359"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Location Info */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Location</h4>
            <div className="text-sm space-y-1 text-gray-600">
              <p>{sensor.street || 'N/A'}</p>
              <p className="font-mono text-xs">
                {sensor.lat.toFixed(4)}, {sensor.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Device Status */}
          <div className="space-y-2">
            {sensor.batteryLevel !== undefined && (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium">Battery</span>
                </div>
                <span className="text-xs font-semibold">{sensor.batteryLevel}%</span>
              </div>
            )}
            {sensor.rainIntensity && (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium">Rain</span>
                </div>
                <span className="text-xs font-semibold">{sensor.rainIntensity}</span>
              </div>
            )}
            {sensor.reportsNearby !== undefined && (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Signal className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium">Reports</span>
                </div>
                <span className="text-xs font-semibold">{sensor.reportsNearby}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={onViewHistory}
              variant="outline"
              className="flex-1 text-sm bg-transparent"
            >
              View History
            </Button>
            <Button
              onClick={onRequestMaintenance}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-sm"
            >
              Request Maintenance
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
