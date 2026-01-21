import type { Partner, Redemption, PartnershipAnalytics } from '@/lib/partnerships'

export const mockPartners: Partner[] = [
  {
    id: 'grab',
    name: 'Grab',
    logo: '/partners/grab-logo.png',
    commissionRate: 0.10,
    voucherTiers: [
      { id: 'grab-1', pointCost: 50, vndValue: 10000, commissionEarned: 1000 },
      { id: 'grab-2', pointCost: 100, vndValue: 25000, commissionEarned: 2500 },
      { id: 'grab-3', pointCost: 200, vndValue: 50000, commissionEarned: 5000 }
    ],
    redemptionsThisMonth: 423,
    revenueThisMonth: 4230000,
    commissionEarned: 423000,
    status: 'active',
    contractStartDate: '2025-01-01',
    minimumVolume: 100
  },
  {
    id: 'shopee',
    name: 'Shopee',
    logo: '/partners/shopee-logo.png',
    commissionRate: 0.08,
    voucherTiers: [
      { id: 'shopee-1', pointCost: 75, vndValue: 15000, commissionEarned: 1200 },
      { id: 'shopee-2', pointCost: 150, vndValue: 30000, commissionEarned: 2400 }
    ],
    redemptionsThisMonth: 567,
    revenueThisMonth: 5670000,
    commissionEarned: 453600,
    status: 'active',
    contractStartDate: '2025-01-01',
    minimumVolume: 200
  },
  {
    id: 'be',
    name: 'Be',
    logo: '/partners/be-logo.png',
    commissionRate: 0.12,
    voucherTiers: [
      { id: 'be-1', pointCost: 40, vndValue: 8000, commissionEarned: 960 },
      { id: 'be-2', pointCost: 80, vndValue: 20000, commissionEarned: 2400 }
    ],
    redemptionsThisMonth: 234,
    revenueThisMonth: 1872000,
    commissionEarned: 224640,
    status: 'active',
    contractStartDate: '2025-01-15',
    minimumVolume: 50
  },
  {
    id: 'highlands',
    name: 'Highlands Coffee',
    logo: '/partners/highlands-logo.png',
    commissionRate: 0.15,
    voucherTiers: [
      { id: 'highlands-1', pointCost: 100, vndValue: 20000, commissionEarned: 3000 },
      { id: 'highlands-2', pointCost: 200, vndValue: 50000, commissionEarned: 7500 }
    ],
    redemptionsThisMonth: 189,
    revenueThisMonth: 3780000,
    commissionEarned: 567000,
    status: 'active',
    contractStartDate: '2025-01-10',
    minimumVolume: 75
  },
  {
    id: 'circle-k',
    name: 'Circle K',
    logo: '/partners/circlek-logo.png',
    commissionRate: 0.07,
    voucherTiers: [
      { id: 'circlek-1', pointCost: 60, vndValue: 12000, commissionEarned: 840 }
    ],
    redemptionsThisMonth: 312,
    revenueThisMonth: 3744000,
    commissionEarned: 262080,
    status: 'paused',
    contractStartDate: '2024-12-01',
    minimumVolume: 100
  },
  {
    id: 'vinmart',
    name: 'VinMart',
    logo: '/partners/vinmart-logo.png',
    commissionRate: 0.09,
    voucherTiers: [
      { id: 'vinmart-1', pointCost: 120, vndValue: 30000, commissionEarned: 2700 },
      { id: 'vinmart-2', pointCost: 250, vndValue: 70000, commissionEarned: 6300 }
    ],
    redemptionsThisMonth: 0,
    revenueThisMonth: 0,
    commissionEarned: 0,
    status: 'pending',
    contractStartDate: '2026-02-01',
    minimumVolume: 150
  }
]

export const mockRedemptions: Redemption[] = [
  {
    id: 'r1',
    userId: 'user_123',
    userName: 'Nguyen V.A.',
    partnerId: 'grab',
    partnerName: 'Grab',
    voucherCode: 'FLOW-GRAB-A1B2C3',
    pointsSpent: 50,
    vndValue: 10000,
    commissionEarned: 1000,
    redeemedAt: '2026-01-19T10:30:00Z',
    usedAt: '2026-01-19T14:20:00Z',
    status: 'used'
  },
  {
    id: 'r2',
    userId: 'user_456',
    userName: 'Tran T.B.',
    partnerId: 'shopee',
    partnerName: 'Shopee',
    voucherCode: 'FLOW-SHOPEE-X9Y8Z7',
    pointsSpent: 75,
    vndValue: 15000,
    commissionEarned: 1200,
    redeemedAt: '2026-01-19T09:15:00Z',
    usedAt: null,
    status: 'pending'
  },
  {
    id: 'r3',
    userId: 'user_789',
    userName: 'Le H.C.',
    partnerId: 'be',
    partnerName: 'Be',
    voucherCode: 'FLOW-BE-M3N4O5',
    pointsSpent: 40,
    vndValue: 8000,
    commissionEarned: 960,
    redeemedAt: '2026-01-18T16:45:00Z',
    usedAt: '2026-01-18T18:30:00Z',
    status: 'used'
  }
]

export const mockPartnershipAnalytics: PartnershipAnalytics = {
  totalCommissionEarned: 1930320,
  totalRedemptions: 1725,
  conversionRate: 0.78,
  averageVoucherValue: 25450,
  topPartners: [
    { partnerId: 'highlands', name: 'Highlands Coffee', revenue: 3780000, redemptions: 189 },
    { partnerId: 'shopee', name: 'Shopee', revenue: 5670000, redemptions: 567 },
    { partnerId: 'grab', name: 'Grab', revenue: 4230000, redemptions: 423 },
    { partnerId: 'circlek', name: 'Circle K', revenue: 3744000, redemptions: 312 },
    { partnerId: 'be', name: 'Be', revenue: 1872000, redemptions: 234 }
  ],
  monthlyTrend: [
    { date: '2025-12-19', commission: 145000, redemptions: 98 },
    { date: '2025-12-26', commission: 167000, redemptions: 112 },
    { date: '2026-01-02', commission: 189000, redemptions: 145 },
    { date: '2026-01-09', commission: 223000, redemptions: 178 },
    { date: '2026-01-16', commission: 256000, redemptions: 192 },
    { date: '2026-01-19', commission: 298000, redemptions: 215 }
  ]
}
