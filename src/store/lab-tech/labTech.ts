import { create } from "zustand"
import type { PendingReport, LabAnalytics, LabTest, BookedLabTest,WeeklyDataItem } from "@/types/lab-tech/lab-reports"
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
weeklyData:WeeklyDataItem[]
testCategoryData:WeeklyDataItem[]
  setActiveTab: (tab: string) => void
  setLoading: (loading: boolean) => void
uploadReport:  (id:any, file:any, reportValues: any, type: string) => void
  getPendingCount: () => number
  getCompletedCount: () => number
  getTotalTests: () => number
  setLabData: (data:any) =>void,
}

export const useLabStore = create<LabStore>((set, get) => ({
  activeTab: "dashboard",
  pendingReports: [],
  completedReports: [],
  weeklyData:[],
  analytics: {
    totalTests: 0,
    completedTests: 0,
    pendingReports: 0,
    todayTests: 0,
    
  },
  testCategoryData:[],

  bookedTests: [],
  labTests: [],
  isLoading: false,
  isInitialized: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),

  uploadReport: async (id:any, file:any, reportValues: any, type: string) => {

  try {
   
    let file_url:string
    if (type === "scan") {
      const formData = new FormData()
      formData.append("file", file)
    
      await api.post(`/${id}/upload-scan`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    } else {
      // for other report types, send JSON body
      const body = reportValues ? { resultData:reportValues.results, title: `${file?.name || "Report"}` } : {}
      const res= await api.post(`/${id}/upload-result`, body)
    
      if(res.data){
  
file_url=res.data.file_url
      }
    }

    // Update store after successful upload
    set((state) => {
      const reportToComplete = state.pendingReports.find((r) => r.id === id)
      if (!reportToComplete) return state

      const completedReport: PendingReport = {
        ...reportToComplete,
        reportFile: type=='scan'?file:file_url,
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
  }
},


  getPendingCount: () => get().pendingReports.length,
  getCompletedCount: () => get().completedReports.length,
  getTotalTests: () => get().pendingReports.length + get().completedReports.length,

  
  setLabData: (data) => {
    const pending = data.pendingReports || []
    const completed = data.completedReports || []
    const analytics = {
      totalTests: data.analytics.totalTests || 0,
      completedTests: data.analytics.completedTests || 0,
      pendingReports: data.analytics.pendingReports || 0,
      todayTests: data.analytics.todayTests || 0,
}


    set({
      pendingReports: pending,
      completedReports: completed,
      analytics,
      weeklyData: data.weeklyData,
      testCategoryData: data.testCategoryData,
    })
  },

}))

