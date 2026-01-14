"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"

const riskTrendData = [
  { day: "Mon", high: 2, medium: 5, low: 18 },
  { day: "Tue", high: 3, medium: 8, low: 14 },
  { day: "Wed", high: 1, medium: 4, low: 20 },
  { day: "Thu", high: 4, medium: 6, low: 15 },
  { day: "Fri", high: 2, medium: 7, low: 16 },
  { day: "Sat", high: 5, medium: 9, low: 11 },
  { day: "Sun", high: 3, medium: 5, low: 17 },
]

const districtData = [
  { name: "District 1", risk: 25 },
  { name: "District 4", risk: 55 },
  { name: "District 7", risk: 78 },
  { name: "Bình Thạnh", risk: 42 },
  { name: "Thủ Đức", risk: 35 },
]

const sensorUptimeData = [
  { name: "Nguyễn Hữu Cảnh", uptime: 99.2 },
  { name: "Võ Văn Kiệt", uptime: 98.5 },
  { name: "Huỳnh Tấn Phát", uptime: 97.8 },
  { name: "Cầu Kênh Tẻ", uptime: 99.5 },
  { name: "Cầu Phú Mỹ", uptime: 85.2 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Analytics</h1>
        <p className="text-gray-500 mt-1">Risk trends and system performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Active Sensors</p>
            <p className="text-3xl font-bold mt-2">47</p>
            <p className="text-xs text-green-600 mt-1">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Reports Today</p>
            <p className="text-3xl font-bold mt-2">23</p>
            <p className="text-xs text-gray-500 mt-1">87% verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Avg Response Time</p>
            <p className="text-3xl font-bold mt-2">4.2min</p>
            <p className="text-xs text-green-600 mt-1">-0.8min improved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Alerts Sent</p>
            <p className="text-3xl font-bold mt-2">156</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Level Trends (7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} name="HIGH" />
                <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} name="MEDIUM" />
                <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} name="LOW" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>District Risk Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="risk" radius={4}>
                    {districtData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.risk > 70 ? "#ef4444" : entry.risk > 50 ? "#eab308" : "#22c55e"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Uptime */}
        <Card>
          <CardHeader>
            <CardTitle>Sensor Uptime (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sensorUptimeData.map((sensor) => (
                <div key={sensor.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{sensor.name}</span>
                    <span className={sensor.uptime < 90 ? "text-red-600" : "text-green-600"}>{sensor.uptime}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sensor.uptime < 90 ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${sensor.uptime}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
