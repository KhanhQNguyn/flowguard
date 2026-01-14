"use client"

import { useState } from "react"
import { Layers, Navigation, X, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"
import { useApp } from "@/lib/app-context"
import type { SensorData } from "@/lib/flood-logic"
import { cn } from "@/lib/utils"

export function FloodMap() {
  const { mapLayers, toggleMapLayer, sensors, currentRisk } = useApp()
  const [showLayers, setShowLayers] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null)

  // Google Maps embed URL centered on District 7
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15678.0!2d106.7019!3d10.7356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2svn!4v1704067200000!5m2!1sen!2svn`

  return (
    <div className="relative h-[calc(100vh-8rem)] animate-fade-in">
      {/* Map Container */}
      <div className="absolute inset-0">
        <iframe
          src={mapUrl}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Heatmap Overlay */}
        {mapLayers.heatmap && (
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-500",
              currentRisk === "HIGH" && "bg-gradient-to-b from-[#e03a35]/30 via-[#d1bb3a]/20 to-transparent",
              currentRisk === "MEDIUM" && "bg-gradient-to-b from-[#d1bb3a]/25 via-[#289359]/15 to-transparent",
              currentRisk === "LOW" && "bg-gradient-to-b from-[#289359]/20 to-transparent",
            )}
          />
        )}

        {/* Sensor Markers Overlay */}
        {mapLayers.sensors && (
          <div className="absolute inset-0 pointer-events-none">
            {sensors.map((sensor, i) => (
              <button
                key={sensor.id}
                onClick={() => setSelectedSensor(sensor)}
                className={cn(
                  "absolute w-4 h-4 rounded-full pointer-events-auto transition-all duration-200 hover:scale-150",
                  sensor.status === "online" && "bg-[#289359] animate-pulse",
                  sensor.status === "warning" && "bg-[#d1bb3a] animate-pulse",
                  sensor.status === "critical" && "bg-[#e03a35] animate-pulse",
                  sensor.status === "offline" && "bg-gray-400",
                )}
                style={{
                  top: `${20 + i * 12}%`,
                  left: `${15 + i * 15}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Layer Control Button */}
      <button
        onClick={() => setShowLayers(!showLayers)}
        className="absolute top-4 right-4 w-10 h-10 bg-card shadow-lg rounded-lg flex items-center justify-center z-10 hover:bg-muted transition-colors"
      >
        <Layers className="w-5 h-5" />
      </button>

      {/* Layer Panel */}
      {showLayers && (
        <div className="absolute top-16 right-4 bg-card shadow-lg rounded-xl p-3 z-10 animate-slide-up min-w-[160px]">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Map Layers</p>
          {Object.entries(mapLayers).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 py-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleMapLayer(key as keyof typeof mapLayers)}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm capitalize">{key}</span>
            </label>
          ))}
        </div>
      )}

      {/* Locate Me Button */}
      <button className="absolute bottom-24 right-4 w-12 h-12 bg-primary text-primary-foreground shadow-lg rounded-full flex items-center justify-center z-10 hover:scale-105 transition-transform active:scale-95">
        <Navigation className="w-5 h-5" />
      </button>

      {/* Legend */}
      <div className="absolute bottom-24 left-4 bg-card/95 backdrop-blur shadow-lg rounded-xl p-3 z-10">
        <p className="text-xs font-semibold mb-2">Risk Level</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-[#289359]" />
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-[#d1bb3a]" />
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-[#e03a35]" />
            <span className="text-xs">High</span>
          </div>
        </div>
      </div>

      {/* Sensor Info Card */}
      {selectedSensor && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-card/95 backdrop-blur shadow-xl rounded-xl p-4 z-20 animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold">📍 {selectedSensor.name}</p>
              <p className="text-sm text-muted-foreground">Sensor #{selectedSensor.id}</p>
            </div>
            <button onClick={() => setSelectedSensor(null)} className="p-1 hover:bg-muted rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-muted-foreground">Water Level</p>
              <p
                className={cn(
                  "text-lg font-bold",
                  selectedSensor.waterLevel > 60
                    ? "text-[#e03a35]"
                    : selectedSensor.waterLevel > 40
                      ? "text-[#d1bb3a]"
                      : "text-[#289359]",
                )}
              >
                {selectedSensor.waterLevel} cm
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <div className="flex items-center gap-1">
                {selectedSensor.trend === "rising" && <TrendingUp className="w-4 h-4 text-[#e03a35]" />}
                {selectedSensor.trend === "falling" && <TrendingDown className="w-4 h-4 text-[#289359]" />}
                {selectedSensor.trend === "stable" && <Minus className="w-4 h-4 text-[#d1bb3a]" />}
                <span className="text-sm capitalize">{selectedSensor.trend}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Last update: {selectedSensor.lastUpdate}</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-1">
              View Details
            </button>
            <button className="py-2 px-3 bg-muted rounded-lg text-sm font-medium flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
