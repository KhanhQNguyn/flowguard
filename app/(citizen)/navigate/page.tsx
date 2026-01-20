'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Home, Building2, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DestinationInput } from '@/components/destination-input'
import { RouteSuggestion } from '@/components/route-suggestion'
import { PostTripModal } from '@/components/post-trip-modal'
import { RewardSuccessModal } from '@/components/reward-success-modal'
import { AvoidList } from '@/components/avoid-list'
import { useUser } from '@/lib/user-context'

// Helper function to find nearest district
function getNearestDistrict(latitude: number, longitude: number): string {
  const districts = [
    { name: 'District 1', lat: 10.757, lng: 106.682 },
    { name: 'District 3', lat: 10.795, lng: 106.673 },
    { name: 'District 4', lat: 10.788, lng: 106.703 },
    { name: 'District 7', lat: 10.7356, lng: 106.7019 },
    { name: 'Phú Nhuận', lat: 10.798, lng: 106.686 }
  ]

  let nearestDistrict = districts[0]
  let minDistance = Infinity

  districts.forEach(district => {
    const dx = Math.abs(latitude - district.lat)
    const dy = Math.abs(longitude - district.lng)
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < minDistance) {
      minDistance = distance
      nearestDistrict = district
    }
  })

  return nearestDistrict.name
}

export default function NavigatePage() {
  const router = useRouter()
  const { flowPoints } = useUser()
  const [destination, setDestination] = useState('')
  const [showRoute, setShowRoute] = useState(false)
  const [showPostTrip, setShowPostTrip] = useState(false)
  const [showRewardSuccess, setShowRewardSuccess] = useState(false)
  const [tripStarted, setTripStarted] = useState(false)
  const [rewardData, setRewardData] = useState<{ points: number; reason: string } | null>(null)
  const [currentLocation, setCurrentLocation] = useState('Detecting...')
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  const handleFindRoute = () => {
    if (destination) {
      setShowRoute(true)
    }
  }

  const handleStartNavigation = () => {
    // Open Google Maps with user's current location as origin and destination
    const encodedDestination = encodeURIComponent(destination + ', Ho Chi Minh City, Vietnam')
    
    // Use detected coordinates if available, otherwise use fallback
    const originParam = coordinates 
      ? `&origin=${coordinates.lat},${coordinates.lng}`
      : '&origin=10.7356,106.7019' // District 7 fallback
    
    const mapsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${encodedDestination}`
    console.log(`[FlowGuard] Opening Google Maps:`, mapsUrl)
    window.open(mapsUrl, '_blank')
    setTripStarted(true)
  }

  // Detect when user returns to app after navigation
  useEffect(() => {
    if (!tripStarted) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && tripStarted) {
        // User returned to app - show feedback modal after short delay
        setTimeout(() => {
          setShowPostTrip(true)
        }, 800)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [tripStarted])

  const handleTripConfirm = (outcome: 'safe' | 'detour' | 'flooded', result: { points: number; reason: string }) => {
    setTripStarted(false)

    if (result.points > 0) {
      setRewardData(result)
      // Show reward modal after a short delay
      setTimeout(() => {
        setShowRewardSuccess(true)
      }, 300)
    }
  }

  const handleManualArrival = () => {
    setShowPostTrip(true)
  }

  // Detect user location on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported')
      setCurrentLocation('District 7, HCMC')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const district = getNearestDistrict(latitude, longitude)
        setCoordinates({ lat: latitude, lng: longitude })
        setCurrentLocation(`${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`)
        setLocationError(null)
        console.log(`[FlowGuard] Location detected: ${district} at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      },
      (error) => {
        console.warn('[FlowGuard] Location detection failed:', error.message)
        setLocationError(error.message)
        // Fallback to default
        setCurrentLocation('District 7, HCMC')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    )
  }, [])

  const recentDestinations = [
    { icon: Home, label: 'Home', address: 'District 1' },
    { icon: Building2, label: 'Office', address: 'District 4' },
    { icon: ShoppingBag, label: 'Vincom', address: 'District 7' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (showRoute) {
                setShowRoute(false)
                setTripStarted(false)
              } else {
                router.back()
              }
            }}
            className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Navigate Safely</h1>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {!showRoute ? (
          <>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                <div className={`w-2 h-2 rounded-full ${locationError ? 'bg-red-500' : 'bg-[#289359]'}`} />
                <div>
                  <p className="text-xs text-neutral-500">Your location</p>
                  <p className="font-mono text-sm font-semibold text-neutral-900">{currentLocation}</p>
                  {coordinates && <p className="text-xs text-neutral-500 mt-1">({getNearestDistrict(coordinates.lat, coordinates.lng)} area)</p>}
                  {locationError && <p className="text-xs text-red-500 mt-1">⚠ {locationError}</p>}
                </div>
              </div>

              <DestinationInput
                value={destination}
                onChange={setDestination}
              />

              <Button
                onClick={handleFindRoute}
                disabled={!destination}
                className="w-full mt-4 h-12 bg-[#289359] hover:bg-[#1f6e43] text-white disabled:opacity-50"
              >
                Find Safe Route
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Recent destinations</h3>
              <div className="space-y-1">
                {recentDestinations.map((place) => {
                  const Icon = place.icon
                  return (
                    <button
                      key={place.label}
                      onClick={() => setDestination(`${place.label} (${place.address})`)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{place.label}</p>
                        <p className="text-xs text-neutral-500">{place.address}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>

            <AvoidList />
          </>
        ) : (
          <>
            <RouteSuggestion
              destination={destination}
              onStartNavigation={handleStartNavigation}
            />

            {/* Fixed bottom actions */}
            <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-linear-to-t from-white via-white to-transparent pt-6 space-y-2">
              <Button
                onClick={handleStartNavigation}
                className="w-full h-14 text-base font-semibold bg-[#289359] hover:bg-[#1f6e43] shadow-lg"
              >
                Start Navigation
              </Button>
              <Button
                onClick={handleManualArrival}
                variant="outline"
                className="w-full h-12 text-sm bg-transparent"
              >
                I Arrived (Manual Confirm)
              </Button>
            </div>
          </>
        )}
      </div>

      <PostTripModal
        open={showPostTrip}
        onClose={() => setShowPostTrip(false)}
        destination={destination}
        onConfirm={handleTripConfirm}
      />

      <RewardSuccessModal
        open={showRewardSuccess}
        onClose={() => {
          setShowRewardSuccess(false)
          setRewardData(null)
        }}
        pointsEarned={rewardData?.points || 0}
        newBalance={flowPoints}
        reason={rewardData?.reason}
      />
    </div>
  )
}
