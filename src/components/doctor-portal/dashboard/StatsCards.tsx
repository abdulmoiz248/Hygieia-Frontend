"use client"

import { motion } from "framer-motion"
import { Users, Calendar, FileText, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import CountUp from "@/blocks/TextAnimations/CountUp/CountUp"
import { useDoctorAppointmentStore } from "@/store/doctor/doctor-appointment-store"
import { useDoctorPrescriptionStore } from "@/store/doctor/doctor-prescription-store"
import { AppointmentStatus } from "@/types/patient/appointment"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

type StatCardData = {
  id: string
  title: string
  value: string | number
  subtitle?: string
  icon: "patients" | "calendar" | "plans" | "success"
  color: string
  colorText?: string
  trend?: string
}

const iconMap = {
  patients: Users,
  calendar: Calendar,
  plans: FileText,
  success: TrendingUp,
}

export default function DoctorStats() {
  const { appointments } = useDoctorAppointmentStore()
  const { prescriptions } = useDoctorPrescriptionStore()

  const upcomingToday = appointments.filter(
    (apt) => apt.status === AppointmentStatus.Upcoming
  ).length
  const activePrescriptions = prescriptions.length
  const totalPatients = new Set(appointments.map((apt) => apt.patient?.id)).size

  const mockGetDoctorStats = async (): Promise<StatCardData[]> => {
    return [
      {
        id: "patients",
        title: "Total Patients",
        value: totalPatients,
        icon: "patients",
        color: "soft-blue",
      },
      {
        id: "appointments",
        title: "Total Upcoming Appointments",
        value: upcomingToday,
        icon: "calendar",
        color: "mint-green",
      },
      {
        id: "plans",
        title: "Active Prescriptions",
        value: activePrescriptions,
        icon: "plans",
        color: "soft-coral",
      },
    ]
  }

  const [data, setData] = useState<StatCardData[] | null>(null)

  useEffect(() => {
    mockGetDoctorStats().then(setData)
  }, [appointments, prescriptions])

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-cool-gray py-10 text-sm">
        No dashboard data to show.
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6"
    >
      {data.map((card) => {
        const Icon = iconMap[card.icon as keyof typeof iconMap]
        return (
          <motion.div key={card.id} variants={itemVariants} className="h-full">
            <Card
              className={`h-full flex flex-col justify-between bg-gradient-to-br from-${card.color}/10 to-${card.color}/5 border-${card.color}/20`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{card.title}</p>
                    <p
                      className={`text-2xl font-bold ${
                        card.colorText
                          ? `text-${card.colorText}`
                          : `text-${card.color}`
                      }`}
                    >
                      {typeof card.value === "number" ? (
                        <CountUp
                          from={0}
                          to={card.value}
                          separator=","
                          direction="up"
                          duration={1}
                          className={
                            card.colorText
                              ? `text-${card.colorText}`
                              : `text-${card.color}`
                          }
                        />
                      ) : (
                        card.value
                      )}
                    </p>
                    {card.subtitle && (
                      <p className="text-xs text-cool-gray">{card.subtitle}</p>
                    )}
                    {card.trend && (
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {card.trend}
                      </p>
                    )}
                  </div>
                  {Icon && <Icon className={`w-8 h-8 text-${card.color}`} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
