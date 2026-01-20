'use client'

import { useState } from 'react'
import { Handshake, TrendingUp, DollarSign, Users, Calendar, MoreVertical } from 'lucide-react'
import { PartnershipProvider, usePartnership } from '@/lib/partnership-context'
import { Button } from '@/components/ui/button'
import { PartnerDetailModal } from '@/components/partnership-detail-modal'

function PartnershipsContent() {
  const { partners, analytics } = usePartnership()
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'paused':
        return 'bg-yellow-100 text-yellow-700'
      case 'pending':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Handshake className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold">Partnership Management</h1>
          </div>
          <p className="text-gray-600">Track commission and manage FlowPoints partnerships</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalCommissionEarned)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Commission</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{partners.filter(p => p.status === 'active').length}</p>
            <p className="text-xs text-gray-500 mt-1">Active Partners</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-xs text-gray-500">Conversion</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{(analytics.conversionRate * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">Redemption Rate</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="text-xs text-gray-500">Average</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageVoucherValue)}</p>
            <p className="text-xs text-gray-500 mt-1">Voucher Value</p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Top Performing Partners</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {analytics.topPartners.map((partner, index) => (
              <div key={partner.partnerId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{partner.name}</p>
                    <p className="text-xs text-gray-500">{partner.redemptions} redemptions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(partner.revenue)}</p>
                  <p className="text-xs text-green-600">
                    {formatCurrency(partner.revenue * (partners.find(p => p.id === partner.partnerId)?.commissionRate || 0))} commission
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Partners */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">All Partners ({partners.length})</h2>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Add New Partner
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Redemptions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Earned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-400">{partner.name.substring(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{partner.name}</p>
                          <p className="text-xs text-gray-500">Since {new Date(partner.contractStartDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {(partner.commissionRate * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {partner.redemptionsThisMonth}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {formatCurrency(partner.revenueThisMonth)}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                      {formatCurrency(partner.commissionEarned)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(partner.status)}`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPartnerId(partner.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Partner Detail Modal */}
      {selectedPartnerId && (
        <PartnerDetailModal
          partnerId={selectedPartnerId}
          onClose={() => setSelectedPartnerId(null)}
        />
      )}
    </>
  )
}

export default function PartnershipsPage() {
  return (
    <PartnershipProvider>
      <PartnershipsContent />
    </PartnershipProvider>
  )
}
