'use client'

import { AlertTriangle, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getActionRecommendation } from '@/lib/ai-explainer'

interface ActionGuidanceProps {
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
}

export function ActionGuidance({ risk }: ActionGuidanceProps) {
  const recommendation = getActionRecommendation(risk)

  const getIcon = () => {
    switch (recommendation.icon) {
      case 'alert-triangle':
        return <AlertTriangle className="w-5 h-5" />
      case 'alert-circle':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <CheckCircle className="w-5 h-5" />
    }
  }

  const getPriorityStyles = () => {
    switch (recommendation.priority) {
      case 'high':
        return {
          bg: 'bg-[#fee2e2]',
          text: 'text-[#991b1b]',
          border: 'border-[#e03a35]'
        }
      case 'medium':
        return {
          bg: 'bg-[#fef9c3]',
          text: 'text-[#854d0e]',
          border: 'border-[#d1bb3a]'
        }
      default:
        return {
          bg: 'bg-[#d1fae5]',
          text: 'text-[#065f46]',
          border: 'border-[#289359]'
        }
    }
  }

  const styles = getPriorityStyles()

  const tips = {
    HIGH: [
      'Stay indoors until conditions improve',
      'Avoid underground parking areas',
      'Keep emergency supplies ready'
    ],
    MEDIUM: [
      'Check your route before leaving',
      'Allow extra travel time',
      'Avoid low-lying streets if possible'
    ],
    LOW: [
      'Stay informed about weather updates',
      'Share reports if you see flooding',
      'Help neighbors who may need assistance'
    ]
  }

  return (
    <Card className="p-4 space-y-4">
      <div className={`flex items-start gap-3 p-3 rounded-lg ${styles.bg} ${styles.border} border`}>
        <div className={styles.text}>{getIcon()}</div>
        <div className="flex-1">
          <p className={`font-medium ${styles.text}`}>{recommendation.action}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-neutral-700">What you can do:</h3>
        <ul className="space-y-2">
          {tips[risk].map((tip, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-neutral-600">
              <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
