# FlowGuard - Intelligent Flood Warning & Safety Platform

A mobile-first citizen safety application that provides real-time flood risk detection, intelligent routing, and crowdsourced reporting for Ho Chi Minh City. Built with Next.js, React, and Tailwind CSS.

## Features

**Citizen Features:**
- Real-time flood risk assessment by district
- Intelligent safe routing during floods
- Crowdsourced flood reports and verification
- Rewards system (FlowPoints) for community contributions
- User profile and trip history
- District monitoring and alerts

**Admin Features:**
- Real-time dashboard with flood risk analytics
- Sensor management and maintenance tracking
- User management and activity monitoring
- Partnership and reward management
- Interactive map view of flood risks
- Report moderation and analysis

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **State Management:** React Context API, SWR for data fetching
- **Routing:** Next.js App Router with route groups
- **Design System:** iOS-native mobile-first UI with green (#289359) brand color

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flowguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables** (if needed)
   ```bash
   cp .env.example .env.local
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
flowguard/
├── app/
│   ├── (citizen)/           # Citizen user flows
│   │   ├── home/           # Dashboard with risk indicators
│   │   ├── navigate/       # Safe routing
│   │   ├── report/         # Flood reporting
│   │   ├── rewards/        # FlowPoints & redemption
│   │   └── profile/        # User profile
│   ├── admin/              # Admin dashboard
│   │   ├── dashboard/      # Analytics overview
│   │   ├── map/            # Interactive risk map
│   │   ├── sensors/        # Sensor management
│   │   ├── users/          # User management
│   │   └── reports/        # Report moderation
│   └── layout.tsx
├── components/
│   ├── shared/             # Reusable components
│   ├── home/               # Homepage components
│   ├── navigate/           # Navigation components
│   ├── rewards/            # Rewards components
│   ├── admin/              # Admin components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── contexts/           # React contexts
│   ├── flood-logic.ts      # Risk calculation algorithm
│   ├── route-engine.ts     # Route optimization
│   ├── data/               # Mock data
│   └── types/              # TypeScript types
└── public/                 # Static assets
```

## How It Works

### User Flow
1. **Home Screen** - View current district flood risk, water level, rain intensity, tide level, and crowdsourced reports
2. **District Selection** - Monitor multiple districts simultaneously
3. **Navigation** - Get safe route recommendations during floods
4. **Reporting** - Report flooding with photos and location
5. **Rewards** - Earn FlowPoints for verified reports, redeem for vouchers

### Risk Calculation
- Analyzes water level, rain intensity, tide levels, and citizen reports
- Returns risk level (LOW/MEDIUM/HIGH) with detailed reasoning
- Updates every 30 seconds from sensor network

### Citizen Rewards
- **Report Flood:** 100 FlowPoints
- **Verify Report:** 50 FlowPoints  
- **Complete Safe Route:** 25 FlowPoints
- Redeem for partner vouchers (food, transport, utilities)

## Demo Mode

Press these keyboard shortcuts to simulate different flood scenarios:

- **1** - Toggle Low Risk scenario
- **2** - Toggle Medium Risk scenario
- **3** - Toggle High Risk scenario
- **H** - Hide/show demo control panel

Demo mode appears as a floating card in the bottom-right corner. Settings persist across page reloads.

## Navigation

**Citizen App:**
- Home (`/home`) - Dashboard
- Navigate (`/navigate`) - Routing
- Report (`/report`) - Submit flood reports
- Rewards (`/rewards`) - Points & redemption
- Profile (`/profile`) - User settings

**Admin App:**
- Dashboard (`/admin/dashboard`) - Analytics
- Map (`/admin/map`) - Risk visualization
- Sensors (`/admin/sensors`) - Device management
- Users (`/admin/users`) - User accounts
- Reports (`/admin/reports`) - Moderation queue

## Design System

- **Primary Color:** #289359 (Dark Green)
- **Typography:** System fonts (SF Pro Display on iOS, Segoe UI on Android)
- **Spacing:** Tailwind scale (4px base unit)
- **Components:** shadcn/ui + custom iOS-native styling
- **Mobile First:** Optimized for 320px-428px viewport

## Development

### Adding a New Feature
1. Create component in `components/`
2. Add context if needed in `lib/contexts/`
3. Wire in appropriate page in `app/`
4. Add mock data in `lib/data/` if required

### Styling Guidelines
- Use Tailwind classes (prefer utility-first approach)
- Mobile-first responsive design
- iOS-native feel with smooth transitions
- Minimum tap target: 44px

### Component Patterns
Most components follow this structure:
```tsx
'use client'
import { useContext } from 'react'
import { useApp } from '@/lib/contexts/app-context'

export function ComponentName() {
  const { data } = useApp()
  return <div>...</div>
}
```

## Deployment

Deploy to Vercel for best Next.js experience:
```bash
npm run build
vercel deploy
```

Or use traditional hosting with `npm run build && npm start`

## Browser Support

- iOS 14+
- Android 10+
- Chrome, Safari, Edge (latest versions)

## Performance

- Next.js App Router for optimal code splitting
- Server components where possible
- SWR for efficient data fetching and caching
- Lazy loading for images and modals
- Optimized bundle size (<150KB gzipped)

## Troubleshooting

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**Styles not loading:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

**Demo mode not appearing:**
Check browser console for errors. Ensure localStorage is enabled.

## Support

For issues or questions:
- Check existing documentation in `/docs` folder
- Review component implementations in `/components`
- Test in demo mode to isolate UI/data issues

## License

Private - FlowGuard Development Team

## Team

Built by v0 with Vietnamese-focused design for Ho Chi Minh City flood safety.
