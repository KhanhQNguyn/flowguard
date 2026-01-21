'use client'

import { AlertCircle, Radio, Users, TrendingUp, MapPin, Clock, ArrowUp, ArrowDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { 
  cityOverview, 
  districtMetrics, 
  criticalAlerts, 
  sensorPerformance,
  userParticipation 
} from '@/lib/mock-admin-analytics'

export default function AdminDashboard() {
  // Color mappings - defined once for type safety
  const riskColorMap = {
    LOW: 'border-green-200 bg-green-50',
    MEDIUM: 'border-yellow-200 bg-yellow-50',
    HIGH: 'border-orange-200 bg-orange-50',
    CRITICAL: 'border-red-200 bg-red-50'
  } as const

  const riskIndicatorMap = {
    LOW: 'bg-green-500',
    MEDIUM: 'bg-yellow-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-red-500'
  } as const
  
  // Hero section - City-wide overview
  const overviewCards = [
    {
      icon: MapPin,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
      value: cityOverview.totalDistricts.toString(),
      label: 'Districts'
    },
    {
      icon: AlertCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-700',
      value: cityOverview.activeHighAlerts.toString(),
      label: 'Active Alerts'
    },
    {
      icon: Radio,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700',
      value: `${cityOverview.sensorHealth}%`,
      label: 'Sensor Health'
    },
    {
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
      value: (cityOverview.activeUsers / 1000).toFixed(1) + 'k',
      label: 'Active Users'
    }
  ]

  // Overall risk indicator
  const riskColors = {
    LOW: 'bg-green-100 text-green-900',
    MEDIUM: 'bg-yellow-100 text-yellow-900',
    HIGH: 'bg-orange-100 text-orange-900',
    CRITICAL: 'bg-red-100 text-red-900'
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header - Now with District Selection */}
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Operations Dashboard</h1>
            <p className="text-sm text-neutral-600 mt-1">City-wide flood monitoring overview</p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold text-sm md:text-base whitespace-nowrap ${riskColors[cityOverview.overallRisk as keyof typeof riskColors]}`}>
            {cityOverview.overallRisk}
          </div>
        </div>

        {/* District Selector - New Feature */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-3">Quick District Navigation</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {districtMetrics.map((district) => (
              <button
                key={district.id}
                className="p-3 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-left group"
              >
                <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600">{district.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {district.sensorsOnline}/{district.sensorsTotal} sensors
                </p>
                <div className={`mt-2 w-2 h-2 rounded-full ${
                  district.risk === 'LOW' ? 'bg-green-500' :
                  district.risk === 'MEDIUM' ? 'bg-yellow-500' :
                  district.risk === 'HIGH' ? 'bg-orange-500' :
                  'bg-red-500'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Hero KPI Cards - Mobile: 2x2, Tablet: 4 across */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {overviewCards.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={idx} className="p-4 md:p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`${item.iconBg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                </div>
                <p className="text-xs text-neutral-600 mb-1">{item.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-neutral-900">{item.value}</p>
              </Card>
            )
          })}
        </div>

        {/* District Risk Heatmap */}
        <Card className="p-4 md:p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">District Risk Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {districtMetrics.map((district) => {
              const riskColor = riskColorMap[district.risk as keyof typeof riskColorMap]
              const riskIndicator = riskIndicatorMap[district.risk as keyof typeof riskIndicatorMap]

              return (
                <Card key={district.id} className={`p-4 border-2 ${riskColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm md:text-base">{district.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${riskIndicator}`} />
                  </div>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Sensors Online:</span>
                      <span className="font-bold">{district.sensorsOnline}/{district.sensorsTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Active Alerts:</span>
                      <span className="font-bold text-red-700">{district.activeAlerts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Reports:</span>
                      <span className="font-bold">{district.userReports}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-neutral-600">Avg Water Level:</span>
                      <span className="font-bold">{district.avgWaterLevel}cm</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>

        {/* Critical Alerts Feed */}
        <Card className="p-4 md:p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Critical Alerts</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {criticalAlerts.length === 0 ? (
              <p className="text-center text-neutral-500 py-8">No critical alerts at this time</p>
            ) : (
              criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'HIGH'
                      ? 'border-red-500 bg-red-50'
                      : 'border-orange-500 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm md:text-base">{alert.location}</p>
                      <p className="text-xs text-neutral-600 mt-1">{alert.source}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-2xl font-bold ${
                        alert.severity === 'HIGH' ? 'text-red-700' : 'text-orange-700'
                      }`}>
                        {alert.waterLevel}cm
                      </div>
                      <span className="text-xs text-neutral-600">Water Level</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Sensor & User Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Sensor Network Performance */}
          <Card className="p-4 md:p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Sensor Network</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Online Status</span>
                  <span className="text-sm font-bold">{sensorPerformance.online}/{sensorPerformance.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(sensorPerformance.online / sensorPerformance.total) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-neutral-600">Avg Uptime</p>
                  <p className="text-lg font-bold">{sensorPerformance.averageUptime}%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-xs text-neutral-600">Data Quality</p>
                  <p className="text-lg font-bold">{sensorPerformance.dataQuality}%</p>
                </div>
              </div>
              {sensorPerformance.requiresMaintenance.length > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs font-semibold text-yellow-900 mb-2">Needs Maintenance</p>
                  <div className="text-xs text-yellow-800 space-y-1">
                    {sensorPerformance.requiresMaintenance.map((sensor, idx) => (
                      <p key={idx}>• {sensor}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* User Participation */}
          <Card className="p-4 md:p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Community Engagement</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-neutral-600">Reports Today</p>
                  <p className="text-lg font-bold">{userParticipation.confirmationsToday}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-neutral-600">Accuracy</p>
                  <p className="text-lg font-bold">{userParticipation.accuracyRate}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Top Districts by Activity</p>
                <div className="space-y-2">
                  {userParticipation.districtActivity.slice(0, 3).map((district, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span>{district.district}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{
                              width: `${(district.reports / Math.max(...userParticipation.districtActivity.map(d => d.reports))) * 100}%`
                            }}
                          />
                        </div>
                        <span className="font-bold w-8 text-right">{district.reports}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-neutral-600">FlowPoints Distributed</p>
                  <p className="text-lg font-bold">{userParticipation.flowPointsDistributed.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600">New Signups</p>
                  <p className="text-lg font-bold">{userParticipation.newSignups}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
