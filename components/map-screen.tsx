"use client"

import { ArrowLeft } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { FloodMap } from "@/components/flood-map"

export function MapScreen() {
  const { setActiveTab } = useApp()

  return (
    <div className="h-full">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => setActiveTab("home")} className="p-1 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold">Map View</h1>
      </div>

      <FloodMap />
    </div>
  )
}
