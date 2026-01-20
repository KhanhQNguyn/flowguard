'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface District {
  id: string
  name: string
  nameVi: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  activeAlerts: number
  sensorCount: number
  population: number
}

export function DistrictPreview() {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/districts/summary')
        if (!response.ok) {
          throw new Error(`Failed to fetch districts: ${response.status}`)
        }
        const data = await response.json()
        setDistricts(data.districts || [])
      } catch (err) {
        console.error('[DistrictPreview] Error fetching districts:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDistricts()
  }, [])

  if (error) {
    console.warn('[DistrictPreview] Backend error:', error)
  }

  const highRiskDistricts = districts
    .filter(d => d.riskLevel === 'HIGH' || d.riskLevel === 'MEDIUM')
    .slice(0, 3)

  const getRiskBadge = (risk: 'LOW' | 'MEDIUM' | 'HIGH') => {
    const styles = {
      LOW: 'bg-[#d1fae5] text-[#065f46]',
      MEDIUM: 'bg-[#fef9c3] text-[#854d0e]',
      HIGH: 'bg-[#fee2e2] text-[#991b1b]'
    }
    return styles[risk]
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-900">Nearby Districts</h3>
        <button className="text-sm text-[#3b82f6] font-medium flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {highRiskDistricts.map((district) => (
          <div
            key={district.id}
            className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              {district.riskLevel === 'HIGH' && (
                <AlertTriangle className="w-4 h-4 text-[#e03a35]" />
              )}
              <div>
                <p className="font-medium text-sm">{district.name}</p>
                <p className="text-xs text-neutral-500">{district.activeAlerts} active alerts</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskBadge(district.riskLevel)}`}>
              {district.riskLevel}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
