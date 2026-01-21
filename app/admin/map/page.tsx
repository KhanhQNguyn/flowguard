'use client'

import { useState, useEffect, useRef } from 'react'
import { X, MapPin, Droplets } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { allSensors, type Sensor } from '@/lib/mock-sensors-full'
import { SensorInfoPanel } from '@/components/sensor-info-panel'
import { MaintenanceModal } from '@/components/sensor-maintenance-modal'
import { SensorHistoryModal } from '@/components/sensor-history-modal'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/map-component'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-gray-100 flex items-center justify-center">Loading map...</div>
})

const getMapPosition = (sensor: Sensor) => {
  // Placeholder implementation for getMapPosition
  // Replace with actual logic to determine sensor position on the map
  return { x: 50, y: 50 }
}

export default function SensorMapPage() {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)
  const [showMaintenance, setShowMaintenance] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDistrict, setFilterDistrict] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter sensors
  const filteredSensors = allSensors.filter((s) =>
    (filterStatus === 'all' || s.status === filterStatus) &&
    (filterDistrict === 'all' || s.district === filterDistrict) &&
    (searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Pagination
  const totalPages = Math.ceil(filteredSensors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSensors = filteredSensors.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filterStatus, filterDistrict, searchTerm])

  // Get unique districts
  const districts = Array.from(new Set(allSensors.map((s) => s.district)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#10b981'
      case 'warning':
        return '#eab308'
      case 'critical':
        return '#ef4444'
      case 'offline':
        return '#9ca3af'
      default:
        return '#d1d5db'
    }
  }

  const statusCounts = {
    online: filteredSensors.filter((s) => s.status === 'online').length,
    warning: filteredSensors.filter((s) => s.status === 'warning').length,
    critical: filteredSensors.filter((s) => s.status === 'critical').length,
    offline: filteredSensors.filter((s) => s.status === 'offline').length
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      {/* Sidebar - Controls & List */}
      <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
        <div className="p-3 md:p-4 space-y-3 border-b border-gray-200">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-neutral-900">Sensor Map</h1>
            <p className="text-xs md:text-sm text-neutral-600 mt-0.5">
              {filteredSensors.length} of {allSensors.length} active
            </p>
          </div>

          {/* Search */}
          <Input
            placeholder="Search sensors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm"
          />

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white flex-1 min-w-[100px]"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="offline">Offline</option>
            </select>

            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white flex-1 min-w-[100px]"
            >
              <option value="all">All Districts</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Online ({statusCounts.online})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Warning ({statusCounts.warning})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Critical ({statusCounts.critical})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>Offline ({statusCounts.offline})</span>
            </div>
          </div>
        </div>

        {/* Sensor List or Detail */}
        <div className="flex-1 overflow-y-auto">
          {selectedSensor ? (
            // Detail View
            <div className="p-3 md:p-4">
              <button
                onClick={() => setSelectedSensor(null)}
                className="mb-4 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
              >
                <X className="w-4 h-4" /> Back
              </button>
              <SensorInfoPanel
                sensor={selectedSensor}
                onClose={() => setSelectedSensor(null)}
                onRequestMaintenance={() => setShowMaintenance(true)}
                onViewHistory={() => setShowHistory(true)}
              />
            </div>
          ) : (
            // Sensor List
            <>
              <div className="divide-y divide-gray-100">
                {filteredSensors.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MapPin className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No sensors match filters</p>
                  </div>
                ) : (
                  paginatedSensors.map((sensor) => (
                    <button
                      key={sensor.id}
                      onClick={() => setSelectedSensor(sensor)}
                      className="w-full text-left p-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: getStatusColor(sensor.status) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="font-semibold text-xs md:text-sm text-gray-900">
                              {sensor.name}
                            </h4>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 flex-shrink-0">
                              {sensor.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                            {sensor.street}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-blue-700 flex items-center gap-0.5">
                              <Droplets className="w-3 h-3" /> {sensor.waterLevel}cm
                            </span>
                            <span className="text-gray-500">🔋 {sensor.batteryLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {filteredSensors.length > 0 && totalPages > 1 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {startIndex + 1}-{Math.min(endIndex, filteredSensors.length)} of {filteredSensors.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Prev
                      </button>
                      <span className="px-2 text-gray-700">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Map Container */}
      <MapComponent
        sensors={filteredSensors}
        selectedSensor={selectedSensor}
        onSelectSensor={setSelectedSensor}
        getStatusColor={getStatusColor}
      />

      {/* Modals */}
      {selectedSensor && (
        <>
          <MaintenanceModal
            sensor={selectedSensor}
            open={showMaintenance}
            onClose={() => setShowMaintenance(false)}
          />
          <SensorHistoryModal
            sensor={selectedSensor}
            open={showHistory}
            onClose={() => setShowHistory(false)}
          />
        </>
      )}
    </div>
  )
}
