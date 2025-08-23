import { create } from "zustand"

import useLabTechnicianStore from "./userStore"
import type { PendingReport, LabAnalytics, LabTest, BookedLabTest } from "@/types/lab-tech/lab-reports"
import { LabTechapi as api } from "@/axios-api/lab-tech"



interface LabStore {
  activeTab: string
  pendingReports: PendingReport[]
  completedReports: PendingReport[]
  analytics: LabAnalytics
  bookedTests: BookedLabTest[]
  labTests: LabTest[]
  isLoading: boolean
  isInitialized: boolean

  setActiveTab: (tab: string) => void
  setLoading: (loading: boolean) => void
uploadReport:  (id:any, file:any, reportValues: any, type: string) => void
  getPendingCount: () => number
  getCompletedCount: () => number
  getTotalTests: () => number
  initialize: () => Promise<void>
}

export const useLabStore = create<LabStore>((set, get) => ({
  activeTab: "dashboard",
  pendingReports: [],
  completedReports: [],
  analytics: {
    totalTests: 0,
    completedTests: 0,
    pendingReports: 0,
    todayTests: 0,
    weeklyGrowth: 0,
    monthlyRevenue: 0,
  },
  bookedTests: [],
  labTests: [],
  isLoading: false,
  isInitialized: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),

uploadReport: async (id:any, file:any, reportValues: any, type: string) => {
  set({ isLoading: true })
  try {
    if (type === "scan") {
      const formData = new FormData()
      formData.append("file", file)
      // optional doctor name if needed
      // formData.append("doctor_name", "Dr. Example")

      await api.post(`/${id}/upload-scan`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    } else {
      // for other report types, send JSON body
      const body = reportValues ? { ...reportValues, title: `${file?.name || "Report"}` } : {}
      await api.post(`/${id}/upload-result`, body)
    }

    // Update store after successful upload
    set((state) => {
      const reportToComplete = state.pendingReports.find((r) => r.id === id)
      if (!reportToComplete) return state

      const completedReport: PendingReport = {
        ...reportToComplete,
        reportFile: file,
        status: "completed",
        uploadedAt: new Date(),
      }

      const newPendingReports = state.pendingReports.filter((r) => r.id !== id)
      const newCompletedReports = [...state.completedReports, completedReport]

      const updatedAnalytics = {
        ...state.analytics,
        completedTests: newCompletedReports.length,
        pendingReports: newPendingReports.length,
        totalTests: newPendingReports.length + newCompletedReports.length,
      }

      return {
        pendingReports: newPendingReports,
        completedReports: newCompletedReports,
        analytics: updatedAnalytics,
      }
    })
  } catch (err) {
    console.error("Upload failed:", err)
  } finally {
    set({ isLoading: false })
  }
},


  getPendingCount: () => get().pendingReports.length,
  getCompletedCount: () => get().completedReports.length,
  getTotalTests: () => get().pendingReports.length + get().completedReports.length,

  initialize: async () => {
    const techId = useLabTechnicianStore.getState().profile.id
    if (!techId) return
    set({ isLoading: true })

    try {
      const res = await api.get<PendingReport[]>(`/technician/${techId}`)
      const allReports = res.data

      const pendingReports = allReports.filter(r => r.status === "pending")
      const completedReports = allReports.filter(r => r.status === "completed")

      const analytics: LabAnalytics = {
        totalTests: allReports.length,
        completedTests: completedReports.length,
        pendingReports: pendingReports.length,
        todayTests: allReports.filter(
          r => new Date(r.scheduledDate).toDateString() === new Date().toDateString()
        ).length,
        weeklyGrowth: 12.5, // calculate if needed
        monthlyRevenue: 45600, // calculate if needed
      }

      set({ pendingReports, completedReports, analytics, isInitialized: true })
    } catch (err) {
      console.error("Failed to fetch lab data:", err)
    } finally {
      set({ isLoading: false })
    }
  },
}))

// Auto-fetch when store is first imported
useLabStore.getState().initialize()


