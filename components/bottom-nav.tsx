'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Navigation, Camera, Gift, User, TrendingUp } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Navigate', path: '/navigate', icon: Navigation },
    { name: 'Report', path: '/report', icon: Camera },
    { name: 'Rewards', path: '/rewards', icon: Gift },
    { name: 'Premium', path: '/subscription', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.path

          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors flex-shrink-0 min-w-max"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#289359]' : 'text-neutral-400'}`} />
              <span className={`text-xs ${isActive ? 'text-[#289359] font-semibold' : 'text-neutral-600'}`}>
                {tab.name}
              </span>
            </button>
          )
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </div>
  )
}
