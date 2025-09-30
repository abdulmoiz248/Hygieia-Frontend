"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileCheck } from "lucide-react"
import { useLabTechnicianDashboard } from "@/hooks/useLabTechnicianDashboard"
import Loader from '@/components/loader/loader'

export default function RecentActivity() {
  const { data, isLoading, isError } = useLabTechnicianDashboard()

  const completedReports = data?.completedReports ?? []

  if (isLoading) {
         return (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader />
            </div>
          )
      }

  if (isError) {
    return <p className="p-6 text-red-500">Failed to load recent activity</p>
  }

  return (
    <Card className="border-0 shadow-lg bg-white/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-cool-gray">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {completedReports.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No recent activity yet</p>
        ) : (
          <div className="space-y-4">
            {completedReports.slice(0, 5).map((report, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-xl bg-cool-gray/10 border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-soft-blue">
                  <FileCheck className="w-5 h-5 text-snow-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {`Report completed for ${report.patientName} - ${report.testName}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {report.uploadedAt
                      ? `${new Date(report.scheduledDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })} • ${new Date(report.scheduledDate).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
