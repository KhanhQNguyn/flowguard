'use client'

import { Navigation, Flame, Bell, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function EarningRules() {
  const rules = [
    {
      icon: Navigation,
      title: 'Complete Safe Trip',
      points: '+15',
      description: 'Arrive safely at destination',
      color: 'bg-[#289359]'
    },
    {
      icon: Flame,
      title: '7-Day Streak',
      points: '+50',
      description: 'Use FlowGuard 7 days in a row',
      color: 'bg-orange-500'
    },
    {
      icon: Bell,
      title: 'Daily Check-in',
      points: '+5',
      description: 'Open the app each day',
      color: 'bg-[#3b82f6]'
    },
    {
      icon: Users,
      title: 'Verified Report',
      points: '+10',
      description: 'Submit confirmed flood report',
      color: 'bg-[#a855f7]'
    }
  ]

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">How to Earn</h3>
      <div className="space-y-3">
        {rules.map((rule) => {
          const Icon = rule.icon
          return (
            <div key={rule.title} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${rule.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{rule.title}</p>
                  <span className="text-sm font-semibold text-[#a855f7]">{rule.points}</span>
                </div>
                <p className="text-xs text-neutral-500 truncate">{rule.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
