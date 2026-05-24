"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { usePatientAppointmentsStore } from "@/store/patient/appointments-store"
import ReviewForm from "@/components/patient dashboard/appointments/ReviewForm"  
import { AppointmentStatus } from "@/types/patient/appointment"
import Loader from "@/components/loader/loader"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ReviewPage() {
  const params   = useParams()
  const router   = useRouter()
  const id       = params?.id as string

  const { appointments } = usePatientAppointmentsStore()

  // Give the store a tick to hydrate before deciding "not found"
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  const appointment = appointments.find((a) => a.id === id)

  // Appointment not found
  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-soft-coral/10">
          <AlertTriangle className="w-8 h-8 text-soft-coral" />
        </div>
        <h2 className="text-2xl font-bold text-dark-slate-gray">Appointment not found</h2>
        <p className="text-cool-gray max-w-sm">
          We couldn&apos;t find this appointment. It may have been removed or the link is incorrect.
        </p>
        <Button
          onClick={() => router.push("/patient/appointments")}
          className="bg-soft-blue hover:bg-soft-blue/90 text-white"
        >
          Back to Appointments
        </Button>
      </div>
    )
  }

  // Only completed appointments can be reviewed
  if (appointment.status !== AppointmentStatus.Completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-dark-slate-gray">Review not available</h2>
        <p className="text-cool-gray max-w-sm">
          You can only review appointments that have been completed.
        </p>
        <Button
          onClick={() => router.push("/patient/appointments")}
          className="bg-soft-blue hover:bg-soft-blue/90 text-white"
        >
          Back to Appointments
        </Button>
      </div>
    )
  }

  return <ReviewForm appointment={appointment} />
}