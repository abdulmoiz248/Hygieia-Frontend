import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { LabTest, BookedLabTest } from "@/types/patient/lab"
import api from "@/lib/axios"

type LabTestsState = {
  availableTests: LabTest[]
  bookedTests: BookedLabTest[]
  showBookingModal: boolean
  selectedTest: LabTest | null
  loading: boolean
  error: string | null
  setShowBookingModal: (show: boolean) => void
  setSelectedTest: (test: LabTest | null) => void
  fetchLabTests: () => Promise<void>
  fetchBookedTests: () => Promise<void>
  bookLabTest: (body: {
    testName: string
    testId: string
    patientId: string
    scheduledDate: string
    scheduledTime: string
    location?: string
    instructions?: string[]
  }) => Promise<BookedLabTest | null>
  cancelLabTest: (bookingId: string) => Promise<BookedLabTest | null>
}

export const usePatientLabTestsStore = create<LabTestsState>()(
  devtools(
    (set, get) => ({
      availableTests: [],
      bookedTests: [],
      showBookingModal: false,
      selectedTest: null,
      loading: false,
      error: null,

      setShowBookingModal: (show) => set({ showBookingModal: show }),
      setSelectedTest: (test) => set({ selectedTest: test }),

      fetchLabTests: async () => {
        set({ loading: true, error: null })
        try {
          const response = await api.get<LabTest[]>("/lab-tests")
          set({ loading: false, availableTests: response.data })
        } catch (err: any) {
          set({
            loading: false,
            error: err?.message || "Failed to fetch lab tests",
          })
        }
      },

      fetchBookedTests: async () => {
        // FIX: guard against missing patientId without wiping existing bookedTests.
        // Previously a missing id would set an error but the caller in
        // LabBookingsSection had already cleared the optimistically-added booking
        // because the store reset bookedTests to [] on the next successful fetch.
        const patientId = typeof window !== "undefined" ? localStorage.getItem("id") : null
        if (!patientId) {
          console.warn("[lab-tests-store] fetchBookedTests: no patientId in localStorage")
          set({ error: "Patient ID not found. Please log in again." })
          return
        }

        set({ loading: true, error: null })
        try {
          const response = await api.get<BookedLabTest[]>(
            `/booked-lab-tests/patient/${patientId}`
          )

          const fetched: BookedLabTest[] = response.data

          // FIX: merge strategy — keep any optimistically-added entries that the
          // server hasn't returned yet (e.g. replication lag), then let server
          // data win for entries that exist on both sides.
          const fetchedIds = new Set(fetched.map((t) => t.id))
          const optimisticOnly = get().bookedTests.filter((t) => !fetchedIds.has(t.id))

          set({
            loading: false,
            bookedTests: [...fetched, ...optimisticOnly],
          })
        } catch (err: any) {
          // FIX: on fetch failure do NOT wipe existing bookedTests so the
          // optimistically-added booking from bookLabTest() stays visible.
          console.error("[lab-tests-store] fetchBookedTests error:", err)
          set({
            loading: false,
            error: err?.message || "Failed to fetch booked tests",
          })
        }
      },

      bookLabTest: async (body) => {
        try {
          set({ loading: true, error: null })
          const response = await api.post("/booked-lab-tests", body)
          const data = response.data

          // Map API snake_case response → camelCase BookedLabTest
          const mapped: BookedLabTest = {
            testName: body.testName,
            testId: data.test_id ?? body.testId,
            id: data.id,
            // FIX: prefer the API-returned date; fall back to what we sent.
            // Both are now ISO strings (yyyy-mm-dd) thanks to the modal fix.
            scheduledDate: data.scheduled_date ?? body.scheduledDate,
            scheduledTime: data.scheduled_time ?? body.scheduledTime,
            location: data.location ?? body.location,
            instructions: data.instructions ?? body.instructions,
            bookedAt: new Date().toISOString(),
            status: "pending",
          }

          set((state) => ({
            loading: false,
            bookedTests: [...state.bookedTests, mapped],
          }))
          return mapped
        } catch (err: any) {
          console.error("[lab-tests-store] bookLabTest error:", err)
          set({
            loading: false,
            error: err?.message || "Failed to book lab test",
          })
          return null
        }
      },

      cancelLabTest: async (bookingId) => {
        try {
          set({ loading: true, error: null })
          const response = await api.patch<BookedLabTest>(
            `/booked-lab-tests/${bookingId}/cancel`
          )
          const updated = response.data
          set((state) => ({
            loading: false,
            bookedTests: state.bookedTests.map((t) =>
              t.id === updated.id ? updated : t
            ),
          }))
          return updated
        } catch (err: any) {
          set({
            loading: false,
            error: err?.message || "Failed to cancel lab test",
          })
          return null
        }
      },
    }),
    { name: "patient-lab-tests-store" }
  )
)