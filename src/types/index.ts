export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  medicalInfo?: {
    bloodType?: string
    allergies?: string[]
    conditions?: string[]
  }
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  location: string
  avatar?: string
  experience: number
  consultationFee: number
}



export interface MedicalRecord {
  id: string
  title: string
  record_type?: "lab-result" | "prescription" | "scan" | "report"
  type?: "lab-result" | "prescription" | "scan" | "report"
  date: string
  fileUrl?: string
   file_url?: string
  doctorName?: string
}


export interface Prescription {
  id: string
  doctorName: string
  date: string
  medications: Medication[]
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot" | "doctor"
  timestamp: string
  type?: "text" | "image" | "file"
}

export interface FitnessGoal {
  id: string
  type: "steps" | "weight" | "exercise" | "water" | "sleep"
  target: number
  current: number
  unit: string
}

export interface DiagnosisResult {
  id: string
  type: "dental" | "acne"
  confidence: number
  recommendation: string
  imageUrl: string
  timestamp: string
}
