import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { PendingReport, LabAnalytics, BookedLabTest, LabTest } from "@/types/lab-tech/lab-reports"


interface LabStore {
  // State
   setActiveTab: (tab: string) => void
  activeTab: string
  pendingReports: PendingReport[]
  completedReports: PendingReport[]
  analytics: LabAnalytics
  bookedTests: BookedLabTest[]
  labTests: LabTest[]
  isLoading: boolean
  isInitialized: boolean

  // Actions
  uploadReport: (id: string, file: File) => void
  setLoading: (loading: boolean) => void
  initializeMockData: () => void

  getPendingCount: () => number
  getCompletedCount: () => number
  getTotalTests: () => number
}

export const useLabStore = create<LabStore>()(
  persist(
    (set, get) => ({
      // Initial state
        activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),
      pendingReports: [],
      completedReports: [],
      analytics: {
        totalTests: 0,
        completedTests: 0,
        pendingReports: 0,
        todayTests: 0,
        weeklyGrowth: 12.5,
        monthlyRevenue: 45600,
      },
      bookedTests: [],
      labTests: [],
      isLoading: false,
      isInitialized: false,

      uploadReport: (id, file) =>
        set((state) => {
          const reportToComplete = state.pendingReports.find((report) => report.id === id)
          if (!reportToComplete) return state

          const completedReport: PendingReport = {
            ...reportToComplete,
            reportFile: file,
            status: "completed",
            uploadedAt: new Date(),
          }

          const newPendingReports = state.pendingReports.filter((report) => report.id !== id)
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
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      getPendingCount: () => get().pendingReports.length,
      getCompletedCount: () => get().completedReports.length,
      getTotalTests: () => get().pendingReports.length + get().completedReports.length,

      initializeMockData: () => {
        const state = get()
        if (state.isInitialized) return // Don't reinitialize if already done

        const mockLabTests: LabTest[] = [
          {
            id: "test1",
            name: "Complete Blood Count",
            description: "Comprehensive blood analysis",
            price: 45,
            duration: "2-4 hours",
            category: "Hematology",
            preparationInstructions: ["Fast for 8 hours", "Avoid alcohol 24 hours prior"],
          },
          {
            id: "test2",
            name: "Lipid Profile",
            description: "Cholesterol and triglyceride levels",
            price: 35,
            duration: "1-2 hours",
            category: "Biochemistry",
          },
        ]

        const mockPendingReports: PendingReport[] = [
          {
            id: "1",
            testId: "test1",
            testName: "Complete Blood Count",
            patientName: "John Doe",
            scheduledDate: new Date("2024-01-15"),
            scheduledTime: "09:00",
            status: "pending",
            priority: "high",
          },
          {
            id: "2",
            testId: "test2",
            testName: "Lipid Profile",
            patientName: "Jane Smith",
            scheduledDate: new Date("2024-01-14"),
            scheduledTime: "10:30",
            status: "pending",
            priority: "medium",
          },
          {
            id: "3",
            testId: "test1",
            testName: "Thyroid Function Test",
            patientName: "Mike Johnson",
            scheduledDate: new Date("2024-01-13"),
            scheduledTime: "11:00",
            status: "pending",
            priority: "low",
          },
          {
            id: "4",
            testId: "test2",
            testName: "Liver Function Test",
            patientName: "Sarah Wilson",
            scheduledDate: new Date("2024-01-16"),
            scheduledTime: "14:00",
            status: "pending",
            priority: "high",
          },
          {
            id: "5",
            testId: "test1",
            testName: "Kidney Function Test",
            patientName: "Robert Brown",
            scheduledDate: new Date("2024-01-12"),
            scheduledTime: "15:30",
            status: "pending",
            priority: "medium",
          },
        ]

        const mockCompletedReports: PendingReport[] = [
          {
            id: "c1",
            testId: "test1",
            testName: "Blood Sugar Test",
            patientName: "Alice Cooper",
            scheduledDate: new Date("2024-01-10"),
            scheduledTime: "09:00",
            status: "completed",
            priority: "medium",
            uploadedAt: new Date("2024-01-11"),
          },
          {
            id: "c2",
            testId: "test2",
            testName: "Cholesterol Test",
            patientName: "David Lee",
            scheduledDate: new Date("2024-01-09"),
            scheduledTime: "10:00",
            status: "completed",
            priority: "low",
            uploadedAt: new Date("2024-01-10"),
          },
        ]

        const mockAnalytics: LabAnalytics = {
          totalTests: mockPendingReports.length + mockCompletedReports.length,
          completedTests: mockCompletedReports.length,
          pendingReports: mockPendingReports.length,
          todayTests: 23,
          weeklyGrowth: 12.5,
          monthlyRevenue: 45600,
        }

        set({
          pendingReports: mockPendingReports,
          completedReports: mockCompletedReports,
          analytics: mockAnalytics,
          labTests: mockLabTests,
          isInitialized: true,
        })
      },
    }),
    {
      name: "lab-store", // unique name for localStorage
      partialize: (state) => ({
        pendingReports: state.pendingReports,
        completedReports: state.completedReports,
        analytics: state.analytics,
        isInitialized: state.isInitialized,
      }),
    },
  ),
)
