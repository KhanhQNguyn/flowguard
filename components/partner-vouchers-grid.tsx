'use client'

import { useState } from 'react'
import { Store, Gift, Info, X } from 'lucide-react'
import { usePartnership } from '@/lib/partnership-context'
import { useUser } from '@/lib/user-context'
import { Button } from '@/components/ui/button'

interface PartnerVouchersGridProps {
  currentPoints: number
}

export function PartnerVouchersGrid({ currentPoints }: PartnerVouchersGridProps) {
  const { partners, addRedemption, generateVoucherCode } = usePartnership()
  const { redeemReward } = useUser()
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [redeemedVoucher, setRedeemedVoucher] = useState<{ code: string; partner: string } | null>(null)

  const activePartners = partners.filter(p => p.status === 'active')

  const handleRedeemVoucher = (partnerId: string, tierId: string, pointCost: number) => {
    const partner = partners.find(p => p.id === partnerId)
    const tier = partner?.voucherTiers.find(t => t.id === tierId)
    
    if (!partner || !tier || currentPoints < pointCost) {
      console.log('[v0] Cannot redeem: insufficient points or invalid data')
      return
    }

    // Deduct points
    const success = redeemReward(pointCost)
    if (!success) {
      console.log('[v0] Point redemption failed')
      return
    }

    const voucherCode = generateVoucherCode(partnerId)

    // Record the redemption
    addRedemption({
      userId: 'current_user',
      userName: 'You',
      partnerId: partner.id,
      partnerName: partner.name,
      voucherCode,
      pointsSpent: pointCost,
      vndValue: tier.vndValue,
      commissionEarned: tier.commissionEarned,
      usedAt: null,
      status: 'pending'
    })

    setRedeemedVoucher({ code: voucherCode, partner: partner.name })
    setSelectedPartner(null)
    setSelectedTier(null)
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">Partner Vouchers</h2>
          </div>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            {activePartners.length} partners
          </span>
        </div>

        {activePartners.length === 0 ? (
          <div className="text-center py-8">
            <Store className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No active partners yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {activePartners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner(partner.id)}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-full h-12 bg-white rounded-lg mb-2 flex items-center justify-center border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 text-center px-1">{partner.name}</span>
                </div>
                <h3 className="font-medium text-sm text-gray-900 mb-1">{partner.name}</h3>
                <p className="text-xs text-gray-500">
                  From {partner.voucherTiers[0]?.pointCost} pts
                </p>
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Powered by partnerships - supporting local businesses
        </p>
      </div>

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="fixed inset-0 bg-black/50 modal-overlay" onClick={() => setSelectedPartner(null)} />
          
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl modal-content">
            {(() => {
              const partner = partners.find(p => p.id === selectedPartner)
              if (!partner) return null

              return (
                <>
                  {/* Header */}
                  <div className="sticky top-0 bg-gradient-to-br from-purple-100 to-blue-100 p-6 border-b border-purple-200">
                    <button
                      onClick={() => setSelectedPartner(null)}
                      className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-gray-600 text-center px-2">{partner.name}</span>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-1 text-gray-900">{partner.name}</h2>
                    <p className="text-sm text-gray-600 text-center">Choose your voucher</p>
                  </div>

                  {/* Voucher Tiers */}
                  <div className="p-6 space-y-3">
                    {partner.voucherTiers.map((tier) => {
                      const canAfford = currentPoints >= tier.pointCost
                      return (
                        <div
                          key={tier.id}
                          className={`border-2 rounded-xl p-4 transition-all ${
                            canAfford ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {(tier.vndValue / 1000).toFixed(0)}K VND
                              </p>
                              <p className="text-sm text-gray-500">Voucher value</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-purple-600">{tier.pointCost}</p>
                              <p className="text-xs text-gray-500">points</p>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleRedeemVoucher(partner.id, tier.id, tier.pointCost)}
                            disabled={!canAfford}
                            className={`w-full ${
                              canAfford
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? 'Redeem Now' : `Need ${tier.pointCost - currentPoints} more points`}
                          </Button>
                        </div>
                      )
                    })}

                    <button
                      onClick={() => setSelectedPartner(null)}
                      className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Redemption Success Modal */}
      {redeemedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setRedeemedVoucher(null)} />
          
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full modal-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2 text-gray-900">Voucher Redeemed!</h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Your {redeemedVoucher.partner} voucher code:
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-4 text-center">
              <p className="text-center font-mono text-lg font-bold text-purple-600">
                {redeemedVoucher.code}
              </p>
              <p className="text-xs text-gray-500 mt-2">Tap to copy</p>
            </div>
            
            <p className="text-xs text-gray-500 text-center mb-4">
              Use this code at checkout or show it at the store
            </p>
            
            <Button
              onClick={() => setRedeemedVoucher(null)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
