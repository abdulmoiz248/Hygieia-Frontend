"use client"

import { useState, useEffect } from "react"
import LabSidebar from "@/components/lab-tech/dashboard/LabSidebar"
import { LabHeader } from "@/components/lab-tech/dashboard/LabHeader"
import { cn } from "@/lib/utils"
import { useLabStore } from "@/store/lab-tech/labTech"
import useLabTechnicianStore from "@/store/lab-tech/userStore"

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useLabTechnicianStore()
  
  const activeTab = useLabStore((state) => state.activeTab)
  const setActiveTab = useLabStore((state) => state.setActiveTab)


  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAppLoading = loading

  useEffect(() => {
    setMounted(true)
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  if (!mounted || isAppLoading) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LabHeader onMobileMenuClick={() => setMobileOpen(true)} />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <LabSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="relative z-50 w-64 bg-white shadow-lg">
              <LabSidebar
                collapsed={false}
                setCollapsed={setCollapsed}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab)
                  setMobileOpen(false)
                }}
                onMobileClose={() => setMobileOpen(false)}
              />
            </div>
            <div
              className="flex-1 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}

        <main
          className={cn(
            "flex-1 transition-all duration-300 bg-snow-white",
            collapsed ? "md:ml-[80px]" : "md:ml-[280px]"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
