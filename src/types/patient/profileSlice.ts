import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ProfileType } from "./profile"
import patientApi from "@/api/patient/patientApi"

const initialState: ProfileType = {
  name: "Abdul Muqeet Naeem",
  email: "fa22-bcs-0168@cuilahore.edu.pk",
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
  healthscore:80,
  adherence :70,
  missed_doses:17,
  doses_taken:3,
  limit: {
  sleep:10,
  water: 8,
  steps: 10000,
  protein:100 ,
  carbs: 45,
  fats: 50,
}
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (_, action: PayloadAction<ProfileType>) => action.payload,
    updateProfile: (state, action: PayloadAction<Partial<ProfileType>>) => ({
      ...state,
      ...action.payload,
    }),
  },
})

export const { setProfile, updateProfile } = profileSlice.actions
export default profileSlice.reducer

export const getInitialProfile = async () => {
  const patient = localStorage.getItem("patient")
  try {
    const res = await patientApi.get("/profile", {
      headers: { patient },
    })
    if (res.data.success) return res.data.initialState
    return null
  } catch {
    return null
  }
}

export const updateProfileData = async (data: Partial<ProfileType>) => {
  const patient = localStorage.getItem("patient")
  try {
    const res = await patientApi.put("/profile", data, {
      headers: { patient },
    })
    return res.data.success
  } catch {
    return false
  }
}

export const uploadAvatar = async (file: File) => {
  const patient = localStorage.getItem("patient")
  const formData = new FormData()
  formData.append("avatar", file)

  try {
    const res = await patientApi.post("/upload-avatar", formData, {
      headers: {
        patient,
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data.avatarUrl
  } catch {
    return null
  }
}

export const deleteProfile = async () => {
  const patient = localStorage.getItem("patient")
  try {
    const res = await patientApi.delete("/profile", {
      headers: { patient },
    })
    return res.data.success
  } catch {
    return false
  }
}
