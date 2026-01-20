'use client'

import { Gift } from 'lucide-react'
import { PointsBalance } from '@/components/points-balance'
import { EarningRules } from '@/components/earning-rules'
import { RedemptionGrid } from '@/components/redemption-grid'
import { ActivitySummary } from '@/components/activity-summary'
import { PartnerVouchersGrid } from '@/components/partner-vouchers-grid'
import { useUser } from '@/lib/user-context'
import { PartnershipProvider } from '@/lib/partnership-context'

export default function RewardsPage() {
  const { userPoints, userTier } = useUser()

  return (
    <PartnershipProvider>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#a855f7] to-[#9333ea] p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-6 h-6" />
            <h1 className="text-2xl font-bold">FlowPoints</h1>
          </div>
          <p className="text-sm opacity-90">Rewards for safer travel</p>
        </div>

        <div className="p-4 space-y-4 -mt-2">
          <PointsBalance points={userPoints} tier={userTier} />
          <ActivitySummary />
          <PartnerVouchersGrid currentPoints={userPoints} />
          <EarningRules />
          <RedemptionGrid currentPoints={userPoints} />
        </div>
      </div>
    </PartnershipProvider>
  )
}
