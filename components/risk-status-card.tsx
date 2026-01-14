"use client"

import { useApp } from "@/lib/app-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, Clock, AlertTriangle } from "lucide-react"

export function RiskStatusCard() {
  const { currentRisk, waterLevel, timeToRisk, districtStatus } = useApp()
  const userDistrict = districtStatus.find((d) => d.name === "District 7") || districtStatus[0]

  const config = {
    LOW: {
      color: "bg-green-50 border-green-200",
      badge: "bg-green-100 text-green-800",
      icon: Shield,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    MEDIUM: {
      color: "bg-yellow-50 border-yellow-200",
      badge: "bg-yellow-100 text-yellow-800",
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    HIGH: {
      color: "bg-red-50 border-red-200",
      badge: "bg-red-100 text-red-800",
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
  }

  const { color, badge, icon: Icon, iconColor, iconBg } = config[currentRisk]

  return (
    <Card className={`${color} border-2 ${currentRisk === "HIGH" ? "animate-pulse-risk" : ""}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${iconBg}`}>
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Status</p>
              <h2 className="text-3xl font-bold mt-1">{currentRisk} RISK</h2>
              <p className="text-sm text-gray-600 mt-1">{userDistrict.name}</p>
            </div>
          </div>
          <Badge className={badge}>Live</Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Water Level:</span>
            <span className="font-semibold">{userDistrict.waterLevel}cm</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Updated:</span>
            <span className="font-semibold">2 min ago</span>
          </div>
        </div>

        {currentRisk !== "LOW" && timeToRisk > 0 && (
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm text-gray-700">
              Estimated <strong>{timeToRisk} minutes</strong> until water reaches 70cm threshold
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
