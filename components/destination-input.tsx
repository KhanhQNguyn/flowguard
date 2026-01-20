'use client'

import { MapPin, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface DestinationInputProps {
  value: string
  onChange: (value: string) => void
}

export function DestinationInput({ value, onChange }: DestinationInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <MapPin className="w-5 h-5 text-[#289359]" />
      </div>
      <Input
        type="text"
        placeholder="Where are you going?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 h-12 text-base"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <Search className="w-5 h-5 text-neutral-400" />
      </div>
    </div>
  )
}
