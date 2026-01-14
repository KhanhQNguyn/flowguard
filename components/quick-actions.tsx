"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Map, Phone, AlertTriangle } from "lucide-react"

const actions = [
  { icon: Camera, label: "Report Flooding", href: "/reports/new", color: "bg-blue-500" },
  { icon: Map, label: "View Map", href: "/map", color: "bg-green-500" },
  { icon: AlertTriangle, label: "Emergency Info", href: "#", color: "bg-yellow-500" },
  { icon: Phone, label: "Call Hotline", href: "tel:1800599915", color: "bg-red-500" },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
