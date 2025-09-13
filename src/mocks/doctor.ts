import type { Doctor } from "@/types/index"

export interface ExtendedDoctor extends Doctor {
  bio: string
  languages: string[]
  education: string[]
  specializations: string[]
  availability: {
    nextAvailable: string
    timeSlots: string[]
  }
  verified: boolean
  acceptsInsurance: boolean
  consultationTypes: string[]
  responseTime: string
  totalPatients: number
  awards: string[]
}



export const specialties = [
  "All Specialties",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Dermatologist",
  "Psychiatrist",
  "Gynecologist",
  "Oncologist",
]

export const locations = [
  "All Locations",
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "San Francisco, CA",
  "Boston, MA",
  "Seattle, WA",
  "Miami, FL",
]

export const consultationTypes = ["All Types", "Video", "In-Person", "Chat"]
