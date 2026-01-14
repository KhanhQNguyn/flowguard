"use client"

import { useApp } from "@/lib/app-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RotateCcw, Droplets, CloudRain, Waves, Users } from "lucide-react"
import type { RainIntensity, TideLevel } from "@/lib/flood-logic"

export function DemoControls() {
  const {
    showDemoControls,
    setShowDemoControls,
    rainIntensity,
    setRainIntensity,
    waterLevel,
    setWaterLevel,
    tideLevel,
    setTideLevel,
    citizenReports,
    setCitizenReports,
    currentRisk,
    resetToDefault,
  } = useApp()

  return (
    <Sheet open={showDemoControls} onOpenChange={setShowDemoControls}>
      <SheetContent className="w-[350px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Demo Controls
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                currentRisk === "HIGH"
                  ? "bg-red-100 text-red-700"
                  : currentRisk === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {currentRisk} RISK
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Rain Intensity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-500" />
              <Label className="font-medium">Rain Intensity</Label>
            </div>
            <RadioGroup
              value={rainIntensity}
              onValueChange={(v) => setRainIntensity(v as RainIntensity)}
              className="flex gap-2"
            >
              {(["Low", "Medium", "Heavy"] as RainIntensity[]).map((level) => (
                <div key={level} className="flex-1">
                  <RadioGroupItem value={level} id={`rain-${level}`} className="peer sr-only" />
                  <Label
                    htmlFor={`rain-${level}`}
                    className="flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary-green peer-data-[state=checked]:text-white peer-data-[state=checked]:border-primary-green hover:bg-gray-50"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Water Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <Label className="font-medium">Water Level</Label>
              </div>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{waterLevel} cm</span>
            </div>
            <div className="relative pt-2">
              <Slider value={[waterLevel]} onValueChange={([v]) => setWaterLevel(v)} min={0} max={100} step={5} />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span className="text-yellow-600">50</span>
                <span className="text-red-600">70</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Tide Level */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-500" />
              <Label className="font-medium">Tide Level</Label>
            </div>
            <RadioGroup value={tideLevel} onValueChange={(v) => setTideLevel(v as TideLevel)} className="flex gap-2">
              {(["Low", "Medium", "High"] as TideLevel[]).map((level) => (
                <div key={level} className="flex-1">
                  <RadioGroupItem value={level} id={`tide-${level}`} className="peer sr-only" />
                  <Label
                    htmlFor={`tide-${level}`}
                    className="flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary-green peer-data-[state=checked]:text-white peer-data-[state=checked]:border-primary-green hover:bg-gray-50"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Citizen Reports */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <Label className="font-medium">Citizen Reports</Label>
              </div>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{citizenReports}</span>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <Button
                  key={n}
                  variant={citizenReports === n ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCitizenReports(n)}
                  className={citizenReports === n ? "bg-primary-green hover:bg-primary-green/90" : ""}
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <Button variant="outline" className="w-full bg-transparent" onClick={resetToDefault}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
