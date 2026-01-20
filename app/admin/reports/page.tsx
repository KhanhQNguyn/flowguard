'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Info, X, ImageIcon, MapPin, Clock, User } from 'lucide-react'

interface Report {
  id: number
  location: string
  district: string
  description: string
  severity: 'low' | 'medium' | 'high'
  reporter: string
  timestamp: string
  verified: boolean
  images?: string[]
  confidence?: number
  waterDepth?: string
  status?: 'active' | 'resolved'
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')

  const reports: Report[] = [
    {
      id: 1,
      location: 'Huynh Tan Phat St, District 7',
      district: 'District 7',
      description: 'Water overflowing from canal, road flooded 20cm',
      severity: 'high',
      reporter: 'Frank Khanh',
      timestamp: '10 minutes ago',
      verified: true,
      confidence: 92,
      waterDepth: '20cm',
      status: 'active',
      images: ['/flood-placeholder-1.jpg']
    },
    {
      id: 2,
      location: 'Nguyen Thi Thap St, District 7',
      district: 'District 7',
      description: 'Heavy rainfall, drainage clogged',
      severity: 'medium',
      reporter: 'Linh Tran',
      timestamp: '25 minutes ago',
      verified: true,
      confidence: 78,
      waterDepth: '8-10cm',
      status: 'active',
      images: ['/flood-placeholder-2.jpg']
    },
    {
      id: 3,
      location: 'Nguyen Huu Canh St, District 4',
      district: 'District 4',
      description: 'River level rising rapidly',
      severity: 'high',
      reporter: 'Duc Pham',
      timestamp: '5 minutes ago',
      verified: false,
      confidence: 85,
      waterDepth: '15-18cm',
      status: 'active',
      images: ['/flood-placeholder-3.jpg']
    }
  ]

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <div className="w-3 h-3 rounded-full bg-red-500" />
      case 'medium':
        return <div className="w-3 h-3 rounded-full bg-yellow-500" />
      case 'low':
        return <div className="w-3 h-3 rounded-full bg-green-500" />
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-300" />
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-1 md:mb-2">Community Reports</h1>
          <p className="text-sm md:text-base text-neutral-600">Manage and verify flood reports from community members</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <Card className="p-3 md:p-4">
            <p className="text-xs text-neutral-500 mb-1">Total</p>
            <p className="text-xl md:text-2xl font-bold">{reports.length}</p>
          </Card>
          <Card className="p-3 md:p-4">
            <p className="text-xs text-neutral-500 mb-1">Verified</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{reports.filter(r => r.verified).length}</p>
          </Card>
          <Card className="p-3 md:p-4">
            <p className="text-xs text-neutral-500 mb-1">High Severity</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">{reports.filter(r => r.severity === 'high').length}</p>
          </Card>
          <Card className="p-3 md:p-4">
            <p className="text-xs text-neutral-500 mb-1">Active</p>
            <p className="text-xl md:text-2xl font-bold text-orange-600">{reports.filter(r => r.status === 'active').length}</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            <option value="all">All Severity</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Reports List */}
        <div className="space-y-3 md:space-y-4">
          {reports
            .filter(r => (filterStatus === 'all' || r.status === filterStatus) && (filterSeverity === 'all' || r.severity === filterSeverity))
            .map((report) => (
              <Card
                key={report.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-4 md:p-6">
                  {/* Image - Mobile above, Desktop left */}
                  {report.images && report.images[0] && (
                    <div className="w-full md:w-40 md:flex-shrink-0">
                      <img
                        src={report.images[0] || "/placeholder.svg"}
                        alt={`Flood report at ${report.location}`}
                        className="w-full h-40 md:h-32 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {getSeverityIcon(report.severity)}
                          <h3 className="font-semibold text-neutral-900 text-sm md:text-base line-clamp-2">
                            {report.location}
                          </h3>
                          {report.verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded whitespace-nowrap">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-neutral-600 mb-2 line-clamp-2">{report.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-neutral-500 mb-2">
                          {report.waterDepth && (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {report.waterDepth}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {report.reporter}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {report.timestamp}
                          </span>
                        </div>
                        {report.confidence && (
                          <div className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            AI Confidence: {report.confidence}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        {/* Detail View Modal */}
        {selectedReport && (
          <Card className="fixed inset-0 z-50 overflow-y-auto md:fixed md:inset-auto md:bottom-4 md:right-4 md:left-auto md:w-96 md:max-h-[90vh] p-0">
            <div className="bg-white">
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image carousel */}
              {selectedReport.images && selectedReport.images.length > 0 && (
                <div className="w-full h-64 md:h-48 overflow-x-auto">
                  <img
                    src={selectedReport.images[0] || "/placeholder.svg"}
                    alt={`Flood report at ${selectedReport.location}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4 md:p-6 space-y-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-2">
                    {getSeverityIcon(selectedReport.severity)}
                    <span className="line-clamp-2">{selectedReport.location}</span>
                  </h2>
                  <p className="text-sm text-neutral-600">{selectedReport.district}</p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-700">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">Water Depth</p>
                    <p className="font-bold text-sm md:text-base">{selectedReport.waterDepth || 'N/A'}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-purple-50 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">AI Confidence</p>
                    <p className="font-bold text-sm md:text-base">{selectedReport.confidence || 'N/A'}%</p>
                  </div>
                  <div className="p-3 md:p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">Reporter</p>
                    <p className="font-bold text-sm md:text-base">{selectedReport.reporter}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-orange-50 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">Status</p>
                    <p className="font-bold text-sm md:text-base flex items-center gap-1">
                      {selectedReport.verified ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" /> Verified
                        </>
                      ) : (
                        <>
                          <Info className="w-4 h-4 text-yellow-600" /> Pending
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {!selectedReport.verified && (
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                      Verify Report
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
