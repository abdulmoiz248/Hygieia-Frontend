"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Activity, FileText, Pill, CalendarClock, ClipboardList, Clock } from "lucide-react"
import api from "@/lib/axios"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

type Medication = {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  time?: string
}

type PrescriptionRecord = {
  id: string
  notes: string
  start_date?: string
  end_date?: string
  status: string
  created_at: string
  medications: Medication[]
}

type AppointmentWithPrescription = {
  id: string
  date: string
  time: string
  status: string
  type: string
  notes?: string
  report?: string
  mode: string
  created_at: string
  prescription?: PrescriptionRecord[]
}

export const getPreviousDoctorAppointments = async (doctorId: string, patientId: string) => {
  const res = await api.get(`/appointments/prescriptions/previous/${doctorId}/${patientId}`)
  return res.data as AppointmentWithPrescription[]
}

export default function PreviousDoctorAppointmentsCard({
  doctorId,
  patientId,
}: {
  doctorId: string
  patientId: string
}) {
  const [appointments, setAppointments] = useState<AppointmentWithPrescription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPreviousDoctorAppointments(doctorId, patientId)
        setAppointments(Array.isArray(res) ? res : [])
      } catch (err) {
        console.error("Failed to fetch previous doctor appointments", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [doctorId, patientId])

  if (loading) return <p>Loading previous appointments...</p>

  if (!appointments.length) {
    return (
      <Card className="hover-lift">
        <CardHeader className="bg-white">
          <CardTitle className="text-soft-coral flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Previous Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 text-soft-blue">No previous appointments found.</CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-lift">
      <CardHeader className="bg-white">
        <CardTitle className="text-soft-coral flex items-center gap-2">
          <CalendarClock className="w-5 h-5" />
          Previous Appointments
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <Accordion type="single" collapsible className="space-y-3">
          {appointments.map((appt, i) => {
            const prescription =
              appt.prescription && appt.prescription.length > 0 ? appt.prescription[0] : null
            const medications: Medication[] = prescription?.medications ?? []

            return (
              <AccordionItem
                key={appt.id}
                value={`item-${i}`}
                className="border border-cool-gray/20 rounded-xl"
              >
                <AccordionTrigger className="text-soft-blue hover:text-soft-coral px-3 py-2">
                  <div className="flex flex-col items-start w-full text-left">
                    <p className="font-semibold text-base text-soft-coral">
                      {appt.date} at {appt.time}
                    </p>
                    <p className="text-sm text-cool-gray">
                      {appt.type.charAt(0).toUpperCase() + appt.type.slice(1)} • {appt.mode} •{" "}
                      {appt.status}
                    </p>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-4 p-4">
                  <div className="space-y-3">
                    {/* Notes */}
                    <div className="p-2 rounded-lg bg-cool-gray/10">
                      <p className="text-sm text-soft-blue mb-1 flex items-center gap-1">
                        <ClipboardList className="w-4 h-4" />
                        Notes
                      </p>
                      <p className="text-sm text-cool-gray">{appt.notes || "N/A"}</p>
                    </div>

                    {/* Report */}
                    {appt.report && (
                      <div className="p-2 rounded-lg bg-cool-gray/10">
                        <p className="text-sm text-soft-blue mb-1 flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Doctor Report
                        </p>
                        <p className="text-sm text-cool-gray">{appt.report}</p>
                      </div>
                    )}

                    {/* Prescription */}
                    {prescription && (
                      <>
                        <div className="p-2 rounded-lg bg-cool-gray/10">
                          <p className="text-sm text-soft-blue mb-2 flex items-center gap-1">
                            <Pill className="w-4 h-4" />
                            Prescription Summary
                          </p>
                          <div className="flex flex-col gap-2 text-sm text-cool-gray">
                            <div>
                              <span className="text-soft-blue">Status:</span>{" "}
                              <Badge
                                className={
                                  prescription.status === "active"
                                    ? "bg-mint-green text-white"
                                    : "bg-cool-gray text-white"
                                }
                              >
                                {prescription.status}
                              </Badge>
                            </div>
                            {prescription.notes && (
                              <div>
                                <span className="text-soft-blue">Notes:</span> {prescription.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Plan Duration */}
                        <div className="p-2 rounded-lg bg-cool-gray/10 flex flex-col text-sm">
                          <div className="flex items-center gap-1 text-soft-blue mb-1">
                            <Activity className="w-4 h-4" /> Plan Duration
                          </div>
                          <p className="text-cool-gray">
                            {prescription.start_date || "N/A"} → {prescription.end_date || "N/A"}
                          </p>
                        </div>

                        {/* Medications */}
                        {medications.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-soft-blue flex items-center gap-1 font-medium">
                              <Pill className="w-4 h-4" />
                              Medications ({medications.length})
                            </p>
                            {medications.map((med, mi) => (
                              <div
                                key={mi}
                                className="p-3 rounded-lg bg-soft-blue/5 border border-soft-blue/10 text-sm"
                              >
                                <p className="font-semibold text-soft-coral">{med.name}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-cool-gray text-xs">
                                  <span>
                                    <span className="text-soft-blue">Dosage:</span> {med.dosage}
                                  </span>
                                  <span>
                                    <span className="text-soft-blue">Frequency:</span>{" "}
                                    {med.frequency}
                                  </span>
                                  <span>
                                    <span className="text-soft-blue">Duration:</span>{" "}
                                    {med.duration}
                                  </span>
                                  {med.time && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {med.time}
                                    </span>
                                  )}
                                  {med.instructions && (
                                    <span>
                                      <span className="text-soft-blue">Instructions:</span>{" "}
                                      {med.instructions}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}
