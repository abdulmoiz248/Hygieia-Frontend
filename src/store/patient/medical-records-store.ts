import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { MedicalRecord } from "@/types"
import api from "@/lib/axios"

type MedicalRecordsState = {
  records: MedicalRecord[]
  typeFilter: string
  searchQuery: string
  viewingRecord: MedicalRecord | null
  showUpload: boolean
  loading: boolean
  error: string | null
  setTypeFilter: (value: string) => void
  setSearchQuery: (value: string) => void
  setViewingRecord: (record: MedicalRecord | null) => void
  setShowUpload: (show: boolean) => void
  fetchMedicalRecords: () => Promise<void>
  addRecord: (payload: { file: File; title: string; type: string }) => Promise<void>
  deleteRecord: (id: string) => Promise<void>
}

export const usePatientMedicalRecordsStore = create<MedicalRecordsState>()(
  devtools(
    (set) => ({
      records: [],
      typeFilter: "all",
      searchQuery: "",
      viewingRecord: null,
      showUpload: false,
      loading: false,
      error: null,

      setTypeFilter: (value) => set({ typeFilter: value }),
      setSearchQuery: (value) => set({ searchQuery: value }),
      setViewingRecord: (record) => set({ viewingRecord: record }),
      setShowUpload: (show) => set({ showUpload: show }),

      fetchMedicalRecords: async () => {
        try {
          set({ loading: true, error: null })
          const patientId = typeof window !== "undefined" ? localStorage.getItem("id") : null
          if (!patientId) {
            set({ loading: false, error: "No patient id found in localStorage" })
            return
          }

          const res = await api.get(`/medical-records/patient/${patientId}`)
          if (!res.data) {
            throw new Error("Failed to fetch medical records")
          }

          const records: MedicalRecord[] = res.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.record_type,
            date: item.date,
            fileUrl: item.file_url,
            doctorName: item.doctor_name || undefined,
          }))

          set({ loading: false, records })
        } catch (err: any) {
          set({
            loading: false,
            error: err?.message || "Failed to load medical records",
          })
        }
      },

      addRecord: async ({ file, title, type }) => {
        try {
          set({ loading: true, error: null })
          const formData = new FormData()
          formData.append("file", file)
          formData.append("title", title)
          formData.append("recordType", type)
          formData.append(
            "patientId",
            (typeof window !== "undefined" && localStorage.getItem("id")) || ""
          )

          const res = await api.post("/medical-records/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })

          if (!res.data) {
            throw new Error("Failed to upload record")
          }

          const record: MedicalRecord = {
            id: res.data.id,
            title: res.data.title,
            type: res.data.record_type,
            date: res.data.date,
            fileUrl: res.data.file_url,
            doctorName: res.data.doctor_name || undefined,
          }

          set((state) => ({
            loading: false,
            records: [record, ...state.records],
          }))
        } catch (err: any) {
          set({
            loading: false,
            error: err?.message || "Failed to add record",
          })
        }
      },

      deleteRecord: async (id: string) => {
        try {
          set({ loading: true, error: null })
          const patientId =
            typeof window !== "undefined" ? localStorage.getItem("id") : null
          await api.delete(`/medical-records/${id}?patientId=${patientId || ""}`)
          set((state) => ({
            loading: false,
            records: state.records.filter((record) => record.id !== id),
          }))
        } catch (err: any) {
          set({
            loading: false,
            error: err?.message || "Failed to delete record",
          })
        }
      },
    }),
    { name: "patient-medical-records-store" }
  )
)

