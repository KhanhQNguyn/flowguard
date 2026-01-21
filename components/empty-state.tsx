'use client'

import { MapPin } from 'lucide-react'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case 'map':
        return <MapPin className="w-8 h-8 text-neutral-400" />
      default:
        return <MapPin className="w-8 h-8 text-neutral-400" />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="font-semibold text-lg text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-[#289359] text-white rounded-lg text-sm font-medium hover:bg-[#1f6e43] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
