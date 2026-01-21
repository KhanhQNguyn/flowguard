'use client'

import { AlertTriangle, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MOCK_SENSORS } from '@/lib/mock-sensors'

export function AvoidList() {
  const highRiskAreas = MOCK_SENSORS.filter(s => s.waterLevel > 50 || s.status === 'warning')

  if (highRiskAreas.length === 0) {
    return null
  }

  return (
    <Card className="p-4 bg-[#fee2e2] border-[#e03a35]">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-[#e03a35]" />
        <h3 className="font-semibold text-[#991b1b]">Areas to Avoid</h3>
      </div>
      
      <div className="space-y-2">
        {highRiskAreas.map((area) => (
          <div
            key={area.id}
            className="flex items-center justify-between p-2 rounded-lg bg-white/80"
          >
            <div>
              <p className="font-medium text-sm text-[#991b1b]">{area.name}</p>
              <p className="text-xs text-neutral-600">{area.district}</p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-semibold text-[#e03a35]">{area.waterLevel}cm</span>
              {area.trend === 'rising' && (
                <TrendingUp className="w-4 h-4 text-[#e03a35]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
