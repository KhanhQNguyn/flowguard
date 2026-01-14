"use client"

import { useSearchParams } from "next/navigation"
import { AlertsFilter } from "@/components/alerts-filter"
import { AlertsList } from "@/components/alerts-list"
import { MOCK_ALERTS, filterAlerts, paginate } from "@/lib/mock-data"

export default function AlertsPage() {
  const searchParams = useSearchParams()
  const severity = searchParams.get("severity") || undefined
  const district = searchParams.get("district") || undefined
  const page = Number.parseInt(searchParams.get("page") || "1")

  const filteredAlerts = filterAlerts(MOCK_ALERTS, { severity, district })
  const { items: alerts, totalPages } = paginate(filteredAlerts, page, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Alerts</h1>
        <p className="text-gray-500 mt-1">Flood warnings and notifications</p>
      </div>

      <AlertsFilter />

      <AlertsList alerts={alerts} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  )
}
