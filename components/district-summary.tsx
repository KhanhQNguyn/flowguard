"use client"

import { ChevronRight } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

export function DistrictSummary() {
  const { districtStatus, setActiveTab } = useApp()

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">District Summary</h2>
      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
        {districtStatus.map((district, i) => (
          <button
            key={i}
            onClick={() => setActiveTab("map")}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  district.risk === "HIGH" && "bg-[#e03a35]",
                  district.risk === "MEDIUM" && "bg-[#d1bb3a]",
                  district.risk === "LOW" && "bg-[#289359]",
                )}
              />
              <span className="font-medium">{district.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-semibold",
                  district.risk === "HIGH" && "text-[#e03a35]",
                  district.risk === "MEDIUM" && "text-[#d1bb3a]",
                  district.risk === "LOW" && "text-[#289359]",
                )}
              >
                {district.risk}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
