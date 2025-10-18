"use client"

import {  useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, FileText, Coins } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarComponent } from "@/components/ui/calendar"
import Loader from '@/components/loader/loader'


import DoctorSelector from "@/components/patient dashboard/appointments/DoctorSelector"


import { useDispatch, useSelector } from "react-redux"
import  {createAppointment, updateAppointment}  from "@/types/patient/appointmentsSlice"
import { v4 as uuidv4 } from "uuid"
import { AppDispatch, RootState } from "@/store/patient/store"
import { Appointment, AppointmentMode, AppointmentStatus, AppointmentTypes } from "@/types/patient/appointment"
import { patientSuccess } from "@/toasts/PatientToast"
import { useNutritionists } from "@/hooks/useNutritionist"
import { useAvailableSlots } from "@/hooks/useFetchSlots"
import NewAppointmentHeader from "@/components/patient dashboard/appointments/new/Header"
import ShareDataCheckbox from "@/components/patient dashboard/appointments/new/Checker"
import { Doctor } from "@/types"
import { NutritionistProfile } from "@/store/nutritionist/userStore"


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
  const [appointmentMode, setAppointmentMode] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [rescheduleApp,setRescheduleApp]=useState('')
  const [reason, setReason] = useState("")
  const [reschedule,setreschedule]=useState(false)
  const [checked,setChecked]=useState(false)
  const dispatch=useDispatch<AppDispatch>()
  
  
  const { data: nutritionists, isLoading, isError } = useNutritionists()

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
          setRescheduleApp(app.id)
          setSelectedDoctor(app.doctor.id)
          setAppointmentType(app.type)
          setSelectedTime(app.time)
          setSelectedDate(new Date(app.date))
          setreschedule(true)
          setAppointmentMode(app.mode)
          setReason(app.notes || "")
           localStorage.removeItem("reschedule")
         }

    }
  },[])

  
  
  
  const doctors:Doctor[] | NutritionistProfile[] =nutritionists!
  

  const selectedDoctorRole = selectedDoctor ? "nutritionist" : undefined



const {
  data: slotData,
  isLoading: slotsLoading,
  isError: slotsError,
} = useAvailableSlots(selectedDoctor, selectedDoctorRole!, selectedDate ? new Date(Date.UTC(
  selectedDate.getFullYear(),
  selectedDate.getMonth(),
  selectedDate.getDate(),
  selectedDate.getHours(),
  selectedDate.getMinutes()
)) : undefined)


const timeSlots = slotData?.availableSlots ?? []

useEffect(()=>{
        if(timeSlots.length==0) setSelectedTime("")
  },[selectedDate])


    if (isLoading) {
       return (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader />
          </div>
        )
    }
  
    if (isError) {
      return <div className="text-center py-12 text-red-500">Failed to load data</div>
    }
  
 




  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <NewAppointmentHeader/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">

                <Card className="mb-3 bg-white/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mint-green" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
      <CalendarComponent
  //numberOfMonths={1}
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  className="rounded-5 border-0 w-full max-w-[450px] mx-auto"
  disabled={(date: Date) => date < new Date()}
  showOutsideDays={false}
  today={selectedDate}
/>

   
            </CardContent>
          </Card>

          <Card className="bg-white/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-soft-blue" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doctor Selection */}
          
<DoctorSelector   doctors={doctors!}
      value={selectedDoctor}
      onChange={setSelectedDoctor} />


<ShareDataCheckbox  checked={checked} onChange={()=>setChecked(!checked)}/>

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
              <div className="space-y-2">
  <label className="text-sm font-medium text-soft-blue">Appointment Mode</label>
  <Select value={appointmentMode} onValueChange={setAppointmentMode}>
    <SelectTrigger>
      <SelectValue placeholder="Select mode" />
    </SelectTrigger>
    <SelectContent className="bg-snow-white">
      <SelectItem className="hover:bg-mint-green hover:text-snow-white" value={AppointmentMode.Online}>Online</SelectItem>
      <SelectItem className="hover:bg-mint-green hover:text-snow-white" value={AppointmentMode.Physical}>Physical</SelectItem>
    </SelectContent>
  </Select>
</div>


              {/* Time Selection */}
            <div className="space-y-2">
  <label className="text-sm font-medium text-soft-blue">Select Time</label>

  {!selectedDate ? (
    <p className="text-cool-gray text-sm">Please select a date first</p>
  ) : slotsLoading ? (
    <p className="text-cool-gray text-sm">Loading time slots...</p>
  ) : slotsError ? (
    <p className="text-red-500 text-sm">Failed to load slots</p>
  ) : timeSlots.length === 0 ? (
    <p className="text-cool-gray text-sm">No available slots for this date</p>
  ) : (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((time: string) => (
        <Button
          key={time}
          size="sm"
          onClick={() => setSelectedTime(time)}
          className={
            selectedTime === time
              ? "bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
              : "text-cool-gray bg-transparent border-soft-blue border hover:bg-soft-blue/70 hover:text-snow-white"
          }
        >
          {time}
        </Button>
      ))}
    </div>
  )}
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
      

          {/* Appointment Summary */}
          <Card className={  (!selectedDoctor ||!appointmentType || !selectedDate || !selectedTime || !appointmentType)?'bg-cool-gray/10 sticky top-0':'bg-white/40 sticky top-0'}>
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
                    {selectedDoctor ? doctors?.find((d) => d.id === selectedDoctor)?.name : "Not selected"}
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
                    Rs.{selectedDoctor ? doctors?.find((d) => d.id === selectedDoctor)?.consultationFee : "0"}
                  </span>
                </div>
                 {checked && (
        <p className="text-xs text-soft-coral bg-white/60 border border-teal-200 rounded-md px-3 py-2">
          You have chosen to share your data. All your reports will be accessible to the doctor.
        </p>
      )}
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                disabled={!selectedDoctor || !selectedDate || !selectedTime || !appointmentType || !appointmentMode}

                onClick={() => {

                  if(reschedule){

                     if (!selectedDate) return
const utcDate = new Date(Date.UTC(
  selectedDate.getFullYear(),
  selectedDate.getMonth(),
  selectedDate.getDate(),
  selectedDate.getHours(),
  selectedDate.getMinutes()
))
                      dispatch(
      updateAppointment({
        patient:user,
       doctor: doctors.find((d) => d.id === selectedDoctor)!,
        id: rescheduleApp,
       
        date: utcDate.toISOString(),
        time: selectedTime,
        status: AppointmentStatus.Upcoming,
        type: appointmentType as AppointmentTypes,
        notes: reason,
      mode:appointmentMode as AppointmentMode,
      dataShared:checked
      } as Appointment)
    )
                  }else{

                      
                      if (!selectedDate) return
const utcDate = new Date(Date.UTC(
  selectedDate.getFullYear(),
  selectedDate.getMonth(),
  selectedDate.getDate(),
  selectedDate.getHours(),
  selectedDate.getMinutes()
))

dispatch(
  createAppointment({
    patient: user,
    doctor: doctors.find((d) => d.id === selectedDoctor)!,
    id: uuidv4(),
    date: utcDate.toISOString(),
    time: selectedTime,
    status: AppointmentStatus.Upcoming,
    type: appointmentType as AppointmentTypes,
    notes: reason,
    mode: appointmentMode as AppointmentMode,
    dataShared: checked
  } as Appointment)
)

     
                  }
  
       patientSuccess(`Appointment ${reschedule?'Rescheduled':'Booked'} with ${doctors?.find((d) => d.id === selectedDoctor)?.name} Successfully`)
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
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-md p-6 space-y-5 border border-soft-blue/20 animate-fadeIn scale-100">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-soft-coral/10 text-soft-coral animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-dark-slate-gray tracking-wide">Appointment Confirmed</h2>
            <span className="text-xs font-medium text-soft-blue bg-soft-blue/10 px-2 py-0.5 rounded-full">
              #CONF-{Math.floor(Math.random() * 10000)}
            </span>
          </div>
      
          <div className="space-y-3 text-sm text-dark-slate-gray">
            <div className="flex justify-between">
              <span className="font-medium text-soft-blue">Doctor</span>
              <span>{doctors?.find((d) => d.id === selectedDoctor)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-soft-blue">Date</span>
              <span>{selectedDate?.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-soft-blue">Time</span>
              <span>{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-soft-blue">Type</span>
              <span>{appointmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-soft-blue">Fee</span>
              <span>${doctors?.find((d) => d.id === selectedDoctor)?.consultationFee}</span>
            </div>
          </div>
      
          <div className="flex  pt-4">
  <button
onClick={() => {
  const doctorName = doctors?.find((d) => d.id === selectedDoctor)?.name || "Doctor";

  // Combine selectedDate and selectedTime
  const [hours, minutes, seconds] = selectedTime.split(":").map(Number);
  const startDate = selectedDate ? new Date(selectedDate) : new Date();
  startDate.setHours(hours, minutes, seconds, 0);

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1); // Add 1 hour

  const appointmentLocation = appointmentType === "physical" ? "physical" : "Online";

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment%20with%20${encodeURIComponent(
    doctorName
  )}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, "")}/${endDate
    .toISOString()
    .replace(/-|:|\.\d+/g, "")}&details=${encodeURIComponent(
      `Appointment Type: ${appointmentType}\nLocation: ${appointmentLocation}\nTime: ${selectedTime} - ${(
        hours + 1
      )
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  )}&location=${encodeURIComponent(appointmentLocation)}`;

  window.open(calendarUrl, "_blank");
}}

    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 bg-snow-white text-gray-800 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition duration-200"
  >
    <img
      src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png"
      alt="Google Calendar"
      className="h-5 w-5"
    />
    <span>Add to Google Calendar</span>
  </button>

 
</div>

      
          <div className="pt-2">
            <Button
              onClick={() => {
                setShowConfirmation(false);
                setSelectedDoctor("");
                setAppointmentType("");
                setSelectedTime("");
                setReason("");
              }}
              className="w-full bg-soft-blue hover:bg-soft-blue/90 text-white py-2 rounded-lg text-sm font-medium transition duration-200"
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
