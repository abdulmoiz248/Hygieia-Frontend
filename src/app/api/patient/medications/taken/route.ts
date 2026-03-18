import { NextResponse } from "next/server"

type MarkMedicationTakenPayload = {
  patientId: string
  prescriptionId: string
  medicationId: string
  taken: boolean
  takenAt?: string
  scheduledTime?: string
  source?: "patient-web"
}

const getBackendBaseUrl = () =>
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as MarkMedicationTakenPayload

    if (!body?.patientId || !body?.prescriptionId || !body?.medicationId) {
      return NextResponse.json(
        {
          success: false,
          message: "patientId, prescriptionId and medicationId are required",
        },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${getBackendBaseUrl()}/appointments/prescriptions/medications/taken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    )

    const contentType = response.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    }

    const text = await response.text()
    return NextResponse.json(
      {
        success: response.ok,
        message: text || "Medication taken sync response received",
      },
      { status: response.status }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to sync medicine taken status",
      },
      { status: 500 }
    )
  }
}
