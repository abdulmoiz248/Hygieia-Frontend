"use client"

import { AppointmentsList } from "@/components/nutritionist/appointments/appointments-list"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { AppointmentStatus } from "@/types/patient/appointment"

import { motion, Variants } from "framer-motion"



export default function AppointmentsPage() {

  
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

  const { appointments, filters } = useAppointmentStore()

  const todayAppointments = appointments.filter((apt) => apt.status === AppointmentStatus.Completed || AppointmentStatus.Completed)
  const completedToday = appointments.filter((apt) => apt.status === AppointmentStatus.Completed).length
  const upcomingToday = appointments.filter((apt) => apt.status === AppointmentStatus.Upcoming).length
  const completionRate =
    todayAppointments.length > 0 ? Math.round((completedToday / todayAppointments.length) * 100) : 0

  return (

      <div className="space-y-4 sm:space-y-6 fade-in">
        {/* Header */}
       
  <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soft-coral"> Appointments</h1>
          <p className="text-cool-gray"> Manage your patient appointments and consultations</p>
        </div>

      
      </motion.div>
      
      

        {/* Appointments List */}
        <AppointmentsList />
      </div>
  
  )
}
