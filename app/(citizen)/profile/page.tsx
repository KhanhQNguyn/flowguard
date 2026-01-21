'use client'

import { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { UserInfoCard } from '@/components/user-info-card'
import { SettingsAccordion } from '@/components/settings-accordion'
import { TripHistory } from '@/components/trip-history'
import { Button } from '@/components/ui/button'
import { RoleSwitcher } from '@/components/role-switcher'

export default function ProfilePage() {
  const [userRole, setUserRole] = useState<'citizen' | 'admin'>('citizen')

  useEffect(() => {
    const role = (localStorage.getItem('userRole') as 'citizen' | 'admin') || 'citizen'
    setUserRole(role)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const role = (localStorage.getItem('userRole') as 'citizen' | 'admin') || 'citizen'
      setUserRole(role)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 p-4">
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      <div className="p-4 space-y-4">
        <RoleSwitcher currentRole={userRole} onRoleChange={setUserRole} />
        <UserInfoCard />
        <TripHistory />
        <SettingsAccordion />

        {/* Sign Out Button */}
        <Button
          variant="outline"
          className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-neutral-400 pt-4">
          FlowGuard v1.0.0 - Hackathon Demo
        </p>
      </div>
    </div>
  )
}
