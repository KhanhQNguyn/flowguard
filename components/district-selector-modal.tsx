'use client'

import { useState } from 'react'
import { MapPin, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'

interface DistrictSelectorModalProps {
  open: boolean
  onClose: () => void
}

export function DistrictSelectorModal({ open, onClose }: DistrictSelectorModalProps) {
  const { districts, currentDistrict, setDistrict } = useApp()
  const [selectedDistrict, setSelectedDistrict] = useState(currentDistrict)

  const handleConfirm = () => {
    setDistrict(selectedDistrict)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-t-3xl md:rounded-2xl max-w-md w-full md:max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-[#289359] to-[#1f6e43] text-white p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5" />
            <h2 className="text-xl font-bold">Select Your District</h2>
          </div>
          <p className="text-sm opacity-90">Notifications and alerts will be tailored to your area</p>
        </div>

        {/* Districts List */}
        <div className="p-4 space-y-2">
          {districts.map((district) => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                selectedDistrict === district
                  ? 'border-[#289359] bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <p className="font-semibold text-gray-900">{district}</p>
                <p className="text-xs text-gray-500">Ho Chi Minh City</p>
              </div>
              {selectedDistrict === district && (
                <Check className="w-5 h-5 text-[#289359]" />
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button
            onClick={handleConfirm}
            className="w-full bg-[#289359] hover:bg-[#1f6e43] text-white"
          >
            Confirm District
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
