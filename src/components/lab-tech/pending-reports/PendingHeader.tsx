"use client"

import { Badge } from "@/components/ui/badge"
import { useLabTechnicianDashboard } from "@/hooks/useLabTechnicianDashboard"
import useLabTechnicianStore from "@/store/lab-tech/userStore" 
import Loader from '@/components/loader/loader'

export default function PendingHeader() {
 
  const techId = useLabTechnicianStore((state) => state.profile?.id)

  const { data, isLoading, isError } = useLabTechnicianDashboard(techId)

  const currentPendingCount = data?.pendingReports?.length ?? 0

  if (isLoading) {
         return (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader />
            </div>
          )
      }

  if (isError) {
    return <p className="mb-4 pb-3 text-red-500">Failed to load pending reports</p>
  }

  return (
    <div className="mb-4 pb-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-soft-coral drop-shadow-sm">
            Pending Reports
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage and upload pending lab test reports
          </p>
        </div>

        {currentPendingCount > 0 && (
          <Badge
            variant="outline"
            className="text-sm sm:text-base bg-soft-blue text-snow-white px-3 py-1 sm:py-2 font-medium animate-pulse hover:scale-105 transition-transform duration-300 self-start sm:self-center"
          >
            {currentPendingCount} pending reports
          </Badge>
        )}
      </div>

      <div className="mt-3">
        <div className="h-2 sm:h-3 w-full bg-soft-coral rounded-full overflow-hidden">
          <div
            className="h-full bg-soft-blue animate-pulse"
            style={{ width: `${Math.min(currentPendingCount * 10, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
