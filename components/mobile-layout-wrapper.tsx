'use client'

import { type ReactNode } from 'react'

interface MobileLayoutWrapperProps {
  children: ReactNode
  className?: string
}

export function MobileLayoutWrapper({ children, className = '' }: MobileLayoutWrapperProps) {
  return (
    <div className={`min-h-screen bg-neutral-50 pb-20 ${className}`}>
      <div className="max-w-md mx-auto">
        {children}
      </div>
    </div>
  )
}
