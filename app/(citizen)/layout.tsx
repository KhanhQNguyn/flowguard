'use client'

import React from "react"

import { BottomNav } from '@/components/bottom-nav'
import { AppProvider } from '@/lib/app-context'
import { UserProvider } from '@/lib/user-context'
import { PremiumProvider } from '@/lib/premium-context'

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>
      <UserProvider>
        <PremiumProvider>
          <div className="min-h-screen bg-neutral-50 pb-20 max-w-md mx-auto">
            {children}
            <BottomNav />
          </div>
        </PremiumProvider>
      </UserProvider>
    </AppProvider>
  )
}
