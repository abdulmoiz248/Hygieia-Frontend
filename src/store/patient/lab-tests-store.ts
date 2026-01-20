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
    (set) => ({
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
        const patientId = typeof window !== "undefined" ? localStorage.getItem("id") : null
        if (!patientId) {
          set({ error: "Patient ID not found in localStorage" })
          return
        }

        set({ loading: true, error: null })
        try {
          const response = await api.get<BookedLabTest[]>(
            `/booked-lab-tests/patient/${patientId}`
          )
          set({ loading: false, bookedTests: response.data })
        } catch (err: any) {
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
          const mapped: BookedLabTest = {
            testName: body.testName,
            testId: data.test_id,
            id: data.id,
            scheduledDate: data.scheduled_date,
            scheduledTime: data.scheduled_time,
            location: data.location,
            instructions: data.instructions,
            bookedAt: new Date().toISOString(),
            status: "pending",
          }
          set((state) => ({
            loading: false,
            bookedTests: [...state.bookedTests, mapped],
          }))
          return mapped
        } catch (err: any) {
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

