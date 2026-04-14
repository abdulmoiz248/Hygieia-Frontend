import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export function useDeleteCV() {
  const token       = useAdminStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API}/cv/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to delete CV.")
    },
    onSuccess: () => {
      // Invalidate so the list stays in sync with the server
      queryClient.invalidateQueries({ queryKey: ["cvs"] })
    },
  })
}
