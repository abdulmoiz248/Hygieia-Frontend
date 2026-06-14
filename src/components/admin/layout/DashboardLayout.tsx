"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { TopNav } from "./NavBar"
import { useAdminStore } from "@/store/admin/useAdminStore"
import Loader from "@/components/loader/loader"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false)
  const [authChecked, setAuthChecked]           = useState(false)

  const { initAuth, isAuthenticated } = useAdminStore()
  const router = useRouter()

  useEffect(() => {
    initAuth()
    setAuthChecked(true)
  }, [initAuth])

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.replace("/login")
    }
  }, [authChecked, isAuthenticated, router])

  if (!authChecked || !isAuthenticated) return <Loader />

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
        <main className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 lg:p-6">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
