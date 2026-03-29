export type Role = "doctor" | "nutritionist" | "pathologist"

export interface WorkingHour {
  day: string
  start: string
  end: string
  location: string
  _id?: string
}

export interface Worker {
  _id: string
  id: string
  name: string
  phone: string
  gender: string
  dateofbirth: string
  img: string
  personal_email: string
  specialization: string
  experienceYears: number
  certifications: string[]
  education: string[]
  languages: string[]
  bio: string
  consultationFee: number
  workingHours: WorkingHour[]
  rating: number
  createdAt: string
  role: Role
}

export const ROLE_CONFIG: Record<Role, {
  label: string
  plural: string
  color: string
  gradient: string
  lightBg: string
  endpoint: string | null
}> = {
  doctor: {
    label: "Doctor",
    plural: "Doctors",
    color: "var(--color-soft-blue)",
    gradient: "linear-gradient(135deg, var(--color-soft-blue), oklch(0.45 0.18 230))",
    lightBg: "oklch(0.95 0.05 210)",
    endpoint: "http://localhost:4000/doctors",
  },
  nutritionist: {
    label: "Nutritionist",
    plural: "Nutritionists",
    color: "var(--color-mint-green)",
    gradient: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))",
    lightBg: "oklch(0.95 0.04 178)",
    endpoint: "http://localhost:4000/nutritionists",
  },
  pathologist: {
    label: "Pathologist",
    plural: "Pathologists",
    color: "var(--color-soft-coral)",
    gradient: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))",
    lightBg: "oklch(0.96 0.06 10)",
    endpoint: "http://localhost:4000/pathologists", // endpoint not yet available
  },
}
