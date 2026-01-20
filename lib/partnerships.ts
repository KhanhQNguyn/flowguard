export interface Partner {
  id: string
  name: string
  logo: string
  commissionRate: number
  voucherTiers: VoucherTier[]
  redemptionsThisMonth: number
  revenueThisMonth: number
  commissionEarned: number
  status: 'active' | 'paused' | 'pending'
  contractStartDate: string
  minimumVolume?: number
}

export interface VoucherTier {
  id: string
  pointCost: number
  vndValue: number
  commissionEarned: number
  description?: string
}

export interface Redemption {
  id: string
  userId: string
  userName?: string
  partnerId: string
  partnerName: string
  voucherCode: string
  pointsSpent: number
  vndValue: number
  commissionEarned: number
  redeemedAt: string
  usedAt: string | null
  status: 'pending' | 'used' | 'expired'
}

export interface PartnershipAnalytics {
  totalCommissionEarned: number
  totalRedemptions: number
  conversionRate: number
  averageVoucherValue: number
  topPartners: {
    partnerId: string
    name: string
    revenue: number
    redemptions: number
  }[]
  monthlyTrend: {
    date: string
    commission: number
    redemptions: number
  }[]
}
