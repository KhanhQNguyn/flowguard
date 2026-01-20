'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { getUserTier, getTierProgress, calculateTripReward, TripData, UserStats } from '@/lib/flowpoints-logic'
import { DEMO_USER } from '@/lib/constants'

interface TripHistory {
  id: string
  destination: string
  date: string
  pointsEarned: number
  outcome: 'safe' | 'detour' | 'flooded'
}

interface UserContextType {
  userId: string
  userName: string
  userPoints: number
  flowPoints: number
  userTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  tierProgress: { current: number; next: number; progress: number }
  dailyPoints: number
  currentStreak: number
  lastCheckIn: string
  tripHistory: TripHistory[]
  addPoints: (points: number, reason: string) => void
  addFlowPoints: (points: number, reason: string) => void
  completeTripAndReward: (trip: TripData, destination: string) => { points: number; reason: string; allowed: boolean }
  redeemReward: (pointCost: number) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userPoints, setUserPoints] = useState(245)
  const [dailyPoints, setDailyPoints] = useState(35)
  const [currentStreak, setCurrentStreak] = useState(5)
  const [lastCheckIn, setLastCheckIn] = useState(new Date().toISOString())
  const [tripHistory, setTripHistory] = useState<TripHistory[]>([
    {
      id: '1',
      destination: 'Office (District 4)',
      date: new Date(Date.now() - 86400000).toISOString(),
      pointsEarned: 15,
      outcome: 'safe'
    },
    {
      id: '2',
      destination: 'Home (District 1)',
      date: new Date(Date.now() - 172800000).toISOString(),
      pointsEarned: 15,
      outcome: 'safe'
    },
    {
      id: '3',
      destination: 'Vincom (District 7)',
      date: new Date(Date.now() - 259200000).toISOString(),
      pointsEarned: 0,
      outcome: 'detour'
    }
  ])

  const userTier = getUserTier(userPoints)
  const tierProgress = getTierProgress(userPoints)

  const addPoints = (points: number, reason: string) => {
    setUserPoints(prev => prev + points)
    setDailyPoints(prev => prev + points)
    console.log(`[FlowGuard] Added ${points} points: ${reason}`)
  }

  const addFlowPoints = (points: number, reason: string) => {
    setUserPoints(prev => prev + points)
    setDailyPoints(prev => prev + points)
    console.log(`[FlowGuard] Added ${points} FlowPoints: ${reason}`)
  }

  const completeTripAndReward = (trip: TripData, destination: string) => {
    const userStats: UserStats = {
      dailyPoints,
      currentStreak,
      lastCheckIn
    }

    const result = calculateTripReward(trip, userStats)

    if (result.allowed && result.points > 0) {
      addPoints(result.points, result.reason)
      setTripHistory(prev => [
        {
          id: Date.now().toString(),
          destination,
          date: new Date().toISOString(),
          pointsEarned: result.points,
          outcome: trip.outcome
        },
        ...prev
      ])
    }

    return result
  }

  const redeemReward = (pointCost: number): boolean => {
    if (userPoints >= pointCost) {
      setUserPoints(prev => prev - pointCost)
      return true
    }
    return false
  }

  return (
    <UserContext.Provider
      value={{
        userId: DEMO_USER.id,
        userName: DEMO_USER.name,
        userPoints,
        flowPoints: userPoints,
        userTier,
        tierProgress,
        dailyPoints,
        currentStreak,
        lastCheckIn,
        tripHistory,
        addPoints,
        addFlowPoints,
        completeTripAndReward,
        redeemReward
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
