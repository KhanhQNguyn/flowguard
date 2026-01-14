"use client"

import { useState } from "react"
import { MapPin, Bot, CheckCircle, Loader2, Sparkles } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ReportScreen() {
  const [photos, setPhotos] = useState<File[]>([])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const hasLocation = photos.length > 0
  const hasAIVerification = photos.length > 0

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="p-4 pb-24 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 bg-[#289359]/10 rounded-full flex items-center justify-center mb-4 animate-slide-up">
          <CheckCircle className="w-10 h-10 text-[#289359]" />
        </div>
        <h2 className="text-xl font-bold mb-2">Report Submitted!</h2>
        <p className="text-muted-foreground text-center mb-6">
          Thank you for helping keep HCMC safe. Your report is being verified.
        </p>
        <Button onClick={() => setIsSubmitted(false)}>Submit Another Report</Button>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold mb-1">Report Flooding 📸</h1>
        <p className="text-sm text-muted-foreground">Help us track flood conditions in your area</p>
      </div>

      {/* Photo Upload */}
      <PhotoUpload onUpload={(files) => setPhotos((prev) => [...prev, ...files])} />

      {/* Location Detection */}
      <div
        className={cn(
          "p-4 rounded-xl border transition-all duration-300",
          hasLocation ? "bg-[#289359]/5 border-[#289359]" : "border-border bg-muted/30",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              hasLocation ? "bg-[#289359]/10" : "bg-muted",
            )}
          >
            <MapPin className={cn("w-5 h-5", hasLocation ? "text-[#289359]" : "text-muted-foreground")} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Location</p>
            {hasLocation ? (
              <p className="text-sm text-[#289359]">✅ Detected: Nguyễn Hữu Cảnh, District 4</p>
            ) : (
              <p className="text-sm text-muted-foreground">Upload a photo to detect location</p>
            )}
          </div>
        </div>
        {hasLocation && (
          <button className="mt-3 text-sm text-primary font-medium hover:underline">Adjust Location</button>
        )}
      </div>

      {/* AI Verification */}
      <div
        className={cn(
          "p-4 rounded-xl border transition-all duration-300",
          hasAIVerification ? "bg-blue-50 border-blue-200" : "border-border bg-muted/30",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              hasAIVerification ? "bg-blue-100" : "bg-muted",
            )}
          >
            <Bot className={cn("w-5 h-5", hasAIVerification ? "text-blue-600" : "text-muted-foreground")} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium flex items-center gap-1">
              AI Verification
              <Sparkles className="w-3 h-3 text-blue-500" />
            </p>
            {hasAIVerification ? (
              <div className="mt-1">
                <p className="text-sm">
                  Water depth: <span className="font-semibold">10–15cm</span>
                </p>
                <p className="text-sm text-muted-foreground">Confidence: 85%</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Upload a photo for AI analysis</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">📝 Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional details about the flooding..."
          className="w-full h-24 p-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={photos.length === 0 || isSubmitting}
        className="w-full h-12 text-base gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Submit Report
          </>
        )}
      </Button>
    </div>
  )
}
