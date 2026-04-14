import { useMutation } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export interface AddWorkerPayload {
  name:          string
  role:          string
  personalEmail: string
}

export interface AddWorkerResult {
  message: string
  success: boolean
  email:   string   // generated work email e.g. drsarahjohnson@hygieia.com
  id:      string
}

export function useAddWorker() {
  const token = useAdminStore((s) => s.token)

  return useMutation<AddWorkerResult, Error, AddWorkerPayload>({
    mutationFn: async ({ name, role, personalEmail }) => {
      const res = await fetch(`${API}/auth/register-worker`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ name, role, personalEmail }),
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || "Failed to register worker.")

      return json.data as AddWorkerResult
    },
  })
}
