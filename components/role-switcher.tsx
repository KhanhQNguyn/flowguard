'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Shield, ChevronRight, X } from 'lucide-react'

interface RoleSwitcherProps {
  currentRole: 'citizen' | 'admin'
  onRoleChange: (role: 'citizen' | 'admin') => void
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSwitch = () => {
    setShowConfirm(true)
  }

  const confirmSwitch = () => {
    const newRole = currentRole === 'citizen' ? 'admin' : 'citizen'
    localStorage.setItem('userRole', newRole)
    
    // Force state update with callback to ensure it completes before navigation
    onRoleChange(newRole)
    setShowConfirm(false)

    // Use replace instead of push to avoid navigation history issues
    if (newRole === 'admin') {
      router.replace('/admin/dashboard')
    } else {
      router.replace('/home')
    }
  }

  if (!showConfirm) {
    return (
      <button
        onClick={handleSwitch}
        className="w-full p-4 bg-white border border-neutral-200 rounded-xl hover:border-[#289359] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentRole === 'citizen' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {currentRole === 'citizen' ? (
                <User className="w-5 h-5 text-blue-600" />
              ) : (
                <Shield className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-neutral-900">
                {currentRole === 'citizen' ? 'Citizen Mode' : 'Admin Mode'}
              </p>
              <p className="text-xs text-neutral-500">
                Switch to {currentRole === 'citizen' ? 'Administrator' : 'Citizen'} view
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </div>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />

      <Card className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 modal-center">
        <button
          onClick={() => setShowConfirm(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5 text-neutral-400" />
        </button>

        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            currentRole === 'citizen' ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {currentRole === 'citizen' ? (
              <Shield className="w-8 h-8 text-green-600" />
            ) : (
              <User className="w-8 h-8 text-blue-600" />
            )}
          </div>

          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            Switch to {currentRole === 'citizen' ? 'Admin' : 'Citizen'} Mode?
          </h3>
          <p className="text-sm text-neutral-600">
            {currentRole === 'citizen'
              ? 'Access city-wide monitoring and sensor management'
              : 'Return to personal flood navigation and alerts'}
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={confirmSwitch}
            className="w-full h-12 bg-[#289359] hover:bg-[#1f6e43] text-white"
          >
            Confirm Switch
          </Button>
          <Button
            onClick={() => setShowConfirm(false)}
            variant="outline"
            className="w-full h-12"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}
