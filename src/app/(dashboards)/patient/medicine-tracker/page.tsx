"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PrescriptionsPage from "@/components/patient dashboard/medicine-tracker/prescriptions"
import MedicineLogModal from '@/components/patient dashboard/medicine-tracker/medicine-log-modal'
import TodaysProgressCard from '@/components/patient dashboard/medicine-tracker/TodaysProgressCard'
import TodaysScheduleCard from '@/components/patient dashboard/medicine-tracker/TodaysScheduleCard'
import WeeklyProgressCard from '@/components/patient dashboard/medicine-tracker/WeeklyProgressCard'
import RecentActivityCard from '@/components/patient dashboard/medicine-tracker/RecentActivityCard'


import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store/patient/store"
import { toggleMedicineTaken } from "@/types/patient/medicineSlice"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Medicine {
  id: string
  name: string
  dosage: string
  time: string
  taken: boolean
  frequency: string
  instructions?: string
}

export default function MedicineTrackerPage() {

  
  const dispatch = useDispatch()
  const todaysMeds = useSelector((state: RootState) => state.medicine.MedicineState.todaysMeds)

//  const showLogDose = useState(false)
  const weeklyProgress = 85

  const toggleTaken = (id: string) => dispatch(toggleMedicineTaken(id))

  const takenCount = todaysMeds.filter((med) => med.taken).length
  const totalCount = todaysMeds.length
  const todayProgress = (takenCount / totalCount) * 100

  const upcomingMeds = todaysMeds.filter((med) => !med.taken)
  const nextMedicine = upcomingMeds.length > 0 ? upcomingMeds[0] : null
  return (
     <>
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soft-coral">Medicine Tracker</h1>
          <p className="text-cool-gray">Track your medications and stay on schedule</p>
        </div>
         {/* <MedicineLogModal  showLogDose={showLogDose}  setShowLogDose={setShowLogDose}/> */}
      </motion.div>

      {/* Today's Progress Overview */}
      <motion.div variants={itemVariants}>
        <TodaysProgressCard
          takenCount={takenCount}
          totalCount={totalCount}
          todayProgress={todayProgress}
          nextMedicine={nextMedicine && {
            name: nextMedicine.name,
            dosage: nextMedicine.dosage,
            time: nextMedicine.time,
          }}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <TodaysScheduleCard
            todaysMeds={todaysMeds}
            toggleMedicineTaken={toggleTaken}
          />
        </motion.div>

        {/* Weekly Progress & Reminders */}
        <motion.div variants={itemVariants} className="space-y-6">
          <WeeklyProgressCard weeklyProgress={weeklyProgress} />
        </motion.div>
      </div>

      {/* Medication History */}
      {/* <motion.div variants={itemVariants}>
        <RecentActivityCard
          recentActivity={[
            { medicine: "Lisinopril 10mg", time: "8:00 AM", status: "taken", date: "Today" },
            { medicine: "Vitamin D 1000 IU", time: "6:00 PM", status: "taken", date: "Yesterday" },
            { medicine: "Metformin 500mg", time: "12:00 PM", status: "missed", date: "Yesterday" },
            { medicine: "Aspirin 81mg", time: "8:00 PM", status: "taken", date: "2 days ago" },
                        { medicine: "Aspirin 81mg", time: "8:00 PM", status: "taken", date: "2 days ago" },
                                    { medicine: "Aspirin 81mg", time: "8:00 PM", status: "taken", date: "2 days ago" },
                                                { medicine: "Aspirin 81mg", time: "8:00 PM", status: "taken", date: "2 days ago" },
                                                            { medicine: "Aspirin 81mg", time: "8:00 PM", status: "taken", date: "2 days ago" },
          ]}
        />

      </motion.div> */}
              
    </motion.div>
   
    <PrescriptionsPage/>
    </>
  )
}
