// ─── useLabTests ──────────────────────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"
import {
  fetchLabTests,
  createLabTest,
  updateLabTest,
  deleteLabTest,
} from "@/api/admin/labTests.api"
import type { LabTestFormData } from "@/types/admin/labTests"

const QUERY_KEY = ["lab-tests"]

export function useLabTests() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchLabTests,
  })
}

export function useCreateLabTest() {
  const { adminId } = useAdminStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: LabTestFormData) => createLabTest(adminId!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateLabTest() {
  const { adminId } = useAdminStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LabTestFormData> }) =>
      updateLabTest(id, adminId!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteLabTest() {
  const { adminId } = useAdminStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteLabTest(id, adminId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
