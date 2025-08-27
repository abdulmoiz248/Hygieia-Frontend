import { Doctor } from "../doctor/profile"
import { ProfileType } from "./profile"

export enum AppointmentStatus {
  Upcoming = "upcoming",
  Completed = "completed",
  Cancelled = "cancelled"
}

export enum AppointmentTypes {
  Consultation = "consultation",
  FollowUp = "follow-up",
  Emergency = "emergency"
}

export enum AppointmentMode {
 Physical='physical',
 Online='online'
}



export interface Appointment {
  id: string
  patient:ProfileType
  doctor: Doctor
  date: string
  time: string
  status: AppointmentStatus
  type: AppointmentTypes
  notes?: string
 report?: string
 mode:AppointmentMode
 dataShared:boolean
}
