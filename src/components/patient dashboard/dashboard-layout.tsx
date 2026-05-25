"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import Loader from "../loader/loader"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isChatPage = pathname?.startsWith("/patient/chat")

  const { loading, hasFetchedProfile } = usePatientProfileStore()

  if (loading || !hasFetchedProfile)
    return <Loader />

  return (
    <div className="flex h-screen bg-snow-white">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <TopNav onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className={`flex-1 min-h-0 transition-all duration-300 ease-in-out ${
          isChatPage ? "overflow-hidden p-4 lg:p-6" : "overflow-y-auto p-4 lg:p-6"
        }`}>
          <div className={`max-w-full mx-auto ${isChatPage ? "h-full min-h-0 flex flex-col" : ""}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}