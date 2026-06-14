// app/admin/workers/[workerId]/report/page.tsx
"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useWorkerReport } from "@/hooks/admin/workers/useWorkerReport"
import { useDoctors }       from "@/hooks/admin/workers/useDoctors"
import { useNutritionists } from "@/hooks/admin/workers/useNutritionists"
import { usePathologists }  from "@/hooks/admin/workers/usePathologists"
import WorkerReportPage     from "@/components/admin/workers/WorkerReportPage"

export default function WorkerReportRoutePage() {
  const params   = useParams<{ workerId: string }>()
  const workerId = params.workerId

  const { mutate: generateReport, isPending, data: report } = useWorkerReport()

  const { data: doctors       = [] } = useDoctors()
  const { data: nutritionists = [] } = useNutritionists()
  const { data: pathologists  = [] } = usePathologists()

  const worker = [...doctors, ...nutritionists, ...pathologists].find((w) => w.id === workerId)

  useEffect(() => {
    if (workerId) generateReport(workerId)
  }, [workerId, generateReport])

  // Worker comes from cached list queries — resolves in <1ms, no spinner needed
  if (!worker) return null

  // Page renders immediately with worker data.
  // report is undefined while fetching → page shows skeletons for those values.
  return <WorkerReportPage worker={worker} report={report ?? null} isLoading={isPending} />
}
