import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  createEntry,
  getEntries,
  getEntriesByCategory,
  getStatistics,
  updateEntry,
  deleteEntry,
  flagEntry,
} from "@/api/patient/journalApi"
import type {
  JournalCategory,
  CreateJournalEntryPayload,
  UpdateJournalEntryPayload,
} from "@/types/patient/journal"

type JournalEntriesParams = {
  page?: number
  limit?: number
  category?: JournalCategory | null
}

export function useJournalEntries(
  patientId: string | undefined,
  params: JournalEntriesParams = {}
) {
  const { page = 1, limit = 20, category } = params

  return useQuery({
    queryKey: ["journal", patientId, page, category ?? "all"],
    queryFn: async () => {
      if (!patientId) throw new Error("Missing patientId")
      if (category) {
        return getEntriesByCategory(patientId, category, { page, limit })
      }
      return getEntries(patientId, { page, limit })
    },
    enabled: !!patientId,
  })
}

export function useJournalStatistics(patientId: string | undefined) {
  return useQuery({
    queryKey: ["journal-stats", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Missing patientId")
      return getStatistics(patientId)
    },
    enabled: !!patientId,
  })
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateJournalEntryPayload) => createEntry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] })
      queryClient.invalidateQueries({ queryKey: ["journal-stats"] })
    },
  })
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateJournalEntryPayload
    }) => updateEntry(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] })
      queryClient.invalidateQueries({ queryKey: ["journal-stats"] })
    },
  })
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] })
      queryClient.invalidateQueries({ queryKey: ["journal-stats"] })
    },
  })
}

export function useFlagJournalEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => flagEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] })
      queryClient.invalidateQueries({ queryKey: ["journal-stats"] })
    },
  })
}
