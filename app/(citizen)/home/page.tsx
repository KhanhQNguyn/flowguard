'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, RefreshCw, Radio, CheckCircle, AlertCircle, Droplets, Users, Moon, Crown, X, ChevronRight } from 'lucide-react'
import { RiskIndicator } from '@/components/risk-indicator'
import { ActionGuidance } from '@/components/action-guidance'
import { DistrictPreview } from '@/components/district-preview'
import { ConditionCard } from '@/components/condition-card'
import { DistrictSelectorModal } from '@/components/district-selector-modal'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useApp } from '@/lib/app-context'
import { usePremium } from '@/lib/premium-context'
import { PremiumModal } from '@/components/premium-modal'

export default function HomePage() {
  const router = useRouter()
  const { currentDistrict, currentRisk, lastUpdated, refreshData, sensors } = useApp()
  const { isPremium } = usePremium()
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [dismissBanner, setDismissBanner] = useState(false)
  const [showDistrictSelector, setShowDistrictSelector] = useState(false)

  const currentSensor = sensors.find(s => s.district === currentDistrict)

  if (!currentRisk) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading flood data..." />
      </div>
    )
  }

  const getWaterLevelDisplay = (level: number) => {
    return `${level}cm`
  }

  const getReportsDisplay = (count: number) => {
    return count.toString()
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-36">
      {/* Location Header - Enhanced with District Selector */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-3">
        <button
          onClick={() => setShowDistrictSelector(true)}
          className="w-full flex items-start justify-between gap-3 hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
        >
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#289359]" />
              <p className="font-semibold text-neutral-900 text-sm truncate">
                {currentDistrict}, HCMC
              </p>
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-1" />
        </button>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-3">
        {/* Premium Banner */}
        {!isPremium && !dismissBanner && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-4 flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3 flex-1">
              <Crown className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Go Premium</p>
                <p className="text-xs opacity-90">Advanced routing, priority alerts & more</p>
              </div>
            </div>
            <button
              onClick={() => setDismissBanner(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Risk Indicator - Hero Element */}
        <RiskIndicator
          risk={currentRisk.risk}
          reasoning={currentRisk.reasoning}
          district={currentDistrict}
        />

        {/* Current Conditions - compact grid */}
        <div className="grid grid-cols-4 gap-2">
          <ConditionCard
            icon={Droplets}
            label="Rain"
            value={currentSensor?.rainIntensity || 'Medium'}
          />
          <ConditionCard
            icon={Droplets}
            label="Water"
            value={getWaterLevelDisplay(currentSensor?.waterLevel ?? 0)}
          />
          <ConditionCard
            icon={Users}
            label="Reports"
            value={getReportsDisplay(currentSensor?.reportsNearby || 0)}
          />
          <ConditionCard
            icon={Moon}
            label="Tide"
            value={currentSensor?.tideLevel || 'Medium'}
          />
        </div>

        {/* Action Guidance - condensed */}
        <ActionGuidance risk={currentRisk.risk} />

        {/* District Preview - compact */}
        <DistrictPreview />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <Radio className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-neutral-600 mb-0.5">Sensors</p>
            <p className="text-sm font-bold text-blue-600">3 active</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-xs text-neutral-600 mb-0.5">Safe Routes</p>
            <p className="text-sm font-bold text-green-600">2 found</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <AlertCircle className="w-5 h-5 mx-auto mb-1 text-red-600" />
            <p className="text-xs text-neutral-600 mb-0.5">Alerts</p>
            <p className="text-sm font-bold text-red-600">1 active</p>
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-white via-white to-transparent pt-6">
        <Button
          onClick={() => router.push('/navigate')}
          className="w-full h-14 text-base font-semibold bg-[#289359] hover:bg-[#1f6e43] shadow-lg"
        >
          Navigate Safely
        </Button>
      </div>

      {/* Modals */}
      <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <DistrictSelectorModal 
        open={showDistrictSelector} 
        onClose={() => setShowDistrictSelector(false)} 
      />
    </div>
  )
}
