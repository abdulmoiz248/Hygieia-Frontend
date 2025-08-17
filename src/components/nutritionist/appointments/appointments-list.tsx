"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, MoreVertical, CheckCircle, XCircle, Calendar } from "lucide-react"
import { AppointmentDetailsModal } from "./appointment-details-modal"
import { MarkDoneModal } from "./mark-done-modal"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { AppointmentStatus } from "@/types/patient/appointment"


export function AppointmentsList() {
  const { appointments,  setSelectedAppointment,  updateAppointmentStatus } =
    useAppointmentStore()

    const filteredAppointments=appointments.filter((apt)=>apt.status==AppointmentStatus.Upcoming)


 

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
      case "no-show":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleMarkDone = (appointment: any) => {
    setSelectedAppointment(appointment)
  }



  const handleCancelAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, AppointmentStatus.Cancelled)
  }




  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card className="scale-in">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-soft-coral" />
                <h3 className="text-lg font-medium mb-2 text-dark-slate-gray">No appointments found</h3>
                <p className="text-sm">No appointments found. Once patients book, they’ll appear here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
          <Card
  key={appointment.id}
  className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-cool-gray/10 backdrop-blur-md"
>
  <CardContent className="p-5 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left Side: Avatar + Details */}
      <div className="flex items-start sm:items-center gap-4 flex-1">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
          <AvatarImage src={appointment.patient?.avatar || "/placeholder.svg"} />
          <AvatarFallback
            style={{ backgroundColor: "var(--color-soft-blue)", color: "white" }}
            className="text-sm sm:text-base"
          >
            {appointment.patient?.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Name + Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg truncate text-soft-coral">
              {appointment.patient?.name}
            </h3>
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-mint-green/80 text-dark-slate-gray rounded-full px-3 py-1"
            >
              {getStatusIcon(appointment.status)}
              <span className="capitalize text-xs">{appointment.status}</span>
            </Badge>
          </div>

          {/* Type + Mode */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge
              variant="secondary"
              className="bg-soft-blue/10 text-soft-blue capitalize px-2.5 py-0.5 rounded-lg"
            >
              {appointment.type}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-soft-coral/10 text-soft-coral capitalize px-2.5 py-0.5 rounded-lg"
            >
              {appointment.mode}
            </Badge>
          </div>

          {/* Time */}
          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-soft-coral" />
              <span>{appointment.time}</span>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 italic border-l-2 border-soft-coral pl-3 line-clamp-2">
              "{appointment.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center justify-end gap-2">
        {appointment.status === "upcoming" && (
          <Button
            onClick={() => handleMarkDone(appointment)}
            size="sm"
            className="bg-[var(--color-soft-blue)] text-snow-white hover:bg-[var(--color-soft-blue)]/90 rounded-full shadow-sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Mark Done</span>
            <span className="sm:hidden">Done</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {appointment.status === "upcoming" && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </CardContent>
</Card>

          ))
        )}
      </div>

      {/* Modals */}
      <AppointmentDetailsModal />
      <MarkDoneModal />
    </>
  )
}
