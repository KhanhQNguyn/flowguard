"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, MapPin, Clock } from "lucide-react"
import type { AlertData } from "@/lib/flood-logic"

interface AlertsListProps {
  alerts: AlertData[]
}

export function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No alerts match your filters</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1">
                <div
                  className={`
                    p-2 rounded-lg shrink-0
                    ${alert.severity === "HIGH" ? "bg-red-100 text-red-600" : ""}
                    ${alert.severity === "MEDIUM" ? "bg-yellow-100 text-yellow-600" : ""}
                    ${alert.severity === "LOW" ? "bg-green-100 text-green-600" : ""}
                  `}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge
                      variant={
                        alert.severity === "HIGH"
                          ? "destructive"
                          : alert.severity === "MEDIUM"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-sm text-gray-500">{alert.time}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>

                  <p className="text-sm text-gray-600 mb-3">{alert.message}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link href={`/map?marker=${alert.id}`}>
                <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                  View on Map
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
