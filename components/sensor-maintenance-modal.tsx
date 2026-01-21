'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Wrench, X } from 'lucide-react'

interface Sensor {
  id: number
  name: string
  waterLevel?: number
  district?: string
}

interface MaintenanceModalProps {
  sensor: Sensor | null
  open: boolean
  onClose: () => void
}

export function MaintenanceModal({ sensor, open, onClose }: MaintenanceModalProps) {
  const [priority, setPriority] = useState<'urgent' | 'high' | 'normal'>('normal')
  const [issue, setIssue] = useState('')

  if (!open || !sensor) return null

  const handleSubmit = () => {
    const ticket = {
      sensorId: sensor.id,
      sensorName: sensor.name,
      priority,
      issue,
      createdAt: new Date().toISOString(),
      status: 'pending',
      assignedTo: 'Maintenance Team'
    }
    console.log('[v0] Maintenance ticket created:', ticket)
    setIssue('')
    setPriority('normal')
    onClose()
  }

  const priorityColors = {
    urgent: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    normal: 'border-blue-500 bg-blue-50'
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-white rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Request Maintenance</h2>
              <p className="text-sm text-gray-600">{sensor.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'normal', label: 'Normal' }
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value as any)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    priority === p.value
                      ? priorityColors[p.value as keyof typeof priorityColors]
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Issue Description</label>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the issue..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Quick Templates</label>
            <div className="space-y-2">
              {[
                'Sensor offline for >1 hour',
                'Erratic readings detected',
                'Low battery warning',
                'Physical damage suspected'
              ].map((template) => (
                <button
                  key={template}
                  onClick={() => setIssue(template)}
                  className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!issue}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              Submit Request
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
