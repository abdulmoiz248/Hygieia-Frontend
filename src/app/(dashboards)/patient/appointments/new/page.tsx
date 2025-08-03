"use client"

import { useState } from "react"
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function NewAppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")

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
                  <Input placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-soft-blue">Email</label>
                  <Input placeholder="john.doe@example.com" />
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
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
