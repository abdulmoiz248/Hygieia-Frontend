import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { ProfileType } from "@/types/patient/profile"
import patientApi from "@/api/patient/patientApi"

type ProfileState = {
  profile: ProfileType
  loading: boolean
  error: string | null
  setProfile: (profile: ProfileType) => void
  updateProfile: (patch: Partial<ProfileType>) => void
  fetchInitialProfile: () => Promise<void>
  updateProfileBackend: (data: Partial<ProfileType>) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<string | null>
  deleteProfile: () => Promise<boolean>
}

const defaultProfile: ProfileType = {
  id: "7191ac63-6ac5-47c3-a865-b1fe152f8f47",
  name: "Abdul Muqeet Naeem",
  email: "moiz20920@gmail.com",
  phone: "+92 324 7006001",
  dateOfBirth: "1990-05-15",
  address: "123 Main St, New York, NY 10001",
  emergencyContact: "Jane Doe - +1 (555) 987-6543",
  bloodType: "O+",
  allergies: "Penicillin, Shellfish",
  conditions: "Hypertension",
  medications: "Lisinopril 10mg daily",
  avatar: "/king2.jpg",
  gender: "Female",
  weight: 50,
  height: 150,
  vaccines: "COVID-19 (Pfizer, 2 doses), Hepatitis B, Tetanus",
  ongoingMedications: "Levothyroxine 50mcg daily",
  surgeryHistory: "Appendectomy (2012), Wisdom Tooth Extraction (2021)",
  implants: "None",
  pregnancyStatus: "no",
  menstrualCycle: "Mild cramps, regular cycle",
  mentalHealth: "Anxiety (mild, under control), Therapy once a month",
  familyHistory: "Father - Type 2 Diabetes, Mother - Hypertension",
  organDonor: "Yes - registered organ donor",
  disabilities: "None",
  lifestyle: "Non-smoker, occasional alcohol, regular morning walk, vegetarian",
  healthscore: 80,
  adherence: 70,
  missed_doses: 17,
  doses_taken: 3,
  limit: {
    sleep: 10,
    water: 8,
    steps: 10000,
    protein: 100,
    carbs: 45,
    fats: 50,
  },
}

export const usePatientProfileStore = create<ProfileState>()(
  devtools(
    (set, get) => ({
      profile: defaultProfile,
      loading: false,
      error: null,

      setProfile: (profile) => set({ profile }),

      updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),

      fetchInitialProfile: async () => {
        const patient = typeof window !== "undefined" ? localStorage.getItem("patient") : null
        if (!patient) return

        set({ loading: true, error: null })
        try {
          const res = await patientApi.get("/profile", {
            headers: { patient },
          })
          if (res.data?.success && res.data.initialState) {
            set({ profile: res.data.initialState, loading: false })
          } else {
            set({ loading: false })
          }
        } catch (err: any) {
          set({ loading: false, error: err?.message ?? "Failed to load profile" })
        }
      },

      updateProfileBackend: async (data) => {
        const patient = typeof window !== "undefined" ? localStorage.getItem("patient") : null
        if (!patient) return false
        try {
          const res = await patientApi.put("/profile", data, {
            headers: { patient },
          })
          if (res.data?.success) {
            get().updateProfile(data)
            return true
          }
          return false
        } catch {
          return false
        }
      },

      uploadAvatar: async (file: File) => {
        const patient = typeof window !== "undefined" ? localStorage.getItem("patient") : null
        if (!patient) return null

        const formData = new FormData()
        formData.append("avatar", file)

        try {
          const res = await patientApi.post("/upload-avatar", formData, {
            headers: {
              patient,
              "Content-Type": "multipart/form-data",
            },
          })
          const url = res.data?.avatarUrl ?? null
          if (url) {
            get().updateProfile({ avatar: url })
          }
          return url
        } catch {
          return null
        }
      },

      deleteProfile: async () => {
        const patient = typeof window !== "undefined" ? localStorage.getItem("patient") : null
        if (!patient) return false
        try {
          const res = await patientApi.delete("/profile", {
            headers: { patient },
          })
          return !!res.data?.success
        } catch {
          return false
        }
      },
    }),
    { name: "patient-profile-store" }
  )
)

