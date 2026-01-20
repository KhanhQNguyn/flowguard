'use client'

import React from "react"

export function PhoneFrameWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-frame-wrapper hidden lg:flex">
      <div className="phone-frame">
        <div className="phone-frame-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile view on all devices */}
      <div className="lg:hidden">
        {children}
      </div>

      {/* Desktop with phone frame simulation */}
      <PhoneFrameWrapper>
        {children}
      </PhoneFrameWrapper>
    </>
  )
}
