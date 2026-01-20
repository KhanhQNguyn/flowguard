'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, MapPin, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useUser } from '@/lib/user-context'

export default function ReportPage() {
  const router = useRouter()
  const { addFlowPoints } = useUser()
  const [photo, setPhoto] = useState<string | null>(null)
  const [location, setLocation] = useState('Detecting...')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simulate location detection
    const timer = setTimeout(() => {
      setLocation('District 7, Ho Chi Minh City')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhoto(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Award points for community contribution
    addFlowPoints(5, 'report_submitted')

    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#289359]" />
          </div>
          <h2 className="text-xl font-bold mb-2">Report Submitted!</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Thank you for helping the community stay safe
          </p>
          <div className="bg-[#a855f7]/10 rounded-lg p-4 mb-6">
            <p className="text-[#a855f7] font-semibold">+5 FlowPoints earned</p>
          </div>
          <Button
            onClick={() => router.push('/home')}
            className="w-full bg-[#289359] hover:bg-[#1f6e43]"
          >
            Done
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Report Flooding</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Photo Upload */}
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Upload Photo</h3>
          {!photo ? (
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-[#3b82f6] hover:bg-[#3b82f6]/5 cursor-pointer transition-colors">
                <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm text-neutral-600 mb-1">Tap to take photo</p>
                <p className="text-xs text-neutral-400">or upload from gallery</p>
              </div>
            </label>
          ) : (
            <div className="relative">
              <img src={photo || "/placeholder.svg"} alt="Flood report" className="w-full rounded-lg" />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
              >
                <span className="text-neutral-600">✕</span>
              </button>
            </div>
          )}
        </Card>

        {/* Auto-detected Location */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#3b82f6]" />
            <div>
              <p className="text-sm font-semibold">Location</p>
              <p className="text-xs text-neutral-600">{location}</p>
            </div>
          </div>
        </Card>

        {/* AI Analysis Preview (if photo uploaded) */}
        {photo && (
          <Card className="p-4 bg-[#3b82f6]/10 border-[#3b82f6]/20">
            <h4 className="font-semibold text-[#1e40af] text-sm mb-2">
              Analysis Preview
            </h4>
            <p className="text-xs text-[#3b82f6]">
              Estimated water depth: 10-15cm<br />
              Confidence: 85%
            </p>
          </Card>
        )}

        {/* Points info */}
        <Card className="p-4 bg-[#a855f7]/10 border-[#a855f7]/20">
          <p className="text-sm text-[#a855f7] text-center">
            Earn <span className="font-semibold">+5 FlowPoints</span> for verified reports
          </p>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-white via-white to-transparent pt-6">
        <Button
          onClick={handleSubmit}
          disabled={!photo || isSubmitting}
          className="w-full h-14 text-base font-semibold bg-[#289359] hover:bg-[#1f6e43] disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  )
}
