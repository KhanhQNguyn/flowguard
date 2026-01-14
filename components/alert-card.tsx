"use client"

import { AlertTriangle, Radio, Cloud, Users, MapPin } from "lucide-react"
import type { AlertData } from "@/lib/flood-logic"
import { cn } from "@/lib/utils"
import { useState } from "react"

const typeIcons = {
  system: AlertTriangle,
  sensor: Radio,
  weather: Cloud,
  community: Users,
}

interface AlertCardProps {
  alert: AlertData
}

export function AlertCard({ alert }: AlertCardProps) {
  const [dismissed, setDismissed] = useState(false)
  const Icon = typeIcons[alert.type]

  if (dismissed) return null

  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-4 animate-slide-in-right transition-all duration-200",
        alert.severity === "HIGH" && "border-[#e03a35] border-l-4",
        alert.severity === "MEDIUM" && "border-[#d1bb3a] border-l-4",
        alert.severity === "LOW" && "border-[#289359] border-l-4",
        !alert.isRead && "shadow-md",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            alert.severity === "HIGH" && "bg-[#e03a35]/10",
            alert.severity === "MEDIUM" && "bg-[#d1bb3a]/10",
            alert.severity === "LOW" && "bg-[#289359]/10",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              alert.severity === "HIGH" && "text-[#e03a35]",
              alert.severity === "MEDIUM" && "text-[#d1bb3a]",
              alert.severity === "LOW" && "text-[#289359]",
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "text-xs font-bold uppercase px-2 py-0.5 rounded-full",
                alert.severity === "HIGH" && "bg-[#e03a35] text-white",
                alert.severity === "MEDIUM" && "bg-[#d1bb3a] text-[#0d2b1c]",
                alert.severity === "LOW" && "bg-[#289359] text-white",
              )}
            >
              {alert.severity}
            </span>
            {!alert.isRead && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
          </div>

          <h3 className="font-semibold text-sm">{alert.title}</h3>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            <span>{alert.location}</span>
          </div>

          <p className="text-sm text-muted-foreground mt-2">{alert.message}</p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">{alert.time}</span>
            <div className="flex gap-2">
              <button className="text-xs font-medium text-primary hover:underline">View on Map</button>
              <button
                onClick={() => setDismissed(true)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
