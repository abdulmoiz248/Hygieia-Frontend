"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, FileText, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarComponent } from "@/components/ui/calendar"
import { mockDoctors } from "@/mocks/data"
import Link from "next/link"
import DoctorSelector from "@/components/patient dashboard/appointments/DoctorSelector"


import { useDispatch, useSelector } from "react-redux"
import { addAppointment } from "@/types/patient/appointmentsSlice"
import { v4 as uuidv4 } from "uuid"
import { RootState, store } from "@/store/patient/store"
import { AppointmentStatus, AppointmentTypes } from "@/types/patient/appointment"


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function NewAppointmentPage() {

  
  const user=useSelector((store:RootState)=>store.profile)
  const appointments=useSelector((store:RootState)=>store.appointments)
const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(Date.now() + 86400000))
const [showConfirmation, setShowConfirmation] = useState(false)

  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")
  const [reschedule,setreschedule]=useState(false)
  const dispatch=useDispatch()


  useEffect(()=>{
    const appointmentId=localStorage.getItem("appointment")
    if(appointmentId){
         const app = appointments.appointments.find((a) => a.id == appointmentId)
         if(app)
         {
          setSelectedDoctor(app.doctor.id)
          setAppointmentType(AppointmentTypes.FollowUp)
           localStorage.removeItem("appointment")
         }

    }
  },[])


  
  useEffect(()=>{
    const appointmentId=localStorage.getItem("reschedule")
    if(appointmentId){
         const app = appointments.appointments.find((a) => a.id == appointmentId)
         if(app)
         {
          setSelectedDoctor(app.doctor.id)
          setAppointmentType(app.type)
          setSelectedTime(app.time)
          setSelectedDate(new Date(app.date))
          setreschedule(true)
          setReason(app.notes || "")
           localStorage.removeItem("reschedule")
         }

    }
  },[])


  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="text-white bg-soft-blue hover:bg-soft-blue/90 " asChild>
          <Link href="/patient/appointments">
            <ArrowLeft className="w-4 h-4  " />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-soft-coral">Book New Appointment</h1>
          <p className="text-cool-gray">Schedule your consultation with a healthcare professional</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-soft-blue" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doctor Selection */}
          
<DoctorSelector   doctors={mockDoctors}
      value={selectedDoctor}
      onChange={setSelectedDoctor} />



          

              {/* Appointment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Appointment Type</label>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-snow-white">
                    <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="consultation">General Consultation</SelectItem>
                    <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="follow-up">Follow-up Visit</SelectItem>
                    <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="emergency">Emergency Consultation</SelectItem>
                    <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="checkup">Routine Checkup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reason for Visit */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Reason for Visit</label>
                <Textarea
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-soft-blue hover:bg-soft-blue/90 text-snow-white" : "text-cool-gray hover:bg-soft-blue/70 hover:text-snow-white"}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-soft-blue" >Phone Number</label>
                  <Input placeholder="+1 (555) 123-4567" value={user.phone} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-soft-blue">Email</label>
                  <Input placeholder="john.doe@example.com" value={user.email} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar & Summary */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mint-green" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0 w-full"
                disabled={(date:Date) => date < new Date()}
                showOutsideDays={false}
              />
            </CardContent>
          </Card>

          {/* Appointment Summary */}
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 ">
                <FileText className="w-5 h-5 text-soft-coral" />
                Appointment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Doctor:</span>
                  <span className="text-sm font-medium  text-soft-blue">
                    {selectedDoctor ? mockDoctors.find((d) => d.id === selectedDoctor)?.name : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Date:</span>
                  <span className="text-sm font-medium  text-soft-blue">
                    {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Time:</span>
                  <span className="text-sm font-medium  text-soft-blue">{selectedTime || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Type:</span>
                  <span className="text-sm font-medium  text-soft-blue">{appointmentType || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Fee:</span>
                  <span className="text-sm font-medium  text-soft-blue">
                    ${selectedDoctor ? mockDoctors.find((d) => d.id === selectedDoctor)?.consultationFee : "0"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                  disabled={!selectedDoctor || !selectedDate || !selectedTime || !appointmentType}
                onClick={() => {
    dispatch(
      addAppointment({
        id: uuidv4(),
        doctor: mockDoctors.find((d) => d.id === selectedDoctor)!,
        date: selectedDate!.toISOString(),
        time: selectedTime,
        status: AppointmentStatus.Upcoming,
        type: appointmentType as AppointmentTypes,
        notes: reason,
      })
    )
     setShowConfirmation(true)
  }}
               >
                  <Clock className="w-4 h-4 mr-2" />
                  {reschedule?'Reschedule':'Book Appointment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {showConfirmation && (
 <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 transition-opacity duration-300 ease-in-out">
  <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-md p-8 space-y-6 border border-soft-blue/20 animate-fadeIn scale-100">
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-soft-coral/10 text-soft-coral animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-dark-slate-gray tracking-wide">Appointment Confirmed</h2>
      <span className="text-xs font-semibold text-soft-blue bg-soft-blue/10 px-3 py-1 rounded-full shadow-sm">
        #CONF-{Math.floor(Math.random() * 10000)}
      </span>
    </div>

    <div className="space-y-4 text-sm text-dark-slate-gray">
      <div className="flex justify-between items-center">
        <span className="font-medium text-soft-blue">Doctor</span>
        <span>{mockDoctors.find((d) => d.id === selectedDoctor)?.name}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-soft-blue">Date</span>
        <span>{selectedDate?.toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-soft-blue">Time</span>
        <span>{selectedTime}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-soft-blue">Type</span>
        <span>{appointmentType}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-soft-blue">Fee</span>
        <span>${mockDoctors.find((d) => d.id === selectedDoctor)?.consultationFee}</span>
      </div>
    </div>

    <div className="pt-4">
      <Button
        onClick={() => {
          setShowConfirmation(false)
          setSelectedDoctor("")
          setAppointmentType("")
          setSelectedTime("")
          setReason("")
        }}
        className="w-full bg-soft-blue hover:bg-soft-blue/90 text-white py-3 rounded-xl text-base font-medium transition duration-200 shadow-md"
      >
        Close
      </Button>
    </div>
  </div>
</div>


)}

    </motion.div>
  )
}
