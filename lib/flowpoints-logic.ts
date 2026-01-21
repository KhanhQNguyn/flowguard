export interface TripData {
  distance: number
  duration: number
  outcome: 'safe' | 'detour' | 'flooded'
}

export interface UserStats {
  dailyPoints: number
  currentStreak: number
  lastCheckIn: string
}

export function calculateTripReward(
  trip: TripData,
  userStats: UserStats
): { points: number; reason: string; allowed: boolean } {
  // Validation checks
  if (trip.distance < 500) {
    return { points: 0, reason: 'Trip too short (minimum 500m)', allowed: false }
  }

  if (trip.duration < 300) {
    return { points: 0, reason: 'Trip too brief (minimum 5 minutes)', allowed: false }
  }

  if (trip.outcome !== 'safe') {
    return { points: 0, reason: 'Trip outcome not confirmed as safe', allowed: false }
  }

  // Daily limit check
  if (userStats.dailyPoints >= 100) {
    return { points: 0, reason: 'Daily earning limit reached (100 points)', allowed: false }
  }

  // Base trip reward
  const points = 15
  const reason = 'Safe trip completion confirmed'

  return { points, reason, allowed: true }
}

export function calculateDailyBonus(userStats: UserStats): number {
  const today = new Date().toDateString()
  const lastCheckIn = new Date(userStats.lastCheckIn).toDateString()

  if (today === lastCheckIn) return 0
  return 5
}

export function calculateStreakBonus(streak: number): number {
  if (streak >= 7) return 50
  return 0
}

export function getUserTier(totalPoints: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
  if (totalPoints >= 5000) return 'Platinum'
  if (totalPoints >= 2000) return 'Gold'
  if (totalPoints >= 500) return 'Silver'
  return 'Bronze'
}

export function getTierProgress(totalPoints: number): { current: number; next: number; progress: number } {
  if (totalPoints >= 5000) {
    return { current: 5000, next: 5000, progress: 100 }
  }
  if (totalPoints >= 2000) {
    return { current: 2000, next: 5000, progress: ((totalPoints - 2000) / 3000) * 100 }
  }
  if (totalPoints >= 500) {
    return { current: 500, next: 2000, progress: ((totalPoints - 500) / 1500) * 100 }
  }
  return { current: 0, next: 500, progress: (totalPoints / 500) * 100 }
}
