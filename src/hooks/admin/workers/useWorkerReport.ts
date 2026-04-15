import { useMutation } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminError } from "@/toasts/AdminToasts"

const BASE_URL = "http://localhost:4000"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkerReport {
  worker: {
    id: string
    role: string
    email: string
  }
  overview: {
    accountAgeDays: number
    unreadNotifications: number
  }
  metrics: {
    totalAppointments: number
    completionRate: number
  }
  insights: string[]
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchWorkerReport(
  userId: string,
  workerId: string,
): Promise<WorkerReport> {
  console.log("[worker-report] payload →", { userId, workerId })

  const res = await fetch(`${BASE_URL}/worker-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workerId }),
  })

  const json = await res.json()
  console.log("[worker-report] response →", json)

  if (!res.ok) throw new Error(json.message || "Failed to generate report")
  return json.data as WorkerReport
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkerReport() {
  const adminId = useAdminStore((s) => s.adminId)

  return useMutation({
    mutationFn: (workerId: string) => {
      if (!adminId) throw new Error("Admin session not found. Please refresh and try again.")
      return fetchWorkerReport(adminId, workerId)
    },
    onError: (err: Error) => {
      adminError(err.message || "Failed to generate worker report.")
    },
  })
}