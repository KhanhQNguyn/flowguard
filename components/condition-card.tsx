'use client'

import { ComponentType } from 'react'
import { type LucideIcon } from 'lucide-react'

interface ConditionCardProps {
  icon: LucideIcon
  label: string
  value: string
}

export function ConditionCard({ icon: Icon, label, value }: ConditionCardProps) {
  return (
    <div className="bg-white rounded-lg p-3 border border-neutral-100 text-center">
      <div className="flex justify-center mb-1">
        <Icon className="w-5 h-5 text-neutral-600" />
      </div>
      <div className="text-xs text-neutral-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-neutral-900">{value}</div>
    </div>
  )
}
