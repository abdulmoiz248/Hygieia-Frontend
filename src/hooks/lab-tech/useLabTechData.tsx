import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { LabTechapi as api } from "@/axios-api/lab-tech"

export const useLabTechData = (id: string) => {
 

  return useQuery({
    queryKey: ['labData', id],
    queryFn: async () => {
      if (!id) return null

      const res = await api.get(`/technician/${id}`)
      const allReports = res.data.bookings || []

      const pendingReports = allReports.filter((r: any) => r.status === 'pending')
      const completedReports = allReports.filter((r: any) => r.status === 'completed')

      const analytics = {
        totalTests: allReports.length,
        completedTests: completedReports.length,
        pendingReports: pendingReports.length,
        todayTests: allReports.filter(
          (r: any) =>
            new Date(r.scheduledDate).toDateString() === new Date().toDateString()
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
    enabled: !!id,
  })
}
