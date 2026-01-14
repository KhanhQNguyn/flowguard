"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskStatusCard } from "@/components/risk-status-card"
import { LiveConditionsGrid } from "@/components/live-conditions-grid"
import { PredictionChart } from "@/components/prediction-chart"
import { RecentAlerts } from "@/components/recent-alerts"
import { QuickActions } from "@/components/quick-actions"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">{user?.district || "District 7"}, Ho Chi Minh City</p>
        </div>
        <Button variant="outline" size="sm">
          Change Location
        </Button>
      </div>

      {/* Risk Status - Hero Section */}
      <RiskStatusCard />

      {/* Live Conditions - 4 Column Grid */}
      <LiveConditionsGrid />

      {/* Prediction Chart */}
      <Card>
        <CardHeader>
          <CardTitle>60-Minute Forecast</CardTitle>
          <CardDescription>Expected water level based on current conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <PredictionChart />
        </CardContent>
      </Card>

      {/* Split Layout: Alerts + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAlerts />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
