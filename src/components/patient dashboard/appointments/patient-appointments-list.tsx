"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Calendar,
  MapPin,
  Link,
  X,
  AlertCircle,
  CalendarDays,
  RefreshCw,
  CheckCircle2,
  BanIcon,
  
} from "lucide-react"
import { usePatientAppointmentsStore } from "@/store/patient/appointments-store"

import { AppointmentStatus } from "@/types/patient/appointment"
import { useRouter } from "next/navigation"


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import type { Appointment } from "@/types/patient/appointment"

const CANCELLATION_REASONS = [
  { id: "schedule-conflict", label: "Schedule Conflict" },
  { id: "feeling-better", label: "Feeling Better / No Longer Needed" },
  { id: "found-another", label: "Found Another Doctor" },
  { id: "emergency", label: "Personal Emergency" },
  { id: "transport", label: "Transportation Issues" },
  { id: "other", label: "Other" },
]

const STATUS_TABS = [
  { label: "Upcoming", value: AppointmentStatus.Upcoming },
  { label: "Completed", value: AppointmentStatus.Completed },
  { label: "Cancelled", value: AppointmentStatus.Cancelled },
] as const

// @ts-nocheck // (for now, to avoid type headaches around the doctor object which is currently very inconsistent across appointments. Will be fixed once we have a proper API and can standardize the data shape)

type PatientAppointmentsListProps = {
  onReport?: (appointment: Appointment) => void
}

export function PatientAppointmentsList({  }: PatientAppointmentsListProps) {
  const { appointments, cancelAppointment } = usePatientAppointmentsStore()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<AppointmentStatus>(AppointmentStatus.Upcoming)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [cancellationReason, setCancellationReason] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredAppointments = appointments.filter((apt) => apt.status === activeTab)

  const appointmentsByMonth = filteredAppointments.reduce(
    (acc, apt) => {
      const month = new Date(apt.date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
      if (!acc[month]) acc[month] = []
      acc[month].push(apt)
      return acc
    },
    {} as Record<string, typeof filteredAppointments>
  )

  const getModeIcon = (mode: string) => {
    const lower = mode.toLowerCase()
    if (lower === "physical" || lower === "in-person") return <MapPin className="h-4 w-4" />
    return <Link className="h-4 w-4" />
  }

  const formatTime = (time: string) => {
    const parts = time.split(":")
    return `${parts[0]}:${parts[1]}`
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short" })

  const getDoctorName = (apt: (typeof appointments)[0]) =>
    (apt.doctor as any)?.name ?? "Unknown Doctor"

  const getDoctorAvatar = (apt: (typeof appointments)[0]) =>
    (apt.doctor as any)?.img ?? (apt.doctor as any)?.avatar ?? "/placeholder.svg"

  const getDoctorSpecialty = (apt: (typeof appointments)[0]) =>
    (apt.doctor as any)?.specialty ?? (apt.doctor as any)?.specialization ?? ""

  const handleCancelClick = (id: string) => {
    setSelectedAppointmentId(id)
    setCancellationReason("")
    setAdditionalNotes("")
    setCancelModalOpen(true)
  }

  const handleReschedule = (id: string) => {
    localStorage.setItem("reschedule", id)
    router.push("/patient/appointments/new")
  }


  const handleCancelConfirm = async () => {
    if (!selectedAppointmentId || !cancellationReason) return
    setIsSubmitting(true)
    try {
      await cancelAppointment(selectedAppointmentId)
      toast.success("Appointment Cancelled", {
        description: "Your appointment has been cancelled successfully.",
      })
      setCancelModalOpen(false)
      setSelectedAppointmentId(null)
      setCancellationReason("")
      setAdditionalNotes("")
    } catch {
      toast.error("Failed to Cancel", {
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedAppointment = appointments.find((apt) => apt.id === selectedAppointmentId)

  const tabCounts = {
    [AppointmentStatus.Upcoming]: appointments.filter(
      (a) => a.status === AppointmentStatus.Upcoming
    ).length,
    [AppointmentStatus.Completed]: appointments.filter(
      (a) => a.status === AppointmentStatus.Completed
    ).length,
    [AppointmentStatus.Cancelled]: appointments.filter(
      (a) => a.status === AppointmentStatus.Cancelled
    ).length,
  }

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Completed:
        return (
          <Badge className="bg-mint-green/10 text-mint-green border border-mint-green/30 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case AppointmentStatus.Cancelled:
        return (
          <Badge className="bg-soft-coral/10 text-soft-coral border border-soft-coral/30 text-xs">
            <BanIcon className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  const emptyMessages = {
    [AppointmentStatus.Upcoming]: {
      title: "No upcoming appointments",
      sub: "Book an appointment with a doctor to get started.",
    },
    [AppointmentStatus.Completed]: {
      title: "No completed appointments yet",
      sub: "Your past appointments will appear here once completed.",
    },
    [AppointmentStatus.Cancelled]: {
      title: "No cancelled appointments",
      sub: "Any cancelled appointments will be listed here.",
    },
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-soft-coral mb-1">
          My Appointments
        </h1>
        <p className="text-cool-gray text-base">
          Track and manage all your doctor visits
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-cool-gray/20 pb-0">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.value
                ? "text-soft-coral"
                : "text-cool-gray hover:text-dark-slate-gray"
            }`}
          >
            {tab.label}
            {tabCounts[tab.value] > 0 && (
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.value
                    ? "bg-soft-coral/10 text-soft-coral"
                    : "bg-cool-gray/20 text-cool-gray"
                }`}
              >
                {tabCounts[tab.value]}
              </span>
            )}
            {activeTab === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-soft-coral rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {filteredAppointments.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-soft-coral/10 rounded-full">
                <Calendar className="h-8 w-8 text-soft-coral" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-slate-gray mb-1">
                  {emptyMessages[activeTab].title}
                </h3>
                <p className="text-sm text-cool-gray">{emptyMessages[activeTab].sub}</p>
              </div>
              {activeTab === AppointmentStatus.Upcoming && (
                <Button
                  onClick={() => router.push("/patient/appointments/new")}
                  className="bg-soft-blue hover:bg-soft-blue/90 text-white mt-2"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(appointmentsByMonth).map(([month, monthAppointments]) => (
            <div key={month}>
              {/* Month divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-gradient-to-r from-soft-coral to-soft-blue rounded-full" />
                <h2 className="text-sm font-semibold text-cool-gray uppercase tracking-wide">
                  {month}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthAppointments.map((appointment) => {
                  const doctorName = getDoctorName(appointment)
                  const doctorAvatar = getDoctorAvatar(appointment)
                  const specialty = getDoctorSpecialty(appointment)

                  return (
                    <Card
                      key={appointment.id}
                      className="border-0 bg-white/40 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      <CardContent className="p-0">
                        <div className="relative h-full flex flex-col">
                          {/* Type colour strip */}
                          <div
                            className={`h-1 w-full ${
                              appointment.type === "consultation"
                                ? "bg-soft-blue"
                                : appointment.type === "follow-up"
                                  ? "bg-mint-green"
                                  : appointment.type === "emergency"
                                    ? "bg-soft-coral"
                                    : "bg-cool-gray"
                            }`}
                          />

                          <div className="p-5 flex flex-col h-full">
                            {/* Doctor info */}
                            <div className="flex items-start gap-3 mb-4">
                              <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-soft-blue/20">
                                <AvatarImage src={doctorAvatar} />
                                <AvatarFallback className="text-xs font-semibold bg-gradient-to-r from-soft-blue to-soft-coral text-white">
                                  {doctorName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-dark-slate-gray truncate">
                                  {doctorName}
                                </h3>
                                <p className="text-xs text-cool-gray capitalize truncate">
                                  {specialty || appointment.type}
                                </p>
                              </div>
                              {activeTab !== AppointmentStatus.Upcoming &&
                                getStatusBadge(appointment.status)}
                            </div>

                            {/* Appointment meta */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-soft-blue flex-shrink-0" />
                                <span className="font-medium text-dark-slate-gray">
                                  {formatDate(appointment.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-soft-coral flex-shrink-0" />
                                <span className="font-medium text-dark-slate-gray">
                                  {formatTime(appointment.time)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="h-4 w-4 flex items-center justify-center text-soft-blue flex-shrink-0">
                                  {getModeIcon(appointment.mode)}
                                </div>
                                <span className="text-cool-gray capitalize">
                                  {appointment.mode}
                                </span>
                              </div>
                            </div>

                            {/* Notes preview */}
                            <div className="h-10 mb-4">
                              {appointment.notes && (
                                <p className="text-xs text-cool-gray italic line-clamp-2">
                                  &quot;{appointment.notes}&quot;
                                </p>
                              )}
                            </div>

                            {/* Actions – only for upcoming */}
                            {activeTab === AppointmentStatus.Upcoming && (
                              <div className="mt-auto flex flex-col gap-2">
                                <Button
                                  onClick={() => handleReschedule(appointment.id)}
                                  size="sm"
                                  className="w-full rounded-lg shadow-sm font-medium text-xs bg-gradient-to-r from-soft-blue to-mint-green text-white hover:opacity-90"
                                >
                                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                  Reschedule
                                </Button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCancelClick(appointment.id)
                                  }}
                                  className="w-full rounded-lg py-2 shadow-sm font-bold text-xs bg-soft-coral/10 text-soft-coral border border-soft-coral/20 hover:bg-soft-coral hover:text-white transition-colors duration-200 flex items-center justify-center gap-1"
                                >
                                  <X className="h-3 w-3" />
                                  Cancel Appointment
                                </button>
                              </div>
                            )}

                            {/* Completed — review + follow-up + report */}
                            {activeTab === AppointmentStatus.Completed && (
                              <div className="mt-auto flex flex-col gap-2">
                               
                                <button
                                  type="button"
                                  onClick={() => {
                                    localStorage.setItem("appointment", appointment.id)
                                    router.push("/patient/appointments/new")
                                  }}
                                  className="w-full rounded-lg py-2 text-xs font-medium border border-mint-green/50 text-mint-green hover:bg-mint-green hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5"
                                >
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  Book Follow-up
                                </button>

                             
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-soft-coral">
              <AlertCircle className="h-5 w-5" />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment && (
                <span>
                  Cancel your appointment with{" "}
                  <strong className="text-dark-slate-gray">
                    {getDoctorName(selectedAppointment)}
                  </strong>{" "}
                  on{" "}
                  <strong className="text-dark-slate-gray">
                    {new Date(selectedAppointment.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {formatTime(selectedAppointment.time)}
                  </strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-dark-slate-gray">
                Reason <span className="text-soft-coral">*</span>
              </Label>
              <RadioGroup
                value={cancellationReason}
                onValueChange={setCancellationReason}
                className="space-y-1"
              >
                {CANCELLATION_REASONS.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.id} id={`patient-${reason.id}`} />
                    <Label
                      htmlFor={`patient-${reason.id}`}
                      className="text-sm text-cool-gray cursor-pointer"
                    >
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-dark-slate-gray">
                Additional Notes{" "}
                <span className="text-cool-gray font-normal">(Optional)</span>
              </Label>
              <Textarea
                placeholder="Any additional context..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[60px] resize-none"
              />
            </div>

            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
              The doctor will be notified of the cancellation.
            </p>
          </div>

          <DialogFooter className="flex-shrink-0 flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setCancelModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Keep Appointment
            </Button>
            <Button
              onClick={handleCancelConfirm}
              disabled={!cancellationReason || isSubmitting}
              className="w-full sm:w-auto bg-soft-coral hover:bg-soft-coral/90 text-white"
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}