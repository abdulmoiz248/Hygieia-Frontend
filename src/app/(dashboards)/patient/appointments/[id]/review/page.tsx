"use client"

import { useParams } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"

import {  useSelector } from "react-redux"
import { RootState } from "@/store/patient/store"

import ReviewForm from "@/components/patient dashboard/appointments/ReviewForm"



export default function ReviewPage() {
  const params = useParams()
  const appointmentId = Array.isArray(params.id) ? params.id[0] : params.id || ""
  const appointments = useSelector((state: RootState) => state.appointments.appointments)
 

  if (!appointments) {
    return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
  <Card className="w-full max-w-md border-0 bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
    <CardContent className="p-10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-soft-coral/20 text-soft-coral flex items-center justify-center text-3xl font-bold">
          !
        </div>
        <h2 className="text-3xl font-semibold text-soft-coral tracking-tight">Appointment Not Found</h2>
        <p className="text-cool-gray text-base leading-relaxed">
          We couldn’t find any completed appointment for ID
          <br />
          <span className="font-semibold text-dark-slate-gray">{appointmentId}</span>.
        </p>
      </div>
    </CardContent>
  </Card>
</div>

    )
  }

  return <ReviewForm appointment={appointments[0]} />
}
