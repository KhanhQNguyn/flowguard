'use client'

import { useEffect, useRef, useState } from 'react'
import { Target } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Sensor } from '@/lib/mock-sensors-full'

interface MapComponentProps {
  sensors: Sensor[]
  selectedSensor: Sensor | null
  onSelectSensor: (sensor: Sensor) => void
  getStatusColor: (status: string) => string
}

export default function MapComponent({
  sensors,
  selectedSensor,
  onSelectSensor,
  getStatusColor
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<number, L.Marker>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    try {
      console.log('[v0] Initializing map...')
      const map = L.map(mapRef.current, {
        center: [10.7756, 106.7019],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
        minZoom: 10,
        maxZoom: 18
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        crossOrigin: 'anonymous'
      }).addTo(map)

      console.log('[v0] Map tiles added, setting ready')
      setIsLoading(false)
      mapInstanceRef.current = map

      return () => {
        if (mapInstanceRef.current) {
          console.log('[v0] Cleaning up map')
          map.remove()
          mapInstanceRef.current = null
        }
      }
    } catch (error) {
      console.error('[v0] Map initialization error:', error)
      setMapError('Failed to load map. Please refresh the page.')
      setIsLoading(false)
    }
  }, [])

  // Helper function to fit map to all sensors
  const fitMapToSensors = (map: L.Map, sensorsToFit: Sensor[]) => {
    if (sensorsToFit.length === 0) return

    const bounds = L.latLngBounds(sensorsToFit.map(s => [s.lat, s.lng]))
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    console.log('[v0] Map fitted to', sensorsToFit.length, 'sensors')
  }

  // Helper function to recenter map
  const handleRecenter = () => {
    if (mapInstanceRef.current && sensors.length > 0) {
      fitMapToSensors(mapInstanceRef.current, sensors)
    }
  }

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) return

    console.log('[v0] Updating markers for', sensors.length, 'sensors')

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current.clear()

    // Add new markers
    sensors.forEach((sensor) => {
      const color = getStatusColor(sensor.status)

      const html = `
        <div class="sensor-marker" style="
          width: 32px;
          height: 32px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s ease-out;
        ">
          ${sensor.id}
        </div>
      `

      const marker = L.marker([sensor.lat, sensor.lng], {
        icon: L.divIcon({
          html,
          iconSize: [32, 32],
          className: 'leaflet-marker-icon-custom'
        })
      }).addTo(mapInstanceRef.current!)

      // Add click handler
      marker.on('click', () => {
        console.log('[v0] Marker clicked:', sensor.id, sensor.name)
        onSelectSensor(sensor)
        mapInstanceRef.current?.flyTo([sensor.lat, sensor.lng], 14, {
          duration: 0.8
        })
      })

      // Add hover effects
      marker.on('mouseover', function() {
        const element = this.getElement()
        if (element) {
          const markerDiv = element.querySelector('.sensor-marker') as HTMLElement
          if (markerDiv) {
            markerDiv.style.transform = 'scale(1.2)'
          }
        }
      })

      marker.on('mouseout', function() {
        const element = this.getElement()
        if (element) {
          const markerDiv = element.querySelector('.sensor-marker') as HTMLElement
          if (markerDiv && selectedSensor?.id !== sensor.id) {
            markerDiv.style.transform = 'scale(1)'
          }
        }
      })

      markersRef.current.set(sensor.id, marker)
    })

    // Fit map to sensors on first load
    if (sensors.length > 0 && !selectedSensor) {
      fitMapToSensors(mapInstanceRef.current, sensors)
    }
  }, [sensors, onSelectSensor, getStatusColor, isLoading, selectedSensor])

  // Highlight selected marker with pulsing animation
  useEffect(() => {
    console.log('[v0] Selected sensor changed:', selectedSensor?.id)
    
    markersRef.current.forEach((marker, sensorId) => {
      const isSelected = selectedSensor?.id === sensorId
      const element = marker.getElement()
      if (element) {
        const icon = element.querySelector('.sensor-marker') as HTMLElement
        if (icon) {
          if (isSelected) {
            icon.style.transform = 'scale(1.5)'
            icon.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0,0,0,0.4)'
            icon.style.zIndex = '1000'
          } else {
            icon.style.transform = 'scale(1)'
            icon.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
            icon.style.zIndex = '1'
          }
        }
      }
    })
  }, [selectedSensor])

  return (
    <div className="flex-1 relative min-h-96 lg:min-h-screen overflow-hidden">
      {/* 1. Map Container - Thêm z-0 để làm lớp nền thấp nhất */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* 2. Loading State - Tăng lên z-[2000] để chắc chắn che được mọi lớp của Leaflet */}
      {isLoading && (
        <div className="absolute inset-0 z-[2000] bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-medium">Loading sensor network map...</p>
          </div>
        </div>
      )}

      {/* 3. Error State - Tăng lên z-[2000] tương tự loading */}
      {mapError && (
        <div className="absolute inset-0 z-[2000] bg-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold mb-2">{mapError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* 4. UI Overlays (Buttons & Indicators) - Tăng lên z-[1000] để nằm trên Marker và Popup */}
      {!isLoading && !mapError && (
        <>
          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 p-2.5 rounded-lg shadow-lg border border-gray-200 transition-all hover:scale-105 active:scale-95"
            title="Recenter map to show all sensors"
          >
            <Target className="w-5 h-5 text-gray-700" />
          </button>

          {/* Connection Status Indicator */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-700">Connected</span>
          </div>
        </>
      )}
    </div>
  )
}
