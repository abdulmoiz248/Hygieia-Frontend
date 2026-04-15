import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registerWorker } from "@/api/admin/workers.api"
import { Worker, Role } from "@/types/admin/workers"
import { doctorsQueryKey } from "./useDoctors"
import { nutritionistsQueryKey } from "./useNutritionists"
import { pathologistsQueryKey } from "./usePathologists"

// Maps the API role string back to the frontend Role used as the cache key
const roleFromApiValue: Record<string, Role> = {
  "doctor":         "doctor",
  "nutritionist":   "nutritionist",
  "lab-technician": "pathologist",
}

const queryKeyByRole: Record<Role, readonly unknown[]> = {
  doctor:       doctorsQueryKey,
  nutritionist: nutritionistsQueryKey,
  pathologist:  pathologistsQueryKey,
}

// Matches RegisterWorkerDto exactly
export interface RegisterWorkerPayload {
  name:          string
  role:          string   // "doctor" | "nutritionist" | "lab-technician"
  personalEmail: string
}

interface Options {
  onSuccess?: (worker: Worker) => void
  onError?:   (err: Error) => void
}

export function useRegisterWorker({ onSuccess, onError }: Options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterWorkerPayload) => registerWorker(payload),

    onSuccess: (data, variables) => {
      const frontendRole = roleFromApiValue[variables.role] ?? "doctor"

      const stub: Worker = {
        _id:             data.id,
        id:              data.id,
        name:            variables.name,
        email: variables.personalEmail,
        personal_email:  variables.personalEmail,
        phone:           "",
        specialization:  "",
        gender:          "",
        dateofbirth:     "",
        bio:             "",
        consultationFee: 0,
        experienceYears: 0,
        role:            frontendRole,
        img:             "",
        rating:          0,
        createdAt:       new Date().toISOString(),
        certifications:  [],
        education:       [],
        languages:       [],
        workingHours:    [],
      }

      queryClient.setQueryData<Worker[]>(queryKeyByRole[frontendRole], (prev = []) => [
        ...prev,
        stub,
      ])

      onSuccess?.(stub)
    },

    onError: (err: Error) => onError?.(err),
  })
}
