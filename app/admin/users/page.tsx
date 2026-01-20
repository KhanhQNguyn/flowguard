'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Medal, X, Activity, Map, Circle } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  district: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  points: number
  reportsSubmitted: number
  tripsCompleted: number
  joinedDate: string
  lastActive: string
  status: 'active' | 'inactive'
}

const getTierEmoji = (tier: string) => {
  switch (tier) {
    case 'Bronze':
      return '🥉'
    case 'Silver':
      return '🥈'
    case 'Gold':
      return '🥇'
    case 'Platinum':
      return '💎'
    default:
      return '❓'
  }
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const users: User[] = [
    {
      id: 1,
      name: 'Frank Khanh',
      email: 'frankkhanhnguyen@gmail.com',
      district: 'District 7',
      tier: 'Gold',
      points: 2850,
      reportsSubmitted: 12,
      tripsCompleted: 45,
      joinedDate: '2024-01-15',
      lastActive: '2 minutes ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Linh Tran',
      email: 'linh.tran@flowguard.local',
      district: 'District 4',
      tier: 'Silver',
      points: 1560,
      reportsSubmitted: 8,
      tripsCompleted: 32,
      joinedDate: '2024-02-20',
      lastActive: '1 hour ago',
      status: 'active'
    },
    {
      id: 3,
      name: 'Duc Pham',
      email: 'duc.pham@flowguard.local',
      district: 'District 7',
      tier: 'Bronze',
      points: 450,
      reportsSubmitted: 2,
      tripsCompleted: 8,
      joinedDate: '2024-03-10',
      lastActive: '3 days ago',
      status: 'inactive'
    }
  ]

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return <Medal className="w-4 h-4 text-amber-600" />
      case 'Silver':
        return <Medal className="w-4 h-4 text-gray-400" />
      case 'Gold':
        return <Medal className="w-4 h-4 text-yellow-500" />
      case 'Platinum':
        return <Circle className="w-4 h-4 text-purple-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-800'
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1 sm:mb-2">Community Members</h1>
          <p className="text-sm sm:text-base text-neutral-600">Manage active users and their contributions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="p-3 sm:p-4">
            <p className="text-xs text-neutral-500 mb-1">Total Users</p>
            <p className="text-xl sm:text-2xl font-bold">{users.length}</p>
          </Card>
          <Card className="p-3 sm:p-4">
            <p className="text-xs text-neutral-500 mb-1">Active Today</p>
            <p className="text-xl sm:text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
          </Card>
          <Card className="p-3 sm:p-4">
            <p className="text-xs text-neutral-500 mb-1">Total Reports</p>
            <p className="text-xl sm:text-2xl font-bold">{users.reduce((sum, u) => sum + u.reportsSubmitted, 0)}</p>
          </Card>
        </div>

        {/* Users List */}
        <div className="space-y-2 sm:space-y-3">
          {users.map((user) => (
            <Card
              key={user.id}
              className="p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#289359] to-[#1f6e43] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user.name.charAt(0)}
                    </span>
                    <h3 className="font-semibold text-neutral-900 text-sm line-clamp-1">{user.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 flex items-center gap-1 ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      <Circle className="w-2 h-2" fill="currentColor" />
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1">{user.email}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                    <span className="flex items-center gap-1">
                      <Medal className="w-3 h-3" />
                      {getTierIcon(user.tier)} {user.tier}
                    </span>
                    <span className="flex items-center gap-1 text-purple-600">
                      <Activity className="w-3 h-3" />
                      {user.points} pts
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail View */}
        {selectedUser && (
          <Card className="mt-4 sm:mt-6 p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUser(null)}
              className="mb-3 sm:mb-4 text-neutral-500 hover:text-neutral-700 text-sm flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Close
            </button>
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#289359] to-[#1f6e43] flex items-center justify-center text-white text-lg sm:text-2xl font-bold flex-shrink-0">
                {selectedUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold">{selectedUser.name}</h2>
                <p className="text-xs sm:text-sm text-neutral-600">{selectedUser.email}</p>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  {selectedUser.district} • Joined {selectedUser.joinedDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-neutral-50 rounded">
                <p className="text-xs text-neutral-500 mb-1">Tier</p>
                <p className="text-sm sm:text-base font-semibold flex items-center gap-1">
                  {getTierIcon(selectedUser.tier)} {selectedUser.tier}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-neutral-50 rounded">
                <p className="text-xs text-neutral-500 mb-1">Points</p>
                <p className="text-sm sm:text-base font-semibold flex items-center gap-1">
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  {selectedUser.points}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-neutral-50 rounded">
                <p className="text-xs text-neutral-500 mb-1">Reports</p>
                <p className="text-sm sm:text-base font-semibold">{selectedUser.reportsSubmitted}</p>
              </div>
              <div className="p-2 sm:p-3 bg-neutral-50 rounded">
                <p className="text-xs text-neutral-500 mb-1">Trips</p>
                <p className="text-sm sm:text-base font-semibold flex items-center gap-1">
                  <Map className="w-3 h-3 sm:w-4 sm:h-4" />
                  {selectedUser.tripsCompleted}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-neutral-50 rounded">
                <p className="text-xs text-neutral-500 mb-1">Status</p>
                <p className="text-sm sm:text-base font-semibold flex items-center gap-1">
                  <Circle className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="currentColor" style={{color: selectedUser.status === 'active' ? '#289359' : '#9ca3af'}} />
                  {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-neutral-50 rounded">
                <p className="text-xs text-neutral-500 mb-1">Last Active</p>
                <p className="text-sm sm:text-base font-semibold">{selectedUser.lastActive}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
