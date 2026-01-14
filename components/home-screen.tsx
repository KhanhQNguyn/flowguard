"use client"

import { RiskStatusCard } from "@/components/risk-status-card"
import { LiveConditions } from "@/components/live-conditions"
import { PredictionChart } from "@/components/prediction-chart"
import { DistrictSummary } from "@/components/district-summary"
import { QuickActions } from "@/components/quick-actions"

export function HomeScreen() {
  return (
    <div className="p-4 pb-24 space-y-6 max-w-lg mx-auto animate-fade-in">
      <RiskStatusCard />
      <LiveConditions />
      <PredictionChart />
      <DistrictSummary />
      <QuickActions />
    </div>
  )
}
