'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Radio, FileText, Users, LogOut, Shield, Map, ChevronLeft, TrendingUp } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Map', path: '/admin/map', icon: Map },
    { name: 'Sensors', path: '/admin/sensors', icon: Radio },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Partnerships', path: '/admin/partnerships', icon: TrendingUp }
  ]

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header - Mobile First */}
      <header className="bg-[#0d2b1c] text-white sticky top-0 z-40">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <h1 className="font-bold text-base md:text-lg">FlowGuard Admin</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs md:text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>

          {/* Navigation - Horizontal scrollable on mobile, normal on desktop */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs md:text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
