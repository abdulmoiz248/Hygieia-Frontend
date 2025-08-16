import { create } from 'zustand'

interface LabTechnicianProfile {
  id: string | null
  name: string
  email: string
  phone: string
  specialization: string
  experienceYears: number
  certifications: string[]
  shift: string
  available: boolean
  img:string
}

interface LabTechnicianStore {
  profile: LabTechnicianProfile
  setProfile: (profileData: LabTechnicianProfile) => void
  updateProfileField: <K extends keyof LabTechnicianProfile>(field: K, value: LabTechnicianProfile[K]) => void
  resetProfile: () => void
}

const initialProfile: LabTechnicianProfile = {
  id: null,
  name: 'Haris Imran',
  email: 'fa22-bcs-084@cuilahore.edu.pk',
  phone: '',
  specialization: '',
  experienceYears: 0,
  certifications: [],
  shift: 'morning',
  available: false,
  img:'/doctor.png'
}

const useLabTechnicianStore = create<LabTechnicianStore>((set) => ({
  profile: initialProfile,

  setProfile: (profileData) => set({ profile: profileData }),

  updateProfileField: (field, value) =>
    set((state) => ({
      profile: { ...state.profile, [field]: value }
    })),

  resetProfile: () => set({ profile: initialProfile })
}))

export default useLabTechnicianStore
