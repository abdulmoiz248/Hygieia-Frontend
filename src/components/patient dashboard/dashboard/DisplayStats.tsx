'use client'

import { motion } from 'framer-motion'
import { Calendar, Flame, Pill, TrendingUp, HeartPulse } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

import CountUp from '@/blocks/TextAnimations/CountUp/CountUp'
import { Calendar1 } from '../CalendarIcon'
import { usePatientProfileStore } from '@/store/patient/profile-store'
import { usePatientMedicineStore } from '@/store/patient/medicine-store'
import { usePatientFitnessStore } from '@/store/patient/fitness-store'
import { usePatientAppointmentsStore } from '@/store/patient/appointments-store'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

type StatCardData = {
  id: string
  title: string
  value: string | number
  subtitle?: string
  icon: 'calendar' | 'pill' | 'flame' | 'score' | null
  color: string
  colorText?: string
  trend?: string
}

const iconMap = {
  calendar: Calendar,
  pill: Pill,
  flame: Flame,
  score: HeartPulse
}

export default function DashboardStats() {
  const user = usePatientProfileStore((state) => state.profile)
  const prescriptions = usePatientMedicineStore()
  const calories = usePatientFitnessStore()
  const appointments = usePatientAppointmentsStore((state) => state.appointments)
  const now = new Date()
  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) > now && apt.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const nextAppointment = upcomingAppointments[0]

  const mockGetDashboardStats = async (): Promise<StatCardData[]> => {
    return [
      {
        id: "appointment",
        title: nextAppointment?.doctor?.name ?? "No Appointment 🎉",
        value: nextAppointment
          ? new Date(nextAppointment.date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })
          : "-",
        subtitle: nextAppointment?.time ?? "-",
        icon: null,
        color: nextAppointment ? "soft-blue" : "mint-green",
      },
      {
        id: 'prescriptions',
        title: 'Active Prescriptions',
        value: prescriptions.Prescription.filter(p => p.status === 'active').length,
        subtitle: `${prescriptions.MedicineState.todaysMeds.filter(m => !m.taken).length} due today`,
        icon: 'pill',
        color: 'mint-green'
      },
      {
        id: 'calories',
        title: 'Calories Burned',
        value: calories.caloriesBurned,
        subtitle: 'Today',
        icon: 'flame',
        color: 'soft-coral'
      },
      {
        id: 'healthscore',
        title: 'Health Score',
        value: user.healthscore,
        subtitle: 'Today',
        icon: 'score',
        color: 'cool-gray'
      },
    ]
  }

  const [data, setData] = useState<StatCardData[] | null>(null)

  useEffect(() => {
    mockGetDashboardStats().then(setData)
  }, [])

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
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {data.map((card) => {
        const Icon = iconMap[card.icon as keyof typeof iconMap]
        return (
          <motion.div key={card.id} variants={itemVariants} className="h-full">
            <Card className={`h-full flex flex-col justify-between bg-gradient-to-br from-${card.color}/10 to-${card.color}/5 border-${card.color}/20`}>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.colorText ? `text-${card.colorText}` : `text-${card.color}`}`}>
                      {typeof card.value === 'number' ? (
                        <CountUp
                          from={0}
                          to={card.value}
                          separator=","
                          direction="up"
                          duration={1}
                          className={card.colorText ? `text-${card.colorText}` : `text-${card.color}`}
                        />
                      ) : (
                        card.value
                      )}
                    </p>
                    {card.subtitle && <p className="text-xs text-cool-gray">{card.subtitle}</p>}
                    {card.trend && (
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {card.trend}
                      </p>
                    )}
                  </div>
                  {Icon ? <Icon className={`w-8 h-8 text-${card.color}`} /> :
                    <Calendar1 className='text-cool-gray font-bold text-center'/>
                  }
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
