"use client"

import { CloudRain, Droplets, Users } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

export function LiveConditions() {
  const { rainIntensity, waterLevel, citizenReports } = useApp()

  const conditions = [
    {
      icon: CloudRain,
      label: "Rainfall",
      value: rainIntensity,
      color:
        rainIntensity === "Heavy" ? "text-[#e03a35]" : rainIntensity === "Medium" ? "text-[#d1bb3a]" : "text-[#289359]",
    },
    {
      icon: Droplets,
      label: "Water Level",
      value: `${waterLevel} cm`,
      color: waterLevel > 70 ? "text-[#e03a35]" : waterLevel > 50 ? "text-[#d1bb3a]" : "text-[#289359]",
    },
    {
      icon: Users,
      label: "Reports",
      value: `${citizenReports} New`,
      color: citizenReports >= 3 ? "text-[#d1bb3a]" : "text-muted-foreground",
    },
  ]

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Live Conditions</h2>
      <div className="grid grid-cols-3 gap-3">
        {conditions.map((cond, i) => {
          const Icon = cond.icon
          return (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 text-center transition-transform duration-150 hover:scale-[1.02] hover:shadow-md"
            >
              <Icon className={cn("w-6 h-6 mx-auto mb-2", cond.color)} />
              <p className={cn("font-bold text-lg", cond.color)}>{cond.value}</p>
              <p className="text-xs text-muted-foreground">{cond.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
