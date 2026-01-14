"use client"

import { useApp } from "@/lib/app-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts"

export function PredictionChart() {
  const { predictionData } = useApp()

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={predictionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white p-2 border rounded shadow-sm text-sm">
                  <p className="font-medium">{payload[0].payload.time}</p>
                  <p className="text-gray-600">Water: {payload[0].value}cm</p>
                </div>
              )
            }}
          />
          <ReferenceLine
            y={30}
            stroke="#22c55e"
            strokeDasharray="3 3"
            label={{ value: "30cm", position: "right", fill: "#22c55e", fontSize: 10 }}
          />
          <ReferenceLine
            y={50}
            stroke="#eab308"
            strokeDasharray="3 3"
            label={{ value: "50cm", position: "right", fill: "#eab308", fontSize: 10 }}
          />
          <ReferenceLine
            y={70}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{ value: "70cm", position: "right", fill: "#ef4444", fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="waterLevel"
            stroke="#289359"
            strokeWidth={2}
            dot={{ fill: "#289359", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
