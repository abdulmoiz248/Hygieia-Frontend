import api from "@/lib/axios"
import type { Medicine, Prescription } from "@/types/patient/medicine"

type ApiMedication = {
  id?: string | number
  medicationId?: string | number
  medication_id?: string | number
  name?: string
  dosage?: string
  frequency?: string
  instructions?: string
  duration?: string | number
  time?: string
  taken?: boolean
}

type ApiPrescription = {
  id: string
  medications?: ApiMedication[]
  status?: string
  doctorName?: string
  start_date?: string | null
  created_at?: string | null
}

type ApiPrescriptionResponse =
  | ApiPrescription[]
  | {
      data?: ApiPrescription[]
    }

export type MarkMedicationTakenPayload = {
  patientId: string
  prescriptionId: string
  medicationId: string
  taken: boolean
  takenAt?: string
  scheduledTime?: string
  source?: "patient-web"
}

const normalizePrescriptionStatus = (
  status?: string
): Prescription["status"] => {
  return status?.toLowerCase() === "active" ? "active" : "completed"
}

const normalizeMedication = (
  medication: ApiMedication,
  index: number,
  prescriptionId: string
): Medicine => {
  const backendMedicationId =
    medication.medicationId ?? medication.medication_id ?? medication.id

  return {
    id: `${prescriptionId}:${String(backendMedicationId ?? index)}`,
    backendMedicationId:
      backendMedicationId !== undefined && backendMedicationId !== null
        ? String(backendMedicationId)
        : undefined,
    name: medication.name ?? "Medicine",
    dosage: medication.dosage ?? "-",
    frequency: medication.frequency ?? "-",
    instructions: medication.instructions,
    duration:
      typeof medication.duration === "number"
        ? `${medication.duration} days`
        : medication.duration ?? "Ongoing",
    time: medication.time ?? "-",
    taken: Boolean(medication.taken),
  }
}

export const mapApiPrescriptionToStorePrescription = (
  prescription: ApiPrescription
): Prescription => ({
  id: prescription.id,
  doctorName: prescription.doctorName ?? "Doctor",
  doctorSpecialty: "General Physician",
  date:
    prescription.start_date ??
    prescription.created_at?.slice(0, 10) ??
    new Date().toISOString().slice(0, 10),
  status: normalizePrescriptionStatus(prescription.status),
  medications: (prescription.medications ?? []).map((medication, index) =>
    normalizeMedication(medication, index, prescription.id)
  ),
})

export async function getActivePrescriptionsByPatient(
  patientId: string
): Promise<ApiPrescription[]> {
  const { data } = await api.get<ApiPrescriptionResponse>(
    `/appointments/prescriptions/patient/${patientId}`
  )

  if (Array.isArray(data)) {
    return data
  }

  return data.data ?? []
}

export async function markMedicationTaken(
  payload: MarkMedicationTakenPayload
): Promise<void> {
  try {
    await api.post("/appointments/prescriptions/medications/taken", payload)
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to sync medicine status"

    throw new Error(message)
  }
}
