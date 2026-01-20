'use client'

import { Flame, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useUser } from '@/lib/user-context'
import { useApp } from '@/lib/app-context'

export function UserInfoCard() {
  const { userName, userPoints, userTier, currentStreak } = useUser()
  const { currentDistrict } = useApp()

  const tierBadgeColors = {
    Bronze: 'bg-amber-100 text-amber-800 border-amber-300',
    Silver: 'bg-neutral-200 text-neutral-700 border-neutral-300',
    Gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Platinum: 'bg-purple-100 text-purple-800 border-purple-300'
  }

  const tierIcons = {
    Bronze: '🥉',
    Silver: '🥈',
    Gold: '🥇',
    Platinum: '💎'
  }

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#289359] to-[#1f6e43] flex items-center justify-center text-white text-2xl font-bold">
          {userName.charAt(0)}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{userName}</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
            <span>{currentDistrict}, HCMC</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="text-center p-3 rounded-lg bg-neutral-50">
          <div className="flex justify-center mb-1">
            <Zap className="w-5 h-5 text-[#a855f7]" />
          </div>
          <span className="font-semibold text-[#a855f7] text-sm">{userPoints}</span>
          <p className="text-xs text-neutral-500 mt-1">FlowPoints</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-neutral-50">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${tierBadgeColors[userTier]}`}>
            <span>{tierIcons[userTier]}</span>
            {userTier}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Tier</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-neutral-50">
          <div className="flex justify-center mb-1">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <span className="font-semibold text-orange-500 text-sm">{currentStreak}</span>
          <p className="text-xs text-neutral-500 mt-1">Day Streak</p>
        </div>
      </div>
    </Card>
  )
}
