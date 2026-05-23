import type { ProfileType } from "@/types/patient/profile"
import type { DoctorProfile } from "@/store/doctor/doctor-store"
import type { NutritionistProfile } from "@/store/nutritionist/userStore"

// ─── Shared field descriptor ──────────────────────────────────────────────────

export interface ProfileField<T extends object = Record<string, unknown>> {
  key: keyof T
  label: string
}

// ─── Shared empty-check ───────────────────────────────────────────────────────

export const isEmpty = (v: unknown): boolean => {
  if (v === undefined || v === null) return true
  if (typeof v === "string"  && v.trim() === "") return true
  if (typeof v === "number"  && v === 0)          return true
  if (Array.isArray(v)       && v.length === 0)   return true
  return false
}

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT
// All fields listed below must be filled for the ProfileGuard to pass and for
// the "Share data with doctor" checkbox to become enabled.
// ─────────────────────────────────────────────────────────────────────────────

export const PATIENT_REQUIRED_FIELDS: ProfileField<ProfileType>[] = [
  // Identity
  { key: "name",              label: "Full name" },
  { key: "email",             label: "Email" },
  { key: "phone",             label: "Phone number" },
  { key: "dateOfBirth",       label: "Date of birth" },
  { key: "gender",            label: "Gender" },
  { key: "address",           label: "Address" },
  { key: "emergencyContact",  label: "Emergency contact" },
  // Medical basics
  { key: "bloodType",         label: "Blood type" },
  { key: "weight",            label: "Weight" },
  { key: "height",            label: "Height" },
  // Health history — all required for meaningful data sharing
  { key: "allergies",         label: "Allergies (or 'None')" },
  { key: "conditions",        label: "Medical conditions (or 'None')" },
  { key: "medications",       label: "Current medications (or 'None')" },
  { key: "ongoingMedications",label: "Ongoing medications (or 'None')" },
  { key: "vaccines",          label: "Vaccination history (or 'None')" },
  { key: "surgeryHistory",    label: "Surgery history (or 'None')" },
  { key: "familyHistory",     label: "Family medical history (or 'None')" },
  { key: "lifestyle",         label: "Lifestyle information" },
]

export function getMissingPatientFields(profile: Partial<ProfileType>): ProfileField<ProfileType>[] {
  return PATIENT_REQUIRED_FIELDS.filter((f) => isEmpty(profile[f.key]))
}

export function isPatientProfileComplete(profile: Partial<ProfileType>): boolean {
  return getMissingPatientFields(profile).length === 0
}

export function patientCompletenessScore(profile: Partial<ProfileType>): number {
  const filled = PATIENT_REQUIRED_FIELDS.filter((f) => !isEmpty(profile[f.key])).length
  return Math.round((filled / PATIENT_REQUIRED_FIELDS.length) * 100)
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR
// All fields listed below are required for the doctor's ProfileGuard to pass.
// ─────────────────────────────────────────────────────────────────────────────

export const DOCTOR_REQUIRED_FIELDS: ProfileField<DoctorProfile>[] = [
  // Identity
  { key: "name",            label: "Full name" },
  { key: "email",           label: "Email" },
  { key: "phone",           label: "Phone number" },
  { key: "gender",          label: "Gender" },
  { key: "dateofbirth",     label: "Date of birth" },
  // Professional
  { key: "specialization",  label: "Specialization" },
  { key: "bio",             label: "Bio / about me" },
  { key: "experienceYears", label: "Years of experience" },
  { key: "consultationFee", label: "Consultation fee" },
  { key: "workingHours",    label: "Working hours" },
  { key: "certifications",  label: "Certifications" },
  { key: "education",       label: "Education" },
  { key: "languages",       label: "Languages spoken" },
]

export function getMissingDoctorFields(profile: Partial<DoctorProfile>): ProfileField<DoctorProfile>[] {
  return DOCTOR_REQUIRED_FIELDS.filter((f) => isEmpty(profile[f.key as keyof DoctorProfile]))
}

export function isDoctorProfileComplete(profile: Partial<DoctorProfile>): boolean {
  return getMissingDoctorFields(profile).length === 0
}

export function doctorCompletenessScore(profile: Partial<DoctorProfile>): number {
  const filled = DOCTOR_REQUIRED_FIELDS.filter((f) => !isEmpty(profile[f.key as keyof DoctorProfile])).length
  return Math.round((filled / DOCTOR_REQUIRED_FIELDS.length) * 100)
}

// ─────────────────────────────────────────────────────────────────────────────
// NUTRITIONIST
// Same professional fields as Doctor — NutritionistProfile has the same shape.
// ─────────────────────────────────────────────────────────────────────────────

export const NUTRITIONIST_REQUIRED_FIELDS: ProfileField<NutritionistProfile>[] = [
  { key: "name",            label: "Full name" },
  { key: "email",           label: "Email" },
  { key: "phone",           label: "Phone number" },
  { key: "gender",          label: "Gender" },
  { key: "dateofbirth",     label: "Date of birth" },
  { key: "specialization",  label: "Specialization" },
  { key: "bio",             label: "Bio / about me" },
  { key: "experienceYears", label: "Years of experience" },
  { key: "consultationFee", label: "Consultation fee" },
  { key: "workingHours",    label: "Working hours" },
  { key: "certifications",  label: "Certifications" },
  { key: "education",       label: "Education" },
  { key: "languages",       label: "Languages spoken" },
]

export function getMissingNutritionistFields(
  profile: Partial<NutritionistProfile>
): ProfileField<NutritionistProfile>[] {
  return NUTRITIONIST_REQUIRED_FIELDS.filter((f) =>
    isEmpty(profile[f.key as keyof NutritionistProfile])
  )
}

export function isNutritionistProfileComplete(profile: Partial<NutritionistProfile>): boolean {
  return getMissingNutritionistFields(profile).length === 0
}

export function nutritionistCompletenessScore(profile: Partial<NutritionistProfile>): number {
  const filled = NUTRITIONIST_REQUIRED_FIELDS.filter(
    (f) => !isEmpty(profile[f.key as keyof NutritionistProfile])
  ).length
  return Math.round((filled / NUTRITIONIST_REQUIRED_FIELDS.length) * 100)
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic helpers used by ProfileGuard (role-agnostic)
// ─────────────────────────────────────────────────────────────────────────────

export type AnyProfile =
  | Partial<ProfileType>
  | Partial<DoctorProfile>
  | Partial<NutritionistProfile>

export type Role = "patient" | "doctor" | "nutritionist" | "lab-technician"

/** Returns missing required fields for any role */
export function getMissingFieldsForRole(
  role: Role,
  profile: AnyProfile
): ProfileField[] {
  switch (role) {
    case "patient":
      return getMissingPatientFields(profile as Partial<ProfileType>) as unknown as ProfileField[]
    case "doctor":
      return getMissingDoctorFields(profile as Partial<DoctorProfile>) as unknown as ProfileField[]
    case "nutritionist":
      return getMissingNutritionistFields(profile as Partial<NutritionistProfile>) as unknown as ProfileField[]
    default:
      // Lab technician only requires basic identity — name + email + phone
      return (["name", "email", "phone"] as const)
        .filter((k) => isEmpty((profile as any)[k]))
        .map((k) => ({ key: k, label: k })) as ProfileField[]
  }
}

/** True when all required fields for the given role are filled */
export function isProfileCompleteForRole(role: Role, profile: AnyProfile): boolean {
  return getMissingFieldsForRole(role, profile).length === 0
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward-compat alias used by PatientProfileGuard and ShareDataCheckbox
// ─────────────────────────────────────────────────────────────────────────────
export const isProfileComplete      = isPatientProfileComplete
export const getMissingCoreFields   = getMissingPatientFields