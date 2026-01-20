'use client'

import { useRouter } from 'next/navigation'
import { Gift, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface RewardSuccessModalProps {
  open: boolean
  onClose: () => void
  pointsEarned: number
  newBalance: number
  reason?: string
}

export function RewardSuccessModal({ open, onClose, pointsEarned, newBalance, reason }: RewardSuccessModalProps) {
  const router = useRouter()

  if (!open) return null

  const handleViewRewards = () => {
    onClose()
    router.push('/rewards')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <Card className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 modal-center">
        {/* Celebration Animation */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#289359] to-[#1f6e43] mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Trip Confirmed!
          </h2>

          <p className="text-sm text-neutral-600">
            {reason || 'Thank you for helping FlowGuard learn'}
          </p>
        </div>

        {/* Points Display */}
        <div className="bg-gradient-to-br from-[#a855f7]/10 to-[#a855f7]/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gift className="w-6 h-6 text-[#a855f7]" />
            <span className="text-4xl font-bold text-[#a855f7]">
              +{pointsEarned}
            </span>
          </div>
          <p className="text-center text-sm text-[#a855f7] font-medium">
            FlowPoints earned
          </p>
          <div className="mt-3 pt-3 border-t border-[#a855f7]/20">
            <p className="text-center text-xs text-[#a855f7]/80">
              New balance: <span className="font-semibold">{newBalance} points</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleViewRewards}
            className="w-full h-12 bg-[#a855f7] hover:bg-[#9333ea]"
          >
            View Rewards
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-12"
          >
            Done
          </Button>
        </div>
      </Card>
    </div>
  )
}
