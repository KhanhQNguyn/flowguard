'use client'

import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Sensor {
  id: number
  name: string
  waterLevel?: number
  district?: string
}

interface HistoryModalProps {
  sensor: Sensor | null
  open: boolean
  onClose: () => void
}

export function SensorHistoryModal({ sensor, open, onClose }: HistoryModalProps) {
  if (!open || !sensor) return null

  // Generate 24-hour mock data
  const historicalData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    waterLevel: Math.floor(Math.random() * 30) + (sensor.waterLevel || 40),
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString()
  }))

  const avgLevel = Math.round(historicalData.reduce((sum, d) => sum + d.waterLevel, 0) / historicalData.length)
  const maxLevel = Math.max(...historicalData.map(d => d.waterLevel))
  const minLevel = Math.min(...historicalData.map(d => d.waterLevel))

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-4xl bg-white rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">{sensor.name} - Historical Data</h2>
            <p className="text-sm text-gray-600">Last 24 hours</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 24-Hour Chart */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Water Level Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  label={{ value: 'Level (cm)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="waterLevel" 
                  stroke="#289359" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">Average</p>
            <p className="text-xl font-bold text-blue-900">{avgLevel}cm</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-red-600 mb-1">Peak</p>
            <p className="text-xl font-bold text-red-900">{maxLevel}cm</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Minimum</p>
            <p className="text-xl font-bold text-green-900">{minLevel}cm</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 mb-1">Variance</p>
            <p className="text-xl font-bold text-purple-900">±{Math.round((maxLevel - minLevel) / 2)}cm</p>
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Recent Events</h3>
          <div className="space-y-2">
            {[
              { time: '2 hours ago', event: 'Water level exceeded threshold', type: 'warning' },
              { time: '5 hours ago', event: 'Maintenance completed - battery replaced', type: 'success' },
              { time: '12 hours ago', event: 'Sensor reported offline for 15 minutes', type: 'error' },
              { time: '18 hours ago', event: 'Normal operation resumed', type: 'info' }
            ].map((event, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  event.type === 'warning' ? 'bg-yellow-500' :
                  event.type === 'success' ? 'bg-green-500' :
                  event.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.event}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
