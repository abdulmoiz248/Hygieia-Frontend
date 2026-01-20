"use client"

import {  useEffect, useState } from "react"
import { motion } from "framer-motion"

//import LogActivity from "@/components/patient dashboard/fitness/LogActivity"
import HealthDataModal from "@/components/patient dashboard/fitness/Cal"
import Garden from "@/components/patient dashboard/fitness/Garden"
import Week from "@/components/patient dashboard/fitness/week"
import TodayGoal from "@/components/patient dashboard/fitness/TodayGoal"
import Calories from "@/components/patient dashboard/fitness/Calories"
import DietPlan from "@/components/patient dashboard/fitness/DietPlan"
import MacroGraphToday from "@/components/patient dashboard/fitness/MacroGraph"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { usePatientFitnessStore } from "@/store/patient/fitness-store"
import WorkoutDashboard from "@/components/patient dashboard/fitness/workout-dashboard"



const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function FitnessPage() {
  // const [showLogActivity, setShowLogActivity] = useState(false)
  const [showBMICalculator, setShowBMICalculator] = useState(false)
  const profile = usePatientProfileStore((state) => state.profile)
  const fitnessStore = usePatientFitnessStore()

  useEffect(()=>{
      if (profile.id) {
        fitnessStore.fetchFitness(profile.id)
      }
  },[fitnessStore, profile.id])


  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soft-coral">Fitness & Diet</h1>
          <p className="text-cool-gray">Monitor your health journey and manage your nutrition</p>
        </div>

        <div className="flex gap-3">
       
        
         {/* <LogActivity showLogActivity={showLogActivity} setShowLogActivity={setShowLogActivity} /> */}
     
     <HealthDataModal showDialog={showBMICalculator} setShowDialog={setShowBMICalculator} />
     
    
        </div>
      </motion.div>

      <Garden/>

      <Week/>
      <TodayGoal/>

      {/* Enhanced Calorie Tracking */}
    <Calories/>
    <MacroGraphToday/>

      {/* Enhanced Active Diet Plan */}
     
<DietPlan/>
     
     <WorkoutDashboard/>
    
    </motion.div>
  )
}
