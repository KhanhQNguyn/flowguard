"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { AlertCard } from "@/components/alert-card"
import type { RiskLevel } from "@/lib/flood-logic"
import { cn } from "@/lib/utils"

export function AlertsScreen() {
  const { alerts } = useApp()
  const [filter, setFilter] = useState<RiskLevel | "ALL">("ALL")

  const filteredAlerts = filter === "ALL" ? alerts : alerts.filter((a) => a.severity === filter)

  const unreadCount = alerts.filter((a) => !a.isRead).length

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Alerts</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-[#e03a35] text-white text-xs font-bold rounded-full">{unreadCount}</span>
          )}
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((level) => {
          const count = level === "ALL" ? alerts.length : alerts.filter((a) => a.severity === level).length

          return (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                filter === level ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
                level === "HIGH" && filter !== level && "text-[#e03a35]",
                level === "MEDIUM" && filter !== level && "text-[#d1bb3a]",
                level === "LOW" && filter !== level && "text-[#289359]",
              )}
            >
              {level === "ALL" ? "All" : level} ({count})
            </button>
          )
        })}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No alerts for this filter</div>
        ) : (
          filteredAlerts.map((alert, i) => (
            <div key={alert.id} style={{ animationDelay: `${i * 50}ms` }}>
              <AlertCard alert={alert} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
