'use client'

import { Cloud, Droplets, Users, Waves } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface CurrentConditionsProps {
  rain: 'Low' | 'Medium' | 'Heavy'
  waterLevel: number
  reports: number
  tide?: 'Low' | 'Medium' | 'High'
}

export function CurrentConditions({ rain, waterLevel, reports, tide = 'Medium' }: CurrentConditionsProps) {
  const getWaterLevelColor = (level: number) => {
    if (level > 70) return 'text-[#e03a35]'
    if (level > 50) return 'text-[#d1bb3a]'
    return 'text-[#289359]'
  }

  const getRainColor = (intensity: string) => {
    if (intensity === 'Heavy') return 'text-[#e03a35]'
    if (intensity === 'Medium') return 'text-[#d1bb3a]'
    return 'text-[#289359]'
  }

  const conditions = [
    {
      icon: Cloud,
      label: 'Rainfall',
      value: rain,
      color: getRainColor(rain)
    },
    {
      icon: Droplets,
      label: 'Water Level',
      value: `${waterLevel}cm`,
      color: getWaterLevelColor(waterLevel)
    },
    {
      icon: Users,
      label: 'Reports',
      value: reports.toString(),
      color: reports >= 3 ? 'text-[#d1bb3a]' : 'text-[#289359]'
    },
    {
      icon: Waves,
      label: 'Tide',
      value: tide,
      color: tide === 'High' ? 'text-[#d1bb3a]' : 'text-[#289359]'
    }
  ]

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 text-neutral-900">Current Conditions</h3>
      <div className="grid grid-cols-4 gap-2">
        {conditions.map((condition) => {
          const Icon = condition.icon
          return (
            <div key={condition.label} className="text-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2">
                <Icon className={`w-5 h-5 ${condition.color}`} />
              </div>
              <p className={`text-sm font-semibold ${condition.color}`}>{condition.value}</p>
              <p className="text-xs text-neutral-500">{condition.label}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
