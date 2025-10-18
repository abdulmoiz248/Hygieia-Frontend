"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, CheckCircle, Calendar, Phone, Video } from "lucide-react"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { AppointmentStatus } from "@/types/patient/appointment"
import { useRouter } from "next/navigation"

export function AppointmentsList() {
  const { appointments } = useAppointmentStore()
  const router = useRouter()

  const filteredAppointments = appointments.filter((apt) => apt.status == AppointmentStatus.Upcoming)

  const appointmentsByDate = filteredAppointments.reduce(
    (acc, apt) => {
      const date = new Date(apt.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(apt)
      return acc
    },
    {} as Record<string, typeof filteredAppointments>,
  )

  const getModeIcon = (mode: string) => {
    return mode.toLowerCase() === "video" ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />
  }

  const isTimeReached = (aptDate: string, aptTime: string) => {
    try {
      const [hours, minutes] = aptTime.split(":").map(Number)
      const dateTime = new Date(aptDate)
      dateTime.setHours(hours, minutes, 0, 0)
      return new Date() >= dateTime
    } catch {
      return false
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-soft-coral mb-2">
          Upcoming Appointments <span className="text-cool-gray">({filteredAppointments.length})</span>
        </h1>
        <p className="text-cool-gray text-base">Stay on top of your schedule</p>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-soft-coral/10 rounded-full">
                <Calendar className="h-8 w-8 text-soft-coral" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-slate-gray mb-1">No appointments yet</h3>
                <p className="text-sm text-cool-gray">Once patients book appointments, they'll appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(appointmentsByDate).map(([date, dateAppointments]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-gradient-to-r from-soft-coral to-soft-blue rounded-full" />
                <h2 className="text-sm font-semibold text-cool-gray uppercase tracking-wide">{date}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateAppointments.map((appointment) => {
                  const canMarkDone = isTimeReached(appointment.date, appointment.time)

                  return (
                    <Card
                      key={appointment.id}
                      className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                      <CardContent className="p-0">
                        <div className="relative h-full flex flex-col">
                          <div
                            className={`h-1 w-full ${
                              appointment.type === "consultation"
                                ? "bg-soft-blue"
                                : appointment.type === "follow-up"
                                  ? "bg-mint-green"
                                  : "bg-soft-coral"
                            }`}
                          />

                          <div className="p-5 flex flex-col h-full">
                            <div className="flex items-start gap-3 mb-4">
                              <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-soft-blue/20">
                                <AvatarImage src={appointment.patient?.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs font-semibold bg-gradient-to-r from-soft-blue to-soft-coral text-white">
                                  {appointment.patient?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-dark-slate-gray truncate">
                                  {appointment.patient?.name}
                                </h3>
                                <p className="text-xs text-cool-gray capitalize">{appointment.type}</p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4 flex-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-soft-coral flex-shrink-0" />
                                <span className="font-medium text-dark-slate-gray">{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="h-4 w-4 flex items-center justify-center text-soft-blue flex-shrink-0">
                                  {getModeIcon(appointment.mode)}
                                </div>
                                <span className="text-cool-gray capitalize">{appointment.mode}</span>
                              </div>
                            </div>

                            {appointment.notes && (
                              <p className="text-xs text-cool-gray italic mb-4 line-clamp-2">"{appointment.notes}"</p>
                            )}

                          {
                            //  canMarkDone && 
                                  <Button
                              onClick={() => router.push(`/nutritionist/appointments/${appointment.id}`)}
                              size="sm"
                            
                             className={`w-full rounded-lg shadow-sm font-medium text-xs ${
 "bg-gradient-to-r from-mint-green to-soft-blue text-white hover:opacity-90"
   
}`}

                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                              <span>Complete</span>
                            </Button>
                          }
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
    </div>
  )
}
