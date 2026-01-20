'use client'

import { AlertTriangle, Target, Users, Activity, BarChart3, Settings, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function AnalyticsPage() {
  const analyticsData = {
    alerts: {
      thisWeek: 24,
      lastWeek: 18,
      change: '+33%'
    },
    predictions: {
      accuracy: '87%',
      processed: 1249,
      avgTime: '4.2s'
    },
    engagement: {
      reports: 156,
      reports_verified: 143,
      users_active: 892,
      avg_response_time: '3.2 min'
    },
    performance: {
      uptime: '99.8%',
      avg_latency: '120ms',
      data_points: '2.4M',
      processing_rate: '15k/min'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1 sm:mb-2">Analytics Dashboard</h1>
          <p className="text-sm sm:text-base text-neutral-600">System performance and flood prediction metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="p-3 sm:p-4">
            <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" /> Alerts This Week
            </p>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <p className="text-xl sm:text-2xl font-bold">{analyticsData.alerts.thisWeek}</p>
              <p className="text-xs sm:text-sm text-red-600">{analyticsData.alerts.change}</p>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" /> Accuracy
            </p>
            <p className="text-xl sm:text-2xl font-bold">{analyticsData.predictions.accuracy}</p>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{analyticsData.predictions.processed} predictions</p>
          </Card>

          <Card className="p-3 sm:p-4">
            <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" /> Active Users
            </p>
            <p className="text-xl sm:text-2xl font-bold">{analyticsData.engagement.users_active}</p>
            <p className="text-xs text-neutral-400 mt-1">This week</p>
          </Card>

          <Card className="p-3 sm:p-4">
            <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> Uptime
            </p>
            <p className="text-xl sm:text-2xl font-bold">{analyticsData.performance.uptime}</p>
            <p className="text-xs text-neutral-400 mt-1">Last 30 days</p>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4 mb-4 sm:mb-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /> Reports
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Submitted</span>
                <span className="font-semibold">{analyticsData.engagement.reports}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Verified</span>
                <span className="font-semibold text-green-600">{analyticsData.engagement.reports_verified}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Verification</span>
                <span className="font-semibold">
                  {((analyticsData.engagement.reports_verified / analyticsData.engagement.reports) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Response</span>
                <span className="font-semibold">{analyticsData.engagement.avg_response_time}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" /> Performance
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Latency</span>
                <span className="font-semibold">{analyticsData.performance.avg_latency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Data Points</span>
                <span className="font-semibold">{analyticsData.performance.data_points}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Rate</span>
                <span className="font-semibold">{analyticsData.performance.processing_rate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Pred Time</span>
                <span className="font-semibold">{analyticsData.predictions.avgTime}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Hourly Activity */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> Activity Timeline
          </h3>
          <div className="space-y-1 sm:space-y-2 text-sm">
            {[12, 18, 24, 28, 32, 28, 24, 18, 12, 8, 14, 20].map((value, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs text-neutral-500 w-8 sm:w-12 text-right flex-shrink-0">
                  {(idx + 9) % 24}h
                </span>
                <div className="flex-1 h-4 sm:h-6 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(value / 32) * 100}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-600 w-6 sm:w-12 text-right flex-shrink-0">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
