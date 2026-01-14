"use client"

import { Home, Map, Bell, Camera, User } from "lucide-react"
import { useApp, type TabType } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "map", label: "Map", icon: Map },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "report", label: "Report", icon: Camera },
  { id: "profile", label: "Profile", icon: User },
]

export function BottomNav() {
  const { activeTab, setActiveTab, alerts } = useApp()
  const unreadCount = alerts.filter((a) => !a.isRead).length

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const showBadge = tab.id === "alerts" && unreadCount > 0

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="relative">
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e03a35] text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className={cn("text-xs mt-1 font-medium", isActive && "font-semibold")}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
