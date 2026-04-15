import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"
import type { CVStatus } from "@/types/admin/cv"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export interface UpdateCVStatusPayload {
  id:     string
  status: CVStatus
}

export interface UpdateCVStatusResult {
  statusCode: number
  message:    string
  data:       { id: string; status: CVStatus }
  success:    boolean
}

export function useUpdateCVStatus() {
  const token       = useAdminStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation<UpdateCVStatusResult, Error, UpdateCVStatusPayload>({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`${API}/cv/${id}/status`, {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || "Failed to update status.")
      return json as UpdateCVStatusResult
    },
    onSuccess: () => {
      // Keep the list in sync after a status change
      queryClient.invalidateQueries({ queryKey: ["cvs"] })
    },
  })
}
