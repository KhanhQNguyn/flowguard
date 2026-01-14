"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Report } from "@/lib/mock-data"

interface ReportsGridProps {
  reports: Report[]
}

export function ReportsGrid({ reports }: ReportsGridProps) {
  if (reports.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No reports match your filters</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative bg-gray-100">
            <Image src={report.image || "/placeholder.svg"} alt="Flood report" fill className="object-cover" />
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant={report.verified ? "default" : "secondary"}
                className={report.verified ? "bg-green-600" : ""}
              >
                {report.verified ? "Verified" : "Pending"}
              </Badge>
              <span className="text-xs text-gray-500">{report.timestamp}</span>
            </div>

            <h3 className="font-semibold mb-1">{report.location}</h3>
            <p className="text-sm text-gray-500 mb-1">{report.district}</p>

            <p className="text-sm text-gray-600 mb-3">Water depth: {report.waterDepth}</p>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Reported by {report.userName}</span>
              {report.aiConfidence && (
                <>
                  <span>•</span>
                  <span>AI: {report.aiConfidence}% confident</span>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
