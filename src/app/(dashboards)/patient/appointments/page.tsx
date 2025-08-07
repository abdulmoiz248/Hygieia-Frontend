"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Filter, FileText, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {  CalendarComponent } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"



import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/patient/store"
import { cancelAppointment } from "@/types/patient/appointmentsSlice"
import { Appointment } from "@/types/patient/appointment"
import { useRouter } from "next/navigation"
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Extended mock data with meeting remarks


export default function AppointmentsPage() {
  const dispatch = useDispatch()
  const appointments = useSelector((state: RootState) => state.appointments.appointments)
  const router=useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())


  
    const handleDownload = () => {
    if (!selectedAppointment?.report) return
    const link = document.createElement("a")
    link.href = selectedAppointment.report
    link.download =  "appointment-report.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const filteredAppointments = appointments.filter((appointment) => {
    if (statusFilter === "all") return true
    return appointment.status === statusFilter
  })

  // Add appointment dates for calendar
  const appointmentDates = appointments.map((apt) => new Date(apt.date))

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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div
  variants={itemVariants}
  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
>
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-soft-coral">Appointments</h1>
    <p className="text-cool-gray text-sm md:text-base">Manage your medical appointments</p>
  </div>

  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-full sm:w-48">
        <Filter className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-snow-white">
        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="all">
          All Appointments
        </SelectItem>
        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="upcoming">
          Upcoming
        </SelectItem>
        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="completed">
          Completed
        </SelectItem>
        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="cancelled">
          Cancelled
        </SelectItem>
      </SelectContent>
    </Select>

    <Button className="w-full sm:w-auto bg-mint-green hover:bg-mint-green/90 text-white" asChild>
      <Link href="/patient/appointments/new">New Appointment</Link>
    </Button>
  </div>
</motion.div>


    
        <motion.div variants={itemVariants} className="bg-snow-white/20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mint-green" />
                Appointments Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-3xl border w-full"
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
      <AvatarImage src={appointment.doctor.avatar || "/placeholder.svg"} />
      <AvatarFallback>
        {appointment.doctor.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>

    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="font-semibold text-base text-dark-slate-gray break-words">
          {appointment.doctor.name}
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
    <motion.div variants={itemVariants}>
  <Card className="bg-snow-white/20">
    <CardHeader>
      <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
        <Clock className="w-5 h-5 text-mint-green" />
        Your Appointments
        <span className="text-mint-green">({filteredAppointments.length})</span>
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">
      {filteredAppointments.map((appointment) => (
        <motion.div
          key={appointment.id}
          whileHover={{ scale: 1.02 }}
          className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer  bg-white/40"
          onClick={() => setSelectedAppointment(appointment)}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex gap-4">
              <Avatar className="w-12 h-12 shrink-0">
                <AvatarImage src={appointment.doctor.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {appointment.doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 text-sm">
                <h3 className="font-semibold text-soft-blue text-base sm:text-lg">
                  {appointment.doctor.name}
                </h3>
                <p className="text-soft-coral">{appointment.doctor.specialty}</p>

                <div className="flex flex-wrap items-center gap-2 text-cool-gray mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-mint-green" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-mint-green" />
                    {appointment.time}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  <Badge variant="outline">{appointment.type}</Badge>
                  {appointment.report && (
                    <Badge className="bg-soft-blue text-snow-white">
                      <FileText className="w-3 h-3 mr-1" />
                      Report Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {appointment.status === "upcoming" && (
              <div className="flex gap-2 sm:justify-end justify-start flex-wrap mt-2 sm:mt-0">
                <Button className="bg-soft-blue text-snow-white" variant="outline" size="sm">
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white bg-soft-coral hover:bg-soft-coral/90 hover:text-black border-0"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {filteredAppointments.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-soft-coral mx-auto mb-4" />
          <p className="text-cool-gray">No appointments found</p>
          <Button
            variant="outline"
            className="mt-2 bg-soft-blue text-snow-white hover:bg-soft-blue/90"
            asChild
          >
            <Link href="/patient/appointments/new">Book Your First Appointment</Link>
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
</motion.div>

      {/* Appointment Details Modal */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-snow-white">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedAppointment.doctor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedAppointment.doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedAppointment.doctor.name}</h2>
                    <p className="text-cool-gray font-normal">{selectedAppointment.doctor.specialty}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Appointment Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cool-gray" />
                    <span className="text-sm">
                      <strong>Date:</strong> {selectedAppointment.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cool-gray" />
                    <span className="text-sm">
                      <strong>Time:</strong> {selectedAppointment.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedAppointment.status)}>{selectedAppointment.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedAppointment.type}</Badge>
                  </div>
                </div>

         
             

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedAppointment.status === "upcoming" && (
                    <>
                      <Button className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white">Reschedule</Button>
                      <Button
                      className="bg-soft-coral text-snow-white border-0"
                      onClick={()=>{
                        dispatch(cancelAppointment(selectedAppointment.id))
                        setSelectedAppointment(null)

                      }
                      
}
                       variant="outline">Cancel</Button>
                    </>
                  )}
                  {selectedAppointment.status === "completed" && selectedAppointment.report && (
                    <>
                      <Button onClick={handleDownload}
                      className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline"
                      className="hover:bg-mint-green hover:text-snow-white"
                       onClick={()=>{
                        localStorage.setItem('appointment',selectedAppointment.id)
                        router.push('/patient/appointments/new')
                       }}
                       
                      >Book Follow-up</Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
