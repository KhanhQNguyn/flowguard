"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import { MOCK_USER, type User } from "./mock-data"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    name: string
    email: string
    password: string
    phone: string
    district: string
  }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser(MOCK_USER)
    setIsLoading(false)
    return true
  }, [])

  const register = useCallback(
    async (data: { name: string; email: string; password: string; phone: string; district: string }) => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setUser({
        ...MOCK_USER,
        name: data.name,
        email: data.email,
        phone: data.phone,
        district: data.district,
        avatarInitials: data.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      })
      setIsLoading(false)
      return true
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
