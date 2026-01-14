"use client"

import { useState } from "react"
import { User, Bell, MapPin, Shield, Moon, Sun, Info, LogOut, ChevronRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const districts = ["District 1", "District 4", "District 7", "Bình Thạnh", "Thủ Đức"]

export function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedDistricts, setSelectedDistricts] = useState(["District 7"])
  const [riskThreshold, setRiskThreshold] = useState(50)

  const toggleDistrict = (district: string) => {
    setSelectedDistricts((prev) => (prev.includes(district) ? prev.filter((d) => d !== district) : [...prev, district]))
  }

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* User Info */}
      <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-lg">FlowGuard User</p>
          <p className="text-sm text-muted-foreground">frankkhanhnguyen@gmail.com</p>
        </div>
      </div>

      {/* Alert Preferences */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Alert Preferences
        </h2>

        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {/* Notifications Toggle */}
          <div className="p-4 flex items-center justify-between">
            <span className="font-medium">Push Notifications</span>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={cn(
                "w-12 h-7 rounded-full transition-colors duration-200 relative",
                notificationsEnabled ? "bg-primary" : "bg-muted",
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                  notificationsEnabled ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>

          {/* District Subscriptions */}
          <div className="p-4">
            <p className="font-medium mb-3">Subscribed Districts</p>
            <div className="flex flex-wrap gap-2">
              {districts.map((district) => (
                <button
                  key={district}
                  onClick={() => toggleDistrict(district)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    selectedDistricts.includes(district)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80",
                  )}
                >
                  {district}
                  {selectedDistricts.includes(district) && <CheckCircle className="w-3 h-3 inline ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Threshold */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Risk Alert Threshold</span>
              <span className="text-sm text-primary font-bold">{riskThreshold} cm</span>
            </div>
            <input
              type="range"
              min={30}
              max={70}
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>30cm (Early)</span>
              <span>70cm (Critical)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Data & Privacy
        </h2>

        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Location Permissions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#289359]">Enabled</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <span className="font-medium">Report History</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">3 reports</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Appearance</h2>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium">{isDarkMode ? "Dark" : "Light"} Mode</span>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "w-12 h-7 rounded-full transition-colors duration-200 relative",
                isDarkMode ? "bg-primary" : "bg-muted",
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                  isDarkMode ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="space-y-3">
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">About FlowGuard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">v1.0.0</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 text-[#e03a35] hover:bg-muted/50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
