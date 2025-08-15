"use client"

import { useState } from "react"
import LabSidebar from "@/components/lab-tech/dashboard/LabSidebar"
import { LabHeader } from "@/components/lab-tech/dashboard/LabHeader"
import { cn } from "@/lib/utils"
import { useLabStore } from "@/store/lab-tech/labTech"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeTab = useLabStore((state) => state.activeTab)
  const setActiveTab = useLabStore((state) => state.setActiveTab)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed header at the top */}
      <LabHeader onMobileMenuClick={() => setMobileOpen(true)} />

      {/* Body: sidebar + content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <div className="hidden md:block">
          <LabSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Sidebar (mobile) overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 bg-white shadow-lg">
              <LabSidebar
                collapsed={false}
                setCollapsed={setCollapsed}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab)
                  setMobileOpen(false)
                }}
              />
            </div>
            <div
              className="flex-1 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}

        {/* Main content */}
        <main
  className={cn(
    "flex-1  transition-all duration-300",
    collapsed ? "md:ml-[80px]" : "md:ml-[280px]"
  )}
>



          {children}
        </main>
      </div>
    </div>
  )
}
