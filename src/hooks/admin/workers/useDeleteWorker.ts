import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteWorker } from "@/api/admin/workers.api"
import { Worker, Role } from "@/types/admin/workers"
import { doctorsQueryKey } from "./useDoctors"
import { nutritionistsQueryKey } from "./useNutritionists"
import { pathologistsQueryKey } from "./usePathologists"

const queryKeyByRole = {
  doctor:       doctorsQueryKey,
  nutritionist: nutritionistsQueryKey,
  pathologist:  pathologistsQueryKey,
}

interface Variables {
  email: string
  workerId: string
  role: Role
}

interface Options {
  onSuccess?: () => void
  onError?: (err: Error) => void
}

export function useDeleteWorker({ onSuccess, onError }: Options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email }: Variables) => deleteWorker({ email }),

    onSuccess: (_, { workerId, role }) => {
      queryClient.setQueryData<Worker[]>(queryKeyByRole[role], (prev = []) =>
        prev.filter((w) => w._id !== workerId)
      )
      onSuccess?.()
    },

    onError: (err: Error) => onError?.(err),
  })
}
