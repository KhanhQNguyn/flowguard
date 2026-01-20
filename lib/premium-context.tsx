'use client'

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { SubscriptionStatus } from '@/lib/subscription'

interface PremiumContextType {
  subscription: SubscriptionStatus
  isPremium: boolean
  isTrialActive: boolean
  updateSubscription: (tier: 'free' | 'premium' | 'trial', billingCycle?: 'monthly' | 'yearly') => void
  cancelSubscription: () => void
  startTrial: () => void
  checkFeatureAccess: (feature: string) => boolean
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

const STORAGE_KEY = 'flowguard_subscription'

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    tier: 'free',
    isActive: false,
    expiryDate: null,
    trialEndsAt: null,
    trialDaysRemaining: 0,
    billingCycle: null,
    autoRenew: false
  })

  // Load subscription from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        
        // Calculate trial days remaining
        if (parsed.trialEndsAt) {
          const trialEnd = new Date(parsed.trialEndsAt)
          const now = new Date()
          const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysRemaining <= 0 && parsed.tier === 'trial') {
            // Trial expired, downgrade to free
            parsed.tier = 'free'
            parsed.isActive = false
            parsed.trialEndsAt = null
            parsed.trialDaysRemaining = 0
          } else {
            parsed.trialDaysRemaining = daysRemaining
          }
        }
        
        setSubscription(parsed)
      } catch (error) {
        console.error('[v0] Failed to parse subscription data:', error)
      }
    }
  }, [])

  // Save to localStorage whenever subscription changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription))
  }, [subscription])

  const updateSubscription = (tier: 'free' | 'premium' | 'trial', billingCycle?: 'monthly' | 'yearly') => {
    const now = new Date()
    const expiryDate = new Date()
    
    if (tier === 'premium') {
      if (billingCycle === 'yearly') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1)
      }
      
      setSubscription({
        tier: 'premium',
        isActive: true,
        expiryDate: expiryDate.toISOString(),
        trialEndsAt: null,
        trialDaysRemaining: 0,
        billingCycle: billingCycle || 'monthly',
        autoRenew: true
      })
    } else if (tier === 'trial') {
      const trialEnd = new Date()
      trialEnd.setDate(trialEnd.getDate() + 7)
      
      setSubscription({
        tier: 'trial',
        isActive: true,
        expiryDate: null,
        trialEndsAt: trialEnd.toISOString(),
        trialDaysRemaining: 7,
        billingCycle: null,
        autoRenew: false
      })
    } else {
      setSubscription({
        tier: 'free',
        isActive: false,
        expiryDate: null,
        trialEndsAt: null,
        trialDaysRemaining: 0,
        billingCycle: null,
        autoRenew: false
      })
    }
  }

  const cancelSubscription = () => {
    setSubscription({
      tier: 'free',
      isActive: false,
      expiryDate: null,
      trialEndsAt: null,
      trialDaysRemaining: 0,
      billingCycle: null,
      autoRenew: false
    })
  }

  const startTrial = () => {
    if (subscription.tier === 'free' && !subscription.trialEndsAt) {
      updateSubscription('trial')
    }
  }

  const checkFeatureAccess = (feature: string): boolean => {
    const isPremiumOrTrial = subscription.tier === 'premium' || subscription.tier === 'trial'
    
    const premiumFeatures = [
      'multi-district-alerts',
      'sms-notifications',
      'ad-free',
      'priority-routing',
      '2x-flowpoints',
      'advanced-analytics',
      'export-data'
    ]
    
    if (premiumFeatures.includes(feature)) {
      return isPremiumOrTrial
    }
    
    return true
  }

  const isPremium = subscription.tier === 'premium'
  const isTrialActive = subscription.tier === 'trial'

  return (
    <PremiumContext.Provider
      value={{
        subscription,
        isPremium,
        isTrialActive,
        updateSubscription,
        cancelSubscription,
        startTrial,
        checkFeatureAccess
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider')
  }
  return context
}
