'use client'

import React from "react"

import { Camera, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PhotoUploadProps {
  photo: string | null
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

export function PhotoUpload({ photo, onPhotoChange, onClear }: PhotoUploadProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-3">Upload Photo</h3>
      {!photo ? (
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPhotoChange}
            className="hidden"
          />
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-[#289359] transition-colors">
            <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700">Take a photo of the flooding</p>
            <p className="text-xs text-neutral-500 mt-1">or tap to upload from gallery</p>
          </div>
        </label>
      ) : (
        <div className="relative">
          <img
            src={photo || "/placeholder.svg"}
            alt="Flood report"
            className="w-full rounded-lg object-cover max-h-64"
          />
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  )
}
