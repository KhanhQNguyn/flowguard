'use client'

import { X, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'
import { usePartnership } from '@/lib/partnership-context'
import { Button } from '@/components/ui/button'

interface PartnerDetailModalProps {
  partnerId: string
  onClose: () => void
}

export function PartnerDetailModal({ partnerId, onClose }: PartnerDetailModalProps) {
  const { partners, redemptions } = usePartnership()
  
  const partner = partners.find(p => p.id === partnerId)
  const partnerRedemptions = redemptions.filter(r => r.partnerId === partnerId).slice(0, 10)

  if (!partner) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 modal-overlay" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl modal-content">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-600 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl font-bold">{partner.name.substring(0, 2)}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{partner.name}</h2>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <span>Contract since {new Date(partner.contractStartDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>{partner.commissionRate * 100}% commission</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <DollarSign className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-xl font-bold text-gray-900">{formatCurrency(partner.commissionEarned)}</p>
              <p className="text-xs text-gray-600">Commission Earned</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Users className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-xl font-bold text-gray-900">{partner.redemptionsThisMonth}</p>
              <p className="text-xs text-gray-600">Redemptions</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-xl font-bold text-gray-900">{formatCurrency(partner.revenueThisMonth)}</p>
              <p className="text-xs text-gray-600">Total Revenue</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <Calendar className="w-5 h-5 text-orange-600 mb-2" />
              <p className="text-xl font-bold text-gray-900">{partner.minimumVolume || 0}</p>
              <p className="text-xs text-gray-600">Min. Volume</p>
            </div>
          </div>

          {/* Voucher Tiers */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Voucher Tiers</h3>
            <div className="space-y-2">
              {partner.voucherTiers.map((tier) => (
                <div key={tier.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{formatCurrency(tier.vndValue)} Value</p>
                    <p className="text-sm text-gray-500">{tier.pointCost} FlowPoints</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(tier.commissionEarned)}</p>
                    <p className="text-xs text-gray-500">Commission/voucher</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Redemptions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Recent Redemptions</h3>
            {partnerRedemptions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No redemptions yet</p>
            ) : (
              <div className="space-y-2">
                {partnerRedemptions.map((redemption) => (
                  <div key={redemption.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{redemption.voucherCode}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(redemption.redeemedAt).toLocaleDateString()} • {redemption.userName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(redemption.vndValue)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        redemption.status === 'used' ? 'bg-green-100 text-green-700' :
                        redemption.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {redemption.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1 bg-transparent">
              Edit Partner
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent"
              onClick={() => {
                // Toggle partner status
                alert('Partner status would be toggled')
              }}
            >
              {partner.status === 'active' ? 'Pause Partner' : 'Activate Partner'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
