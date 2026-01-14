"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Camera, MapPin, Send, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react"

const STEPS = [
  { number: 1, title: "Upload Photo" },
  { number: 2, title: "Confirm Location" },
  { number: 3, title: "Review & Submit" },
]

export default function NewReportPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    photo: null as File | null,
    photoPreview: "",
    location: "Nguyễn Hữu Cảnh, District 4",
    notes: "",
    waterDepth: "Ankle-deep",
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/reports")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Report Flooding</h1>
        <p className="text-gray-500 mt-1">Help others by reporting flood conditions</p>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => (
            <div key={s.number} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= s.number ? "bg-primary-green text-white" : "bg-gray-200 text-gray-600"}
                `}
              >
                {step > s.number ? <CheckCircle className="w-5 h-5" /> : s.number}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${step >= s.number ? "text-gray-900" : "text-gray-500"}`}>
                {s.title}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-4 ${step > s.number ? "bg-primary-green" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(step / STEPS.length) * 100} className="h-2" />
      </Card>

      {/* Step 1: Upload Photo */}
      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Upload a Photo</h2>
              <p className="text-gray-500 text-sm">Take a photo of the flooded area</p>
            </div>

            <div
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary-green transition-colors
                ${formData.photoPreview ? "border-primary-green bg-green-50" : "border-gray-300"}
              `}
              onClick={() => document.getElementById("photo-input")?.click()}
            >
              {formData.photoPreview ? (
                <img
                  src={formData.photoPreview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
              ) : (
                <>
                  <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Click to upload or take a photo</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                </>
              )}
            </div>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.photoPreview}
                className="bg-primary-green hover:bg-primary-green/90"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Confirm Location */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Confirm Location</h2>
              <p className="text-gray-500 text-sm">Verify or adjust the detected location</p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Location detected</p>
                <p className="text-xs text-green-600">Using GPS coordinates</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depth">Water Depth</Label>
              <select
                id="depth"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.waterDepth}
                onChange={(e) => setFormData({ ...formData, waterDepth: e.target.value })}
              >
                <option>Minor ponding (&lt;10cm)</option>
                <option>Ankle-deep (10-20cm)</option>
                <option>Knee-deep (30-50cm)</option>
                <option>Waist-deep (&gt;50cm)</option>
              </select>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-primary-green hover:bg-primary-green/90">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Review & Submit</h2>
              <p className="text-gray-500 text-sm">Confirm your report details</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <img src={formData.photoPreview || "/placeholder.svg"} alt="Report" className="w-full rounded-lg" />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{formData.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Water Depth</p>
                  <p className="font-medium">{formData.waterDepth}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary-green hover:bg-primary-green/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
