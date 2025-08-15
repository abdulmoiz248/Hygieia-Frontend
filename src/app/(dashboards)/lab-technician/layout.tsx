"use client"

import { useState, useEffect } from "react"
import LabSidebar from "@/components/lab-tech/dashboard/LabSidebar"
import { LabHeader } from "@/components/lab-tech/dashboard/LabHeader"
import { cn } from "@/lib/utils"
import { useLabStore } from "@/store/lab-tech/labTech"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeTab = useLabStore((state) => state.activeTab)
  const setActiveTab = useLabStore((state) => state.setActiveTab)

  // Close sidebar with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <LabHeader onMobileMenuClick={() => setMobileOpen(true)} />

      {/* Body */}
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <LabSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            activeTab={activeTab}
            onTabChange={setActiveTab}
             
          />
        </div>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Sidebar panel */}
            <div className="relative z-50 w-64 bg-white shadow-lg">
              <LabSidebar
                collapsed={false}
                setCollapsed={setCollapsed}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab)
                  setMobileOpen(false) // closes after selecting tab
                }}
                 onMobileClose={() => setMobileOpen(false)}
              />
            </div>

            {/* Overlay */}
            <div
              className="flex-1 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}

        {/* Main content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            collapsed ? "md:ml-[80px]" : "md:ml-[280px]"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
