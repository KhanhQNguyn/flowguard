"use client"

import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight } from "lucide-react"

export function RecentAlerts() {
  const { alerts } = useApp()
  const recentAlerts = alerts.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Alerts</CardTitle>
        <Link href="/alerts">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <div
              className={`p-2 rounded-lg ${
                alert.severity === "HIGH"
                  ? "bg-red-100 text-red-600"
                  : alert.severity === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
              }`}
            >
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={
                    alert.severity === "HIGH" ? "destructive" : alert.severity === "MEDIUM" ? "outline" : "secondary"
                  }
                  className="text-xs"
                >
                  {alert.severity}
                </Badge>
                <span className="text-xs text-gray-500">{alert.time}</span>
              </div>
              <p className="text-sm font-medium truncate">{alert.title}</p>
              <p className="text-xs text-gray-500 truncate">{alert.location}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
