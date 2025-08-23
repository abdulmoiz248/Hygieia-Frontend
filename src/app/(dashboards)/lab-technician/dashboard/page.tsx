"use client"

import { useEffect } from "react"
import { DashboardAnalytics } from "@/components/lab-tech/dashboard/dashboard-analytics"
import { PendingReports } from "@/components/lab-tech/pending-reports/pending-reports"
import { CompletedReports } from "@/components/lab-tech/completed-reports/completed-reports"
import { useLabStore } from "@/store/lab-tech/labTech"

export default function LabPortal() {
  const activeTab = useLabStore((state) => state.activeTab)
 
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardAnalytics />
      case "pending":
        return <PendingReports />
      case "completed":
        return <CompletedReports />
      case "settings":
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        )
      default:
        return <DashboardAnalytics />
    }
  }

  return (
 
     
      <main className="flex-1">{renderContent()}</main>
  
  )
}
