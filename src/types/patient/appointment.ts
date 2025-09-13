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



// raw type from backend
interface BackendAppointment {
  id: string
  patientId: string
  doctorId: string
  doctorRole: string
  doctorDetails: Doctor | null
  date: string
  time: string
  status: AppointmentStatus
  type: AppointmentTypes
  notes?: string
  report?: string
  mode: AppointmentMode
  dataShared: boolean
  createdAt: string
  updatedAt: string
}

// mapper
export function mapAppointment(raw: BackendAppointment): Appointment {
  return {
    id: raw.id,
    patient: {
      id: raw.patientId,
    } as ProfileType, // we only have ID for now, you can expand later
    doctor: raw.doctorDetails
      ? raw.doctorDetails
      : ({
          id: raw.doctorId,
          name: "Unknown Doctor",
        } as Doctor),
    date: raw.date,
    time: raw.time,
    status: raw.status,
    type: raw.type,
    notes: raw.notes,
    report: raw.report,
    mode: raw.mode,
    dataShared: raw.dataShared,
  }
}

export function mapAppointments(raws: BackendAppointment[]): Appointment[] {
  return raws.map(mapAppointment)
}
