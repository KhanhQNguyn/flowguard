'use client'

import { CheckCircle, RotateCcw, AlertTriangle, Navigation, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useUser } from '@/lib/user-context'
import { EmptyState } from '@/components/empty-state'

export function TripHistory() {
  const { tripHistory } = useUser()

  const getOutcomeIcon = (outcome: 'safe' | 'detour' | 'flooded') => {
    switch (outcome) {
      case 'safe':
        return <CheckCircle className="w-4 h-4 text-[#289359]" />
      case 'detour':
        return <RotateCcw className="w-4 h-4 text-[#d1bb3a]" />
      case 'flooded':
        return <AlertTriangle className="w-4 h-4 text-[#e03a35]" />
    }
  }

  const getOutcomeLabel = (outcome: 'safe' | 'detour' | 'flooded') => {
    switch (outcome) {
      case 'safe':
        return 'Arrived safely'
      case 'detour':
        return 'Took detour'
      case 'flooded':
        return 'Encountered flood'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (tripHistory.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Trip History</h3>
        <EmptyState
          icon="map"
          title="No trips yet"
          description="Your trip history will appear here after you complete your first navigation."
        />
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Trip History</h3>
        <span className="text-sm text-neutral-500">{tripHistory.length} trips</span>
      </div>

      <div className="space-y-3">
        {tripHistory.slice(0, 5).map((trip) => (
          <div
            key={trip.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-neutral-200">
              <Navigation className="w-5 h-5 text-neutral-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{trip.destination}</p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                {getOutcomeIcon(trip.outcome)}
                <span>{getOutcomeLabel(trip.outcome)}</span>
              </div>
            </div>
            <div className="text-right">
              {trip.pointsEarned > 0 ? (
                <div className="flex items-center gap-1 text-[#a855f7]">
                  <Zap className="w-3 h-3" />
                  <span className="text-sm font-medium">+{trip.pointsEarned}</span>
                </div>
              ) : (
                <span className="text-xs text-neutral-400">No points</span>
              )}
              <p className="text-xs text-neutral-400 mt-0.5">{formatDate(trip.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
