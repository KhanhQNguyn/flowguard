'use client'

import { useState } from 'react'
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useUser } from '@/lib/user-context'

interface PostTripModalProps {
  open: boolean
  onClose: () => void
  destination: string
  onConfirm?: (outcome: 'safe' | 'detour' | 'flooded', result: { points: number; reason: string }) => void
}

export function PostTripModal({ open, onClose, destination, onConfirm }: PostTripModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<'safe' | 'detour' | 'flooded' | null>(null)
  const { completeTripAndReward } = useUser()

  if (!open) return null

  const options = [
    {
      id: 'safe' as const,
      icon: CheckCircle,
      iconColor: 'text-[#289359]',
      bgColor: 'bg-[#d1fae5]',
      borderColor: 'border-[#289359]/30',
      hoverBg: 'hover:bg-[#d1fae5]/80',
      title: 'Arrived Safely',
      description: 'Followed the route without any flooding issues'
    },
    {
      id: 'detour' as const,
      icon: AlertTriangle,
      iconColor: 'text-[#d1bb3a]',
      bgColor: 'bg-[#fef9c3]',
      borderColor: 'border-[#d1bb3a]/30',
      hoverBg: 'hover:bg-[#fef9c3]/80',
      title: 'Took Detour',
      description: 'Had to change route but reached destination'
    },
    {
      id: 'flooded' as const,
      icon: XCircle,
      iconColor: 'text-[#e03a35]',
      bgColor: 'bg-[#fee2e2]',
      borderColor: 'border-[#e03a35]/30',
      hoverBg: 'hover:bg-[#fee2e2]/80',
      title: 'Encountered Flooding',
      description: 'Route was flooded or blocked'
    }
  ]

  const handleConfirm = () => {
    if (selectedOutcome) {
      const result = completeTripAndReward(
        {
          distance: 2500,
          duration: 1200,
          outcome: selectedOutcome
        },
        destination
      )

      if (onConfirm) {
        onConfirm(selectedOutcome, result)
      }

      setSelectedOutcome(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedOutcome(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <Card className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto modal-content">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-neutral-500" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              How was your trip?
            </h2>
            <p className="text-sm text-neutral-600">
              Your feedback helps FlowGuard improve flood predictions
            </p>
            <div className="mt-3 px-4 py-2 bg-[#3b82f6]/10 rounded-lg">
              <p className="text-xs text-[#3b82f6]">
                To: <span className="font-semibold">{destination}</span>
              </p>
            </div>
          </div>

          {/* Feedback Options */}
          <div className="space-y-3 mb-6">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOutcome === option.id

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOutcome(option.id)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-150
                    ${option.bgColor} ${option.borderColor} ${option.hoverBg}
                    ${isSelected ? 'ring-2 ring-offset-2 ring-[#3b82f6] scale-[1.02]' : 'hover:scale-[1.01]'}
                    active:scale-[0.99]
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${option.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-neutral-900 mb-1">
                        {option.title}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {option.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-[#3b82f6] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            disabled={!selectedOutcome}
            className="w-full h-14 text-base font-semibold bg-[#289359] hover:bg-[#1f6e43] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </Button>

          {/* Skip Option */}
          <button
            onClick={handleClose}
            className="w-full mt-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </Card>
    </div>
  )
}
