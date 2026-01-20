'use client'

import { Flame, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useUser } from '@/lib/user-context'

export function ActivitySummary() {
  const { currentStreak, dailyPoints } = useUser()

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak} days`,
      color: 'text-orange-500',
      bg: 'bg-orange-100'
    },
    {
      icon: Calendar,
      label: 'Earned Today',
      value: `${dailyPoints} pts`,
      color: 'text-[#a855f7]',
      bg: 'bg-[#a855f7]/10'
    }
  ]

  const dailyLimit = 100
  const dailyProgress = (dailyPoints / dailyLimit) * 100

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Your Activity</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`p-3 rounded-xl ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-neutral-600">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Daily earning limit</span>
          <span className="text-neutral-700">{dailyPoints}/{dailyLimit} pts</span>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#a855f7] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(dailyProgress, 100)}%` }}
          />
        </div>
        {dailyPoints >= dailyLimit && (
          <p className="text-xs text-[#d1bb3a]">Daily limit reached! Come back tomorrow.</p>
        )}
      </div>
    </Card>
  )
}
