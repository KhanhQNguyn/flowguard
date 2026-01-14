"use client"

import { useState, useRef } from "react"
import { Camera, X, ImageIcon } from "lucide-react"

interface PhotoUploadProps {
  onUpload: (files: File[]) => void
}

export function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).slice(0, 3 - previews.length)
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 3))
    onUpload(newFiles)
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Upload Photo/Video</label>

      {previews.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors"
        >
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Camera className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Tap to upload photo</p>
          <p className="text-xs text-muted-foreground">Max 3 images</p>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden animate-slide-up">
              <img src={preview || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePreview(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
          {previews.length < 3 && (
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors"
            >
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  )
}
