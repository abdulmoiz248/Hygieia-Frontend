export type AppointmentStatus = "upcoming" | "completed" | "cancelled"
import { Doctor } from "../doctor/profile"


export interface Appointment {
  id: string
  doctor: Doctor
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  type: "consultation" | "follow-up" | "emergency"
  notes?: string
  meetingRemarks?: {
    diagnosis: string
    symptoms: string
    recommendations: string
    nextSteps: string
    prescriptions: string
    doctorNotes: string
  }
}
