"use client"

import { AppointmentsList } from "@/components/nutritionist/appointments/appointments-list"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { AppointmentStatus } from "@/types/patient/appointment"

import { motion, Variants } from "framer-motion"





import { Calendar} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import {  CalendarComponent } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"





export default function AppointmentsPage() {

  
   const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-soft-blue text-white"
      case "completed":
        return "bg-mint-green text-white"
      case "cancelled":
        return "bg-soft-coral text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

  const { appointments,fetchAppointments,isLoading } = useAppointmentStore()
 const appointmentDates = appointments.map((apt) => new Date(apt.date))
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    

      useEffect(() => {
     if(appointments.length==0)
        fetchAppointments(AppointmentStatus.Upcoming)  
      
    }, [fetchAppointments])
  
    if (isLoading) return <p>Loading...</p>
  
    
  return (

      <div className="space-y-4 sm:space-y-6 fade-in">
        {/* Header */}
       
  <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soft-coral"> Appointments</h1>
          <p className="text-cool-gray"> Manage your patient appointments and consultations</p>
        </div>

      
      </motion.div>
      

        <motion.div variants={itemVariants} className="bg-white/40">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-mint-green" />
                      Appointments Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="w-full flex justify-center">
        <div className="w-full max-w-full overflow-x-auto">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-5 border w-[70vh] p-0 m-0 min-w-[280px] sm:min-w-[350px] md:min-w-[400px]"
            modifiers={{
              appointment: appointmentDates,
            }}
            showOutsideDays={false}
            modifiersStyles={{
              appointment: {
                backgroundColor: "var(--soft-blue)",
                color: "white",
                borderRadius: "50%",
              },
            }}
          />
        </div>
      </div>
      
      
                      <div>
                        <h3 className="font-bold mb-4 text-soft-blue">
                          {selectedDate ? `Appointments on ${selectedDate.toLocaleDateString()}` : "Select a date"}
                        </h3>
                        {selectedDate && (
                          <div className="space-y-3">
                            {appointments
                              .filter((apt) => new Date(apt.date).toDateString() === selectedDate.toDateString())
                              .map((appointment) => (
                              <div
        key={appointment.id}
        className="p-4  bg-cool-gray/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-md mx-auto sm:max-w-full"
      >
        <div className="flex items-start sm:items-center sm:flex-row flex-col gap-4 ">
          <Avatar className="w-12 h-12 shrink-0">
            <AvatarImage src={appointment.patient.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {appointment.patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
      
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-semibold text-base text-dark-slate-gray break-words">
                {appointment.patient.name}
              </h4>
              <Badge className={`${getStatusColor(appointment.status)} text-xs px-2 py-0.5`}>
                {appointment.status}
              </Badge>
            </div>
            <p className="text-sm text-cool-gray">{appointment.time}</p>
          </div>
        </div>
      </div>
      
                              ))}
                            {appointments.filter(
                              (apt) => new Date(apt.date).toDateString() === selectedDate?.toDateString(),
                            ).length === 0 && <p className="text-cool-gray text-center py-8">No appointments on this date</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            
      

        {/* Appointments List */}
        <AppointmentsList />
      </div>
  
  )
}
