'use client'

import { useState } from 'react'
import { Bell, MapPin, HelpCircle, Lock, Info, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function SettingsAccordion() {
  const [notifications, setNotifications] = useState(true)
  const [locationAccess, setLocationAccess] = useState(true)

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Receive flood alerts',
          type: 'toggle' as const,
          value: notifications,
          onChange: () => setNotifications(!notifications)
        },
        {
          icon: MapPin,
          label: 'Location Access',
          description: 'For accurate flood data',
          type: 'toggle' as const,
          value: locationAccess,
          onChange: () => setLocationAccess(!locationAccess)
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          type: 'link' as const
        },
        {
          icon: Lock,
          label: 'Privacy Policy',
          type: 'link' as const
        },
        {
          icon: Info,
          label: 'About FlowGuard',
          type: 'link' as const
        }
      ]
    }
  ]

  return (
    <div className="space-y-4">
      {settingsGroups.map((group) => (
        <Card key={group.title} className="overflow-hidden">
          <div className="p-3 bg-neutral-50 border-b border-neutral-100">
            <h3 className="font-medium text-sm text-neutral-600">{group.title}</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={item.type === 'toggle' ? item.onChange : undefined}
                  className="w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.label}</p>
                    {'description' in item && (
                      <p className="text-xs text-neutral-500">{item.description}</p>
                    )}
                  </div>
                  {item.type === 'toggle' && (
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      item.value ? 'bg-[#289359]' : 'bg-neutral-300'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                        item.value ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'
                      }`}>
                      </div>
                    </div>
                  )}
                  {item.type === 'link' && (
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  )}
                </button>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}
