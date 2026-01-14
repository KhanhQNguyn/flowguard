"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ReportsGrid } from "@/components/reports-grid"
import { MOCK_REPORTS, filterReports, paginate } from "@/lib/mock-data"
import { Plus } from "lucide-react"

export default function ReportsPage() {
  const searchParams = useSearchParams()
  const page = Number.parseInt(searchParams.get("page") || "1")

  const filteredReports = filterReports(MOCK_REPORTS, {})
  const { items: reports, totalPages } = paginate(filteredReports, page, 6)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Community Reports</h1>
          <p className="text-gray-500 mt-1">Verified flood reports from citizens</p>
        </div>
        <Link href="/reports/new">
          <Button className="bg-primary-green hover:bg-primary-green/90">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </Link>
      </div>

      <ReportsGrid reports={reports} />

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
