'use client'

import { MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface LocationCardProps {
  location: string
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Card className="p-4 bg-[#d1fae5]/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#289359]/20 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-[#289359]" />
        </div>
        <div>
          <p className="text-xs text-neutral-600">Your Location</p>
          <p className="font-semibold text-neutral-900">{location}</p>
        </div>
      </div>
    </Card>
  )
}
