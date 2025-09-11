"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, MoreVertical, CheckCircle, XCircle, Calendar } from "lucide-react"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { AppointmentStatus } from "@/types/patient/appointment"
import { useRouter } from "next/navigation"



export function AppointmentsList() {
  const { appointments,    updateAppointmentStatus } =
    useAppointmentStore()

    const router=useRouter()

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

 


  const handleCancelAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, AppointmentStatus.Cancelled)
  }




  return (
    <>
     <div>
          <h1 className="text-3xl font-bold text-soft-coral">Upcoming Appointments</h1>
          <p className="text-cool-gray">Stay on top of your schedule</p>
        </div>


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
  className={`rounded-2xl border-l-4 shadow-md hover:shadow-xl transition-all duration-300 
    backdrop-blur-lg bg-gradient-to-br from-snow-white via-cool-gray/10 to-soft-blue/5 
    border-${appointment.status === "upcoming" ? "soft-blue" : appointment.status === "completed" ? "mint-green" : "soft-coral"}`}
>
  <CardContent className="p-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      
      {/* Left Side */}
      <div className="flex items-start gap-5 flex-1">
        <div className="relative">
          <Avatar className="h-14 w-14 ring-4 ring-white shadow-md">
            <AvatarImage src={appointment.patient?.avatar || "/placeholder.svg"} />
            <AvatarFallback
              className="text-base font-semibold bg-gradient-to-r from-soft-blue to-soft-coral text-white"
            >
              {appointment.patient?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + Status */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="font-bold text-lg text-dark-slate-gray truncate">
              {appointment.patient?.name}
            </h3>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-mint-green/20 text-dark-slate-gray rounded-full px-3 py-1 shadow-sm"
            >
              {getStatusIcon(appointment.status)}
              <span className="capitalize">{appointment.status}</span>
            </Badge>
          </div>

          {/* Type + Mode */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="flex items-center gap-1 bg-soft-blue/10 text-soft-blue rounded-md px-3 py-1">
              <span>📋</span>{appointment.type}
            </Badge>
            <Badge className="flex items-center gap-1 bg-soft-coral/10 text-soft-coral rounded-md px-3 py-1">
              <span>🎥</span>{appointment.mode}
            </Badge>
            
          </div>

          {/* Time */}
 <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
  <Clock className="h-4 w-4 text-soft-coral" />
  <div className="flex flex-col leading-tight">
    <span className="text-dark-slate-gray font-semibold">
      {new Date(appointment.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </span>
    <span className="text-xs text-muted-foreground">
      {appointment.time}
    </span>
  </div>
</div>


          {/* Notes */}
          {appointment.notes && (
            <p className="mt-3 text-sm italic border-l-2 text-dark-slate-gray rounded">
              &quot;{appointment.notes}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {appointment.status === "upcoming" && (
          <Button
            onClick={() => router.push(`/nutritionist/appointments/${appointment.id}`)}
            size="sm"
            className="bg-gradient-to-r from-mint-green to-soft-blue text-white hover:opacity-90 rounded-full shadow-md"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Mark Done</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-md rounded-xl">
            {appointment.status === "upcoming" && (
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50"
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

 
      
    </>
  )
}
