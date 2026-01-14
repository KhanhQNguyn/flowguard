import type { ReactNode } from "react"
import { AppProvider } from "@/lib/app-context"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DemoControls } from "@/components/demo-controls"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - Desktop */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>

        {/* Demo Controls Sheet */}
        <DemoControls />
      </div>
    </AppProvider>
  )
}
