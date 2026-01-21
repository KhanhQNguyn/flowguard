'use client'

import { Star, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getTierProgress } from '@/lib/flowpoints-logic'

interface PointsBalanceProps {
  points: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
}

export function PointsBalance({ points, tier }: PointsBalanceProps) {
  const tierProgress = getTierProgress(points)

  const tierColors = {
    Bronze: 'text-amber-700',
    Silver: 'text-neutral-500',
    Gold: 'text-yellow-600',
    Platinum: 'text-purple-600'
  }

  const tierBadgeColors = {
    Bronze: 'bg-amber-100 text-amber-800',
    Silver: 'bg-neutral-200 text-neutral-700',
    Gold: 'bg-yellow-100 text-yellow-800',
    Platinum: 'bg-purple-100 text-purple-800'
  }

  return (
    <Card className="p-5 bg-white -mt-4 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-neutral-500 mb-1">Available Points</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#a855f7]">{points}</span>
            <Star className="w-6 h-6 text-[#a855f7]" />
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${tierBadgeColors[tier]}`}>
          {tier}
        </span>
      </div>

      {tier !== 'Platinum' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Progress to {tier === 'Bronze' ? 'Silver' : tier === 'Silver' ? 'Gold' : 'Platinum'}</span>
            <span className="flex items-center gap-1 text-[#a855f7]">
              <TrendingUp className="w-4 h-4" />
              {tierProgress.next - points} pts to go
            </span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#a855f7] to-[#9333ea] rounded-full transition-all duration-500"
              style={{ width: `${tierProgress.progress}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
