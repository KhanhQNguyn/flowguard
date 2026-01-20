'use client'

import { AlertTriangle, CheckCircle, Zap, Lightbulb, X } from 'lucide-react'
import { generateExplanation } from '@/lib/ai-explainer'
import { RiskOutput } from '@/lib/flood-logic'
import { RouteRecommendation } from '@/lib/route-engine'

interface AIExplanationModalProps {
  open: boolean
  onClose: () => void
  type: 'risk' | 'route' | 'alert'
  risk?: 'LOW' | 'MEDIUM' | 'HIGH'
  reasoning?: string[]
  routeData?: RouteRecommendation
}

export function AIExplanationModal({
  open,
  onClose,
  type,
  risk,
  reasoning = [],
  routeData
}: AIExplanationModalProps) {
  if (!open) return null

  let explanation = ''
  if (type === 'risk' && risk) {
    const riskData: RiskOutput = { risk, reasoning, confidence: 85 }
    explanation = generateExplanation({ type: 'risk', data: riskData })
  } else if (type === 'route' && routeData) {
    explanation = generateExplanation({ type: 'route', data: routeData })
  }

  const getRiskIcon = () => {
    if (risk === 'HIGH') return <AlertTriangle className="w-6 h-6 text-[#e03a35]" />
    if (risk === 'MEDIUM') return <Zap className="w-6 h-6 text-[#d1bb3a]" />
    return <CheckCircle className="w-6 h-6 text-[#289359]" />
  }

  const getRiskColor = () => {
    if (risk === 'HIGH') return 'text-[#e03a35]'
    if (risk === 'MEDIUM') return 'text-[#d1bb3a]'
    return 'text-[#289359]'
  }

  const getRiskBg = () => {
    if (risk === 'HIGH') return 'bg-red-50'
    if (risk === 'MEDIUM') return 'bg-yellow-50'
    return 'bg-green-50'
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center modal-overlay">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 modal-center max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5 text-neutral-400" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Analysis</h3>
            <p className="text-sm text-neutral-500">Real-time data insight</p>
          </div>
        </div>

        <div className="space-y-4">
          {type === 'risk' && (
            <div className={`flex items-center gap-3 p-3 rounded-lg ${getRiskBg()}`}>
              {getRiskIcon()}
              <div>
                <span className={`font-medium capitalize ${getRiskColor()}`}>{risk?.toLowerCase()} Risk</span>
                <p className="text-sm text-neutral-500">Based on real-time data fusion</p>
              </div>
            </div>
          )}

          <div className="prose prose-sm">
            <p className="text-neutral-700 leading-relaxed">{explanation}</p>
          </div>

          {reasoning.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Contributing Factors
              </h4>
              <ul className="space-y-1.5">
                {reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-blue-600 mt-0.5">
                      {index + 1}
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm text-blue-900 leading-relaxed">
              Data sources: IoT sensors, weather data, tide levels, and citizen reports
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#289359] text-white rounded-xl font-medium hover:bg-[#1f6e43] transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
