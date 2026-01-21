'use client'

import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface ReportSuccessCardProps {
  onDone?: () => void
}

export function ReportSuccessCard({ onDone }: ReportSuccessCardProps) {
  const router = useRouter()

  const handleDone = () => {
    if (onDone) {
      onDone()
    } else {
      router.push('/home')
    }
  }

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
          onClick={handleDone}
          className="w-full bg-[#289359] hover:bg-[#1f6e43]"
        >
          Done
        </Button>
      </Card>
    </div>
  )
}
