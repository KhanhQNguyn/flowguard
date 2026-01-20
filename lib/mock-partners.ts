export interface Partner {
  id: string
  name: string
  category: 'transport' | 'ecommerce' | 'food' | 'entertainment'
  pointCost: number
  vndValue: number
  description: string
  active: boolean
  logo: string
  logoUrl?: string
}

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'grab',
    name: 'Grab',
    category: 'transport',
    pointCost: 50,
    vndValue: 5000,
    description: '5,000₫ discount on your next ride',
    active: true,
    logo: 'G',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Grab_%28company%29_logo.svg/2560px-Grab_%28company%29_logo.svg.png'
  },
  {
    id: 'shopee',
    name: 'Shopee',
    category: 'ecommerce',
    pointCost: 100,
    vndValue: 10000,
    description: '10,000₫ voucher for any purchase',
    active: true,
    logo: 'S',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Shopee_logo.svg/2560px-Shopee_logo.svg.png'
  },
  {
    id: 'be',
    name: 'Be',
    category: 'transport',
    pointCost: 75,
    vndValue: 7500,
    description: '7,500₫ off your Be ride',
    active: true,
    logo: 'B',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Be_Mobility_-_Logo.svg/1280px-Be_Mobility_-_Logo.svg.png'
  },
  {
    id: 'grabfood',
    name: 'GrabFood',
    category: 'food',
    pointCost: 80,
    vndValue: 8000,
    description: '8,000₫ off your food order',
    active: true,
    logo: 'F',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Grab_%28company%29_logo.svg/2560px-Grab_%28company%29_logo.svg.png'
  },
  {
    id: 'lazada',
    name: 'Lazada',
    category: 'ecommerce',
    pointCost: 150,
    vndValue: 15000,
    description: '15,000₫ voucher for purchases over 100,000₫',
    active: true,
    logo: 'L',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Lazada_logo.svg/2560px-Lazada_logo.svg.png'
  },
  {
    id: 'cgv',
    name: 'CGV Cinema',
    category: 'entertainment',
    pointCost: 200,
    vndValue: 20000,
    description: '20,000₫ off movie tickets',
    active: true,
    logo: 'C',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/CGV_Cinemas_logo.svg/2560px-CGV_Cinemas_logo.svg.png'
  }
]

export function getPartnersByCategory(category: Partner['category']): Partner[] {
  return MOCK_PARTNERS.filter(p => p.category === category && p.active)
}

export function getAffordableRewards(points: number): Partner[] {
  return MOCK_PARTNERS.filter(p => p.pointCost <= points && p.active)
}
