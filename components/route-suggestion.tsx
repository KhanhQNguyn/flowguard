'use client'

import { useState } from 'react'
import { Clock, Shield, AlertTriangle, Info, Navigation, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIExplanationModal } from '@/components/ai-explanation-modal'
import { analyzeRoute, RouteRecommendation } from '@/lib/route-engine'

interface RouteSuggestionProps {
  destination: string
  onStartNavigation: () => void
}

export function RouteSuggestion({ destination, onStartNavigation }: RouteSuggestionProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  // Create mock risk data for route analysis
  const riskData = new Map<string, 'LOW' | 'MEDIUM' | 'HIGH'>([
    ['Huỳnh Tấn Phát', 'HIGH'],
    ['Nguyễn Văn Linh', 'LOW'],
    ['Võ Văn Kiệt', 'MEDIUM'],
    ['Nguyễn Hữu Cảnh', 'HIGH']
  ])

  const routeData: RouteRecommendation = analyzeRoute(
    { lat: 10.736, lng: 106.702, address: 'District 7', district: 'District 7' },
    { lat: 10.757, lng: 106.682, address: destination, district: 'District 1' },
    riskData
  )

  const getSafetyColor = (score: number) => {
    if (score >= 70) return 'text-[#289359]'
    if (score >= 40) return 'text-[#d1bb3a]'
    return 'text-[#e03a35]'
  }

  const getSafetyBg = (score: number) => {
    if (score >= 70) return 'bg-[#d1fae5]'
    if (score >= 40) return 'bg-[#fef9c3]'
    return 'bg-[#fee2e2]'
  }

  return (
    <>
      <div className="space-y-4">
        {/* Route Overview Card */}
        <Card className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Suggested Route</h3>
              <p className="text-sm text-neutral-500">To: {destination}</p>
            </div>
            <button
              onClick={() => setShowExplanation(true)}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              aria-label="View route analysis"
            >
              <Info className="w-5 h-5 text-[#3b82f6]" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-neutral-500" />
              <span className="font-medium">{routeData.estimatedTime} min</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getSafetyBg(routeData.safetyScore)}`}>
              <Shield className="w-4 h-4" />
              <span className={`font-medium ${getSafetyColor(routeData.safetyScore)}`}>
                {routeData.safetyScore}% Safe
              </span>
            </div>
          </div>

          {/* Route Waypoints */}
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-neutral-700">Route via:</p>
            <div className="flex flex-wrap gap-2">
              {routeData.waypoints.map((waypoint, index) => {
                const isAvoid = routeData.avoidStreets.includes(waypoint)
                return (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-sm ${
                      isAvoid
                        ? 'bg-[#fee2e2] text-[#991b1b] line-through'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {waypoint}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Avoid Streets Warning */}
          {routeData.avoidStreets.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#fee2e2] mb-4">
              <AlertTriangle className="w-5 h-5 text-[#e03a35] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#991b1b]">Streets to avoid:</p>
                <p className="text-sm text-[#991b1b]">{routeData.avoidStreets.join(', ')}</p>
              </div>
            </div>
          )}

          <p className="text-sm text-neutral-600 italic">{routeData.reasoning}</p>
        </Card>

        {/* Map Preview */}
        <Card className="overflow-hidden">
          <div className="h-48 bg-neutral-200 flex items-center justify-center">
            <div className="text-center p-4">
              <Navigation className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">Route preview</p>
              <p className="text-xs text-neutral-400">Opens in Google Maps</p>
            </div>
          </div>
        </Card>

        {/* Explain route button - inline */}
        <button
          onClick={() => setShowExplanation(true)}
          className="w-full p-3 bg-[#3b82f6]/10 rounded-lg text-left hover:bg-[#3b82f6]/20 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm text-[#3b82f6]">
            <Info className="w-4 h-4" />
            <span className="font-medium">Why this route?</span>
          </div>
        </button>

        {/* Spacer for fixed bottom buttons */}
        <div className="h-32" />
      </div>

      <AIExplanationModal
        open={showExplanation}
        onClose={() => setShowExplanation(false)}
        type="route"
        routeData={routeData}
      />
    </>
  )
}
