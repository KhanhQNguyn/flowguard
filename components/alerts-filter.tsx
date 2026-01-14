"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DISTRICTS = ["all", "District 1", "District 4", "District 7", "Bình Thạnh", "Thủ Đức"]
const SEVERITIES = ["all", "HIGH", "MEDIUM", "LOW"]

export function AlertsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const severity = searchParams.get("severity") || "all"
  const district = searchParams.get("district") || "all"

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete("page")
    router.push(`/alerts?${params.toString()}`)
  }

  const resetFilters = () => {
    router.push("/alerts")
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          <Select value={severity} onValueChange={(v) => updateFilters("severity", v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Severity" />
            </SelectTrigger>
            <SelectContent>
              {SEVERITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "all" ? "All Severity" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={district} onValueChange={(v) => updateFilters("district", v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              {DISTRICTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d === "all" ? "All Districts" : d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
