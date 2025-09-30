import { useQuery } from "@tanstack/react-query"
import { LabTechapi as api } from "@/axios-api/lab-tech"
import { PendingReport, LabAnalytics, WeeklyDataItem } from "@/types/lab-tech/lab-reports"

interface LabDashboardResponse {
  bookings: PendingReport[]
  weeklyData: WeeklyDataItem[]
  testCategoryData: WeeklyDataItem[]
}

export function useLabTechnicianDashboard(techId?: string) {
  return useQuery({
    queryKey: ["labDashboard", techId],
    queryFn: async () => {
      if (!techId) throw new Error("Missing technician id")

      const res = await api.get<LabDashboardResponse>(`/technician/${techId}`)
      const allReports = res.data.bookings

      const pendingReports = allReports.filter((r) => r.status === "pending")
      const completedReports = allReports.filter((r) => r.status === "completed")

      const analytics: LabAnalytics = {
        totalTests: allReports.length,
        completedTests: completedReports.length,
        pendingReports: pendingReports.length,
        todayTests: allReports.filter(
          (r) => new Date(r.scheduledDate).toDateString() === new Date().toDateString()
        ).length,
      }

      return {
        pendingReports,
        completedReports,
        analytics,
        weeklyData: res.data.weeklyData,
        testCategoryData: res.data.testCategoryData,
      }
    },
    enabled: !!techId,
  })
}
