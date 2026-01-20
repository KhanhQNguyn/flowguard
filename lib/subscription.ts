export type SubscriptionTier = 'free' | 'premium' | 'trial'

export interface SubscriptionStatus {
  tier: SubscriptionTier
  isActive: boolean
  expiryDate: string | null
  trialEndsAt: string | null
  trialDaysRemaining: number
  billingCycle: 'monthly' | 'yearly' | null
  autoRenew: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  priceYearly: number
  currency: string
  features: string[]
  isPopular?: boolean
}

export interface BillingHistory {
  id: string
  date: string
  amount: number
  currency: string
  plan: string
  status: 'paid' | 'pending' | 'failed'
  invoiceUrl?: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    currency: 'VND',
    features: [
      'Basic flood alerts (1 district)',
      'Standard AI routing',
      'Trip history (30 days)',
      '1x FlowPoints earning',
      'Ad-supported experience'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2.99,
    priceYearly: 29.99,
    currency: 'USD',
    isPopular: true,
    features: [
      'Multi-district alerts (5+ districts)',
      'SMS emergency notifications',
      'Ad-free experience',
      'Priority AI routing',
      '2x FlowPoints earning',
      'Advanced trip analytics',
      'Export trip data',
      'Priority support'
    ]
  }
]
