'use client'

import { useState } from 'react'
import { Zap, CheckCircle, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MOCK_PARTNERS } from '@/lib/mock-partners'
import { useUser } from '@/lib/user-context'

interface RedemptionGridProps {
  currentPoints: number
}

export function RedemptionGrid({ currentPoints }: RedemptionGridProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { redeemReward } = useUser()

  const handleRedemption = () => {
    const partner = MOCK_PARTNERS.find(p => p.id === selectedReward)
    if (partner && redeemReward(partner.pointCost)) {
      setShowConfirm(false)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedReward(null)
      }, 2000)
    }
  }

  const selectedPartner = MOCK_PARTNERS.find(p => p.id === selectedReward)

  return (
    <>
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Redeem Rewards</h3>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_PARTNERS.map((partner) => {
            const canAfford = currentPoints >= partner.pointCost
            return (
              <button
                key={partner.id}
                onClick={() => {
                  if (canAfford) {
                    setSelectedReward(partner.id)
                    setShowConfirm(true)
                  }
                }}
                disabled={!canAfford}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  canAfford
                    ? 'border-neutral-200 hover:border-[#a855f7] hover:shadow-md'
                    : 'border-neutral-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-3xl mb-2">{partner.logo}</div>
                <p className="font-medium text-sm">{partner.name}</p>
                <p className="text-xs text-neutral-500 mb-2 line-clamp-2">{partner.description}</p>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-[#a855f7]" />
                  <span className="text-sm font-semibold text-[#a855f7]">{partner.pointCost}</span>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Confirmation Modal */}
      {showConfirm && selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm modal-content">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="text-5xl mb-4">{selectedPartner.logo}</div>
              <h3 className="text-lg font-semibold mb-2">Redeem {selectedPartner.name}?</h3>
              <p className="text-sm text-neutral-500 mb-4">{selectedPartner.description}</p>

              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#a855f7]/10 rounded-lg mb-6">
                <Zap className="w-5 h-5 text-[#a855f7]" />
                <span className="font-semibold text-[#a855f7]">{selectedPartner.pointCost} points</span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRedemption}
                  className="flex-1 bg-[#a855f7] hover:bg-[#9333ea] text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center modal-center">
            <div className="w-16 h-16 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#289359]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Reward Redeemed!</h3>
            <p className="text-sm text-neutral-500">
              Your {selectedPartner.name} voucher has been sent to your account.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
