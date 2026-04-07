import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { ProfileType } from "@/types/patient/profile"
import api from "@/lib/axios"
import patientApi from "@/api/patient/patientApi"

type ProfileState = {
  profile: ProfileType
  loading: boolean
  hasFetchedProfile: boolean
  error: string | null
  setProfile: (profile: ProfileType) => void
  updateProfile: (patch: Partial<ProfileType>) => void
  fetchInitialProfile: () => Promise<void>
  updateProfileBackend: (data: Partial<ProfileType>) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<string | null>
  deleteProfile: () => Promise<boolean>
}

const toStringValue = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback

const toNumberValue = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback

const getStoredId = (): string =>
  typeof window !== "undefined" ? localStorage.getItem("id") ?? "" : ""

const getPatientHeader = (): string | null =>
  typeof window !== "undefined"
    ? localStorage.getItem("patient") ?? localStorage.getItem("id")
    : null

const defaultProfile: ProfileType = {
  id: "",
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  emergencyContact: "",
  bloodType: "",
  allergies: "",
  conditions: "",
  medications: "",
  avatar: "",
  gender: "",
  weight: 0,
  height: 0,
  vaccines: "",
  ongoingMedications: "",
  surgeryHistory: "",
  implants: "",
  pregnancyStatus: "",
  menstrualCycle: "",
  mentalHealth: "",
  familyHistory: "",
  organDonor: "",
  disabilities: "",
  lifestyle: "",
  healthscore: 0,
  adherence: 0,
  missed_doses: 0,
  doses_taken: 0,
  limit: {},
}

const normalizeProfile = (incoming?: Partial<ProfileType> | null): ProfileType => {
  const safe = incoming ?? {}

  return {
    ...defaultProfile,
    ...safe,
    id: toStringValue(safe.id, getStoredId()),
    name: toStringValue(safe.name),
    email: toStringValue(safe.email),
    phone: toStringValue(safe.phone),
    dateOfBirth: toStringValue((safe as any).dateOfBirth ?? (safe as any).dateofbirth),
    address: toStringValue(safe.address),
    emergencyContact: toStringValue(safe.emergencyContact),
    bloodType: toStringValue(safe.bloodType),
    allergies: toStringValue(safe.allergies),
    conditions: toStringValue(safe.conditions),
    medications: toStringValue(safe.medications),
    avatar: toStringValue((safe as any).avatar ?? (safe as any).img),
    gender: toStringValue(safe.gender),
    weight: toNumberValue(safe.weight, defaultProfile.weight),
    height: toNumberValue(safe.height, defaultProfile.height),
    vaccines: toStringValue(safe.vaccines),
    ongoingMedications: toStringValue(safe.ongoingMedications),
    surgeryHistory: toStringValue(safe.surgeryHistory),
    implants: toStringValue(safe.implants),
    pregnancyStatus: toStringValue(safe.pregnancyStatus),
    menstrualCycle: toStringValue(safe.menstrualCycle),
    mentalHealth: toStringValue(safe.mentalHealth),
    familyHistory: toStringValue(safe.familyHistory),
    organDonor: toStringValue(safe.organDonor),
    disabilities: toStringValue(safe.disabilities),
    lifestyle: toStringValue(safe.lifestyle),
    healthscore: toNumberValue(safe.healthscore, defaultProfile.healthscore),
    adherence: safe.adherence ?? defaultProfile.adherence,
    missed_doses: safe.missed_doses ?? defaultProfile.missed_doses,
    doses_taken: safe.doses_taken ?? defaultProfile.doses_taken,
    limit: {
      ...defaultProfile.limit,
      ...(safe.limit ?? {}),
    },
  }
}

export const usePatientProfileStore = create<ProfileState>()(
  devtools(
    (set, get) => ({
      profile: defaultProfile,
      loading: false,
      hasFetchedProfile: false,
      error: null,

      setProfile: (profile) => set({ profile: normalizeProfile(profile) }),

      updateProfile: (patch) =>
        set((state) => ({ profile: normalizeProfile({ ...state.profile, ...patch }) })),

      fetchInitialProfile: async () => {
        if (get().loading || get().hasFetchedProfile) {
          return
        }

        set({ loading: true, error: null })
        try {
          const id = getStoredId()
          if (!id) {
            set({ profile: normalizeProfile({}), loading: false, hasFetchedProfile: true, error: "Missing patient id" })
            return
          }

          let fetchedProfile: unknown = null

          try {
            const authRes = await api.get(`/auth/user?id=${id}&role=patient`)
            if (authRes.data?.success && authRes.data?.data) {
              fetchedProfile = authRes.data.data
            }
          } catch {
            const patient = getPatientHeader()
            if (patient) {
              const fallbackRes = await patientApi.get("/profile", {
                headers: { patient },
              })
              if (fallbackRes.data?.success) {
                fetchedProfile = fallbackRes.data.initialState ?? fallbackRes.data.data ?? null
              }
            }
          }

          set({
            profile: normalizeProfile(fetchedProfile as Partial<ProfileType> | null),
            loading: false,
            hasFetchedProfile: true,
            error: fetchedProfile ? null : "Failed to load profile",
          })
        } catch (err: any) {
          set({ loading: false, hasFetchedProfile: true, error: err?.message ?? "Failed to load profile" })
        }
      },

      updateProfileBackend: async (data) => {
        const id = getStoredId()
        if (!id) return false

        const normalizedData = normalizeProfile({ ...get().profile, ...data })
        try {
          const primaryRes = await api.post(`/auth/user?role=patient`, {
            profileData: {
              ...normalizedData,
              id,
            },
          })

          if (primaryRes.data?.success) {
            get().updateProfile(normalizedData)
            return true
          }

          return false
        } catch {
          const patient = getPatientHeader()
          if (!patient) return false
          try {
            const fallbackRes = await patientApi.put("/profile", normalizedData, {
              headers: { patient },
            })
            if (fallbackRes.data?.success) {
              get().updateProfile(normalizedData)
              return true
            }
            return false
          } catch {
            return false
          }
        }
      },

      uploadAvatar: async (file: File) => {
        const id = getStoredId()
        if (!id) return null

        const formData = new FormData()
        formData.append("file", file)

        try {
          
          const primaryRes = await api.post(`/auth/profile-pic?role=patient&userId=${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })

       //   console.log("Primary upload response:", primaryRes.data)
          const url = primaryRes.data?.url ?? primaryRes.data?.data.img ?? null
          if (url) {
            get().updateProfile({ avatar: url })
          }
          return url
        } catch (e:any){
console.log("Primary upload failed, attempting fallback...", e)
        }
      },

      deleteProfile: async () => {
        const id = getStoredId()
        if (!id) return false

        try {
          const primaryRes = await api.delete(`/auth/user?id=${id}&role=patient`)
          if (primaryRes.data?.success) return true
        } catch {
          const patient = getPatientHeader()
          if (!patient) return false
          try {
            const fallbackRes = await patientApi.delete("/profile", {
              headers: { patient },
            })
            return !!fallbackRes.data?.success
          } catch {
            return false
          }
        }

        return false
      },
    }),
    { name: "patient-profile-store" }
  )
)

