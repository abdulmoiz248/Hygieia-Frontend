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

import { Doctor } from "../doctor/profile"


export interface Appointment {
  id: string
  doctor: Doctor
  date: string
  time: string
  status: AppointmentStatus
  type: AppointmentTypes
  notes?: string
 report?: string
}
