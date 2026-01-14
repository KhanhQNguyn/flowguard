"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { CloudRain, Droplets, Waves, Users } from "lucide-react"

export function LiveConditionsGrid() {
  const { rainIntensity, waterLevel, tideLevel, citizenReports } = useApp()

  const conditions = [
    {
      icon: CloudRain,
      label: "Rainfall",
      value: rainIntensity,
      color:
        rainIntensity === "Heavy" ? "text-red-600" : rainIntensity === "Medium" ? "text-yellow-600" : "text-green-600",
    },
    {
      icon: Droplets,
      label: "Water Level",
      value: `${waterLevel}cm`,
      color: waterLevel > 70 ? "text-red-600" : waterLevel > 50 ? "text-yellow-600" : "text-green-600",
    },
    {
      icon: Waves,
      label: "Tide Level",
      value: tideLevel,
      color: tideLevel === "High" ? "text-red-600" : tideLevel === "Medium" ? "text-yellow-600" : "text-green-600",
    },
    {
      icon: Users,
      label: "Reports",
      value: `${citizenReports} verified`,
      color: citizenReports >= 3 ? "text-yellow-600" : "text-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {conditions.map((condition) => (
        <Card key={condition.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <condition.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{condition.label}</p>
                <p className={`font-semibold ${condition.color}`}>{condition.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
