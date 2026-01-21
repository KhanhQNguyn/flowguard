'use client'

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { mockPartners, mockRedemptions, mockPartnershipAnalytics } from '@/lib/mock-partnerships'
import type { Partner, Redemption, PartnershipAnalytics } from '@/lib/partnerships'

interface PartnershipContextType {
  partners: Partner[]
  redemptions: Redemption[]
  analytics: PartnershipAnalytics
  addRedemption: (redemption: Omit<Redemption, 'id' | 'redeemedAt'>) => void
  markRedemptionUsed: (redemptionId: string) => void
  generateVoucherCode: (partnerId: string) => string
  getPartnerById: (partnerId: string) => Partner | undefined
}

const PartnershipContext = createContext<PartnershipContextType | undefined>(undefined)

const STORAGE_KEY = 'flowguard_partnerships'

export function PartnershipProvider({ children }: { children: ReactNode }) {
  const [partners, setPartners] = useState<Partner[]>(mockPartners)
  const [redemptions, setRedemptions] = useState<Redemption[]>(mockRedemptions)
  const [analytics, setAnalytics] = useState<PartnershipAnalytics>(mockPartnershipAnalytics)

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const { partners: storedPartners, redemptions: storedRedemptions } = JSON.parse(stored)
        if (storedPartners) setPartners(storedPartners)
        if (storedRedemptions) setRedemptions(storedRedemptions)
      } catch (error) {
        console.error('[v0] Failed to parse partnership data:', error)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ partners, redemptions }))
  }, [partners, redemptions])

  // Recalculate analytics when data changes
  useEffect(() => {
    const totalCommission = partners.reduce((sum, p) => sum + p.commissionEarned, 0)
    const totalRedemptionCount = partners.reduce((sum, p) => sum + p.redemptionsThisMonth, 0)
    const usedRedemptions = redemptions.filter(r => r.status === 'used').length
    const conversionRate = redemptions.length > 0 ? usedRedemptions / redemptions.length : 0
    const avgValue = redemptions.length > 0 
      ? redemptions.reduce((sum, r) => sum + r.vndValue, 0) / redemptions.length 
      : 0

    const topPartners = [...partners]
      .filter(p => p.status === 'active')
      .sort((a, b) => b.commissionEarned - a.commissionEarned)
      .slice(0, 5)
      .map(p => ({
        partnerId: p.id,
        name: p.name,
        revenue: p.revenueThisMonth,
        redemptions: p.redemptionsThisMonth
      }))

    setAnalytics({
      totalCommissionEarned: totalCommission,
      totalRedemptions: totalRedemptionCount,
      conversionRate,
      averageVoucherValue: avgValue,
      topPartners,
      monthlyTrend: mockPartnershipAnalytics.monthlyTrend
    })
  }, [partners, redemptions])

  const generateVoucherCode = (partnerId: string): string => {
    const partner = partners.find(p => p.id === partnerId)
    if (!partner) return ''
    
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `FLOW-${partner.name.toUpperCase().replace(/\s+/g, '')}-${randomPart}`
  }

  const addRedemption = (redemption: Omit<Redemption, 'id' | 'redeemedAt'>) => {
    const newRedemption: Redemption = {
      ...redemption,
      id: `r${Date.now()}`,
      redeemedAt: new Date().toISOString()
    }

    setRedemptions(prev => [newRedemption, ...prev])

    // Update partner stats
    setPartners(prev => prev.map(partner => {
      if (partner.id === redemption.partnerId) {
        return {
          ...partner,
          redemptionsThisMonth: partner.redemptionsThisMonth + 1,
          revenueThisMonth: partner.revenueThisMonth + redemption.vndValue,
          commissionEarned: partner.commissionEarned + redemption.commissionEarned
        }
      }
      return partner
    }))
  }

  const markRedemptionUsed = (redemptionId: string) => {
    setRedemptions(prev => prev.map(r => {
      if (r.id === redemptionId) {
        return {
          ...r,
          usedAt: new Date().toISOString(),
          status: 'used'
        }
      }
      return r
    }))
  }

  const getPartnerById = (partnerId: string) => {
    return partners.find(p => p.id === partnerId)
  }

  return (
    <PartnershipContext.Provider
      value={{
        partners,
        redemptions,
        analytics,
        addRedemption,
        markRedemptionUsed,
        generateVoucherCode,
        getPartnerById
      }}
    >
      {children}
    </PartnershipContext.Provider>
  )
}

export function usePartnership() {
  const context = useContext(PartnershipContext)
  if (context === undefined) {
    throw new Error('usePartnership must be used within a PartnershipProvider')
  }
  return context
}
