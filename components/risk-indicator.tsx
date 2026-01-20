'use client'

import { useState } from 'react'
import { Shield, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { AIExplanationModal } from '@/components/ai-explanation-modal'

interface RiskIndicatorProps {
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  reasoning: string[]
  district: string
}

export function RiskIndicator({ risk, reasoning, district }: RiskIndicatorProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  const styles = {
    LOW: {
      bg: 'bg-gradient-to-b from-[#d1fae5] to-[#a7f3d0]',
      border: 'border-[#289359]',
      text: 'text-[#065f46]',
      indicator: 'bg-[#289359]',
      label: 'SAFE TO TRAVEL'
    },
    MEDIUM: {
      bg: 'bg-gradient-to-b from-[#fef9c3] to-[#fde047]',
      border: 'border-[#d1bb3a]',
      text: 'text-[#854d0e]',
      indicator: 'bg-[#d1bb3a]',
      label: 'USE CAUTION'
    },
    HIGH: {
      bg: 'bg-gradient-to-b from-[#fee2e2] to-[#fecaca]',
      border: 'border-[#e03a35]',
      text: 'text-[#991b1b]',
      indicator: 'bg-[#e03a35]',
      label: 'FLOODING RISK'
    }
  }

  const current = styles[risk]

  return (
    <>
      <Card className={`${current.bg} ${current.border} border-2 p-8 relative overflow-hidden`}>
        <button
          onClick={() => setShowExplanation(true)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/80 transition-colors"
          aria-label="View AI analysis"
        >
          <Info className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/50">
            <div className={`w-16 h-16 rounded-full ${current.indicator} animate-pulse`} />
          </div>

          <div>
            <h2 className={`text-3xl font-bold ${current.text}`}>
              {current.label}
            </h2>
            <p className="text-sm mt-2 opacity-75">{district}, Ho Chi Minh City</p>
          </div>

          <div className="pt-4 border-t border-black/10">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span>Current conditions monitored</span>
            </div>
          </div>
        </div>
      </Card>

      <AIExplanationModal
        open={showExplanation}
        onClose={() => setShowExplanation(false)}
        type="risk"
        risk={risk}
        reasoning={reasoning}
      />
    </>
  )
}
