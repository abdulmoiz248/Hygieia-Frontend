export type AppointmentStatus = "upcoming" | "completed" | "cancelled"
import { Doctor } from "../doctor/profile"


export interface MeetingRemarks {
  diagnosis: string
  symptoms: string
  recommendations: string
  nextSteps: string
  prescriptions: string
  doctorNotes: string
}

export interface Appointment {
  id: string
  date: string
  time: string
  type: string
  status: AppointmentStatus
  doctor: Doctor
  meetingRemarks?: MeetingRemarks
}
