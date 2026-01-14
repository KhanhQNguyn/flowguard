"use client"

import { useApp } from "@/lib/app-context"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function MapSidebar() {
  const { mapLayers, toggleMapLayer, sensors } = useApp()

  return (
    <div className="w-80 border-r bg-white p-4 overflow-y-auto hidden lg:block">
      <h2 className="text-xl font-bold mb-4">Map Layers</h2>

      <Tabs defaultValue="layers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="heatmap">Risk Heatmap</Label>
            <Switch id="heatmap" checked={mapLayers.heatmap} onCheckedChange={() => toggleMapLayer("heatmap")} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sensors">Sensor Markers</Label>
            <Switch id="sensors" checked={mapLayers.sensors} onCheckedChange={() => toggleMapLayer("sensors")} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reports">Community Reports</Label>
            <Switch id="reports" checked={mapLayers.reports} onCheckedChange={() => toggleMapLayer("reports")} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="tide">Tide Prediction</Label>
            <Switch id="tide" checked={mapLayers.tide} onCheckedChange={() => toggleMapLayer("tide")} />
          </div>

          <hr className="my-4" />

          <div>
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span>LOW Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span>MEDIUM Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span>HIGH Risk</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sensors" className="mt-4 space-y-3">
          {sensors.map((sensor) => (
            <Card key={sensor.id} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{sensor.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    sensor.status === "critical"
                      ? "bg-red-100 text-red-700"
                      : sensor.status === "warning"
                        ? "bg-yellow-100 text-yellow-700"
                        : sensor.status === "offline"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                  }`}
                >
                  {sensor.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{sensor.waterLevel}cm</span>
                <div className="flex items-center gap-1">
                  {sensor.trend === "rising" && <TrendingUp className="w-3 h-3 text-red-500" />}
                  {sensor.trend === "falling" && <TrendingDown className="w-3 h-3 text-green-500" />}
                  {sensor.trend === "stable" && <Minus className="w-3 h-3 text-gray-400" />}
                  <span className="text-xs">{sensor.lastUpdate}</span>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
