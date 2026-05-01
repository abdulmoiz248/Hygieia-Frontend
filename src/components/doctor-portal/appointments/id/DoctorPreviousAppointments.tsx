"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarClock,
  FileText,
  Pill,
  ClipboardList,
  TestTube,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import api from "@/lib/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  time: string
}

interface PreviousPrescription {
  id: string
  notes?: string
  startDate: string
  endDate: string
  status: string
  medications: Medication[]
  created_at: string
  appointment?: {
    id: string
    date: string
    time: string
    type: string
    mode: string
    status: string
    report?: string
    referredTests?: { id: string; name: string; category: string }[]
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DoctorPreviousAppointments({
  doctorId,
  patientId,
}: {
  doctorId: string
  patientId: string
}) {
  const [prescriptions, setPrescriptions] = useState<PreviousPrescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET /appointments/prescriptions/previous/{doctorId}/{patientId}
        const res = await api.get(`/appointments/prescriptions/previous/${doctorId}/${patientId}`)
        const data = res.data?.data || res.data || []
        setPrescriptions(Array.isArray(data) ? data : [])
      } catch (err: any) {
        setError(err.message || "Failed to load history")
      } finally {
        setLoading(false)
      }
    }

    if (doctorId && patientId) fetchData()
  }, [doctorId, patientId])

  if (loading) {
    return (
      <Card className="rounded-3xl border border-gray-100 shadow-md">
        <CardContent className="flex items-center justify-center py-12 text-cool-gray">
          <p className="text-sm animate-pulse">Loading appointment history…</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="rounded-3xl border border-gray-100 shadow-md">
        <CardContent className="flex items-center justify-center py-12 text-soft-coral">
          <p className="text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!prescriptions.length) {
    return (
      <Card className="rounded-3xl border border-gray-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
            <CalendarClock className="w-5 h-5" />
            Previous Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-cool-gray">
          No previous appointments found for this patient.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-3xl border border-gray-100 shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
          <CalendarClock className="w-5 h-5" />
          Previous Appointments & Prescriptions
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <Accordion type="single" collapsible className="space-y-3">
          {prescriptions.map((rx, i) => {
            const appt = rx.appointment

            return (
              <AccordionItem
                key={rx.id}
                value={`rx-${i}`}
                className="border border-cool-gray/20 rounded-2xl overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-4 py-3">
                  <div className="flex flex-col items-start text-left w-full gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-soft-coral">
                        {appt?.date
                          ? new Date(appt.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : new Date(rx.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                        {appt?.time ? ` at ${appt.time}` : ""}
                      </p>
                      <Badge
                        className={
                          rx.status === "active"
                            ? "bg-mint-green/20 text-mint-green border border-mint-green/30 text-xs"
                            : "bg-cool-gray/20 text-cool-gray border border-cool-gray/30 text-xs"
                        }
                      >
                        {rx.status}
                      </Badge>
                    </div>
                    {appt && (
                      <p className="text-xs text-cool-gray capitalize">
                        {appt.type} · {appt.mode}
                      </p>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4 space-y-3">
                  {/* Prescription period */}
                  <div className="p-3 rounded-xl bg-soft-blue/5 border border-soft-blue/15 text-sm">
                    <p className="text-soft-blue font-medium mb-1 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5" />
                      Prescription Period
                    </p>
                    <p className="text-dark-slate-gray/80">
                      {rx.startDate
                        ? new Date(rx.startDate).toLocaleDateString()
                        : "N/A"}{" "}
                      →{" "}
                      {rx.endDate
                        ? new Date(rx.endDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  {/* Medications */}
                  {rx.medications && rx.medications.length > 0 && (
                    <div className="p-3 rounded-xl bg-cool-gray/5 border border-cool-gray/20">
                      <p className="text-soft-blue font-medium mb-2 flex items-center gap-1.5 text-sm">
                        <Pill className="w-3.5 h-3.5" />
                        Medications ({rx.medications.length})
                      </p>
                      <div className="space-y-2">
                        {rx.medications.map((med, j) => (
                          <div
                            key={j}
                            className="p-2 bg-white rounded-lg border border-gray-100 text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-dark-slate-gray">{med.name}</p>
                              <Badge className="text-xs bg-soft-blue/10 text-soft-blue border-none">
                                {med.dosage}
                              </Badge>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-cool-gray">
                              {med.frequency && <span>🔁 {med.frequency}</span>}
                              {med.duration && <span>⏱ {med.duration}</span>}
                              {med.time && <span>🕐 {med.time}</span>}
                              {med.instructions && (
                                <span className="w-full text-dark-slate-gray/70 mt-0.5">
                                  ℹ {med.instructions}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {rx.notes && (
                    <div className="p-3 rounded-xl bg-cool-gray/5 border border-cool-gray/20 text-sm">
                      <p className="text-soft-blue font-medium mb-1 flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5" />
                        Doctor Notes
                      </p>
                      <p className="text-dark-slate-gray/80">{rx.notes}</p>
                    </div>
                  )}

                  {/* Referred Tests */}
                  {appt?.referredTests && appt.referredTests.length > 0 && (
                    <div className="p-3 rounded-xl bg-soft-coral/5 border border-soft-coral/15 text-sm">
                      <p className="text-soft-coral font-medium mb-2 flex items-center gap-1.5">
                        <TestTube className="w-3.5 h-3.5" />
                        Referred Lab Tests
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {appt.referredTests.map((test) => (
                          <Badge
                            key={test.id}
                            className="bg-soft-coral/10 text-soft-coral border border-soft-coral/20 text-xs"
                          >
                            {test.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Report */}
                  {appt?.report && (
                    <div className="p-3 rounded-xl bg-mint-green/5 border border-mint-green/15 text-sm">
                      <p className="text-mint-green font-medium mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Clinical Report (Summary)
                      </p>
                      <p className="text-dark-slate-gray/80 line-clamp-4">{appt.report}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}