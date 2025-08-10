"use client"

import { motion } from "framer-motion"

import DashboardStats from "@/components/patient dashboard/dashboard/DisplayStats"
import FolderApp from "@/components/patient dashboard/dashboard/FolderApp"
import WelcomeSection from "@/components/patient dashboard/dashboard/WelcomeSection"
import FitnessProgressGauges from "@/components/patient dashboard/dashboard/FitnessStats"
import DashboardGraphs from "@/components/patient dashboard/dashboard/DashboardGraphs"
import HealthInsights from "@/components/patient dashboard/dashboard/HealthInsights"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function DashboardPage() {
  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="space-y-6 lg:space-y-8 w-full"
    >
      {/* Welcome and Overview Section */}
      <div className="space-y-4 lg:space-y-6">
        <WelcomeSection />
        <DashboardStats />
      </div>

      {/* Fitness and Progress Section */}
      <div className="space-y-4 lg:space-y-6">
        <FitnessProgressGauges />
        <FolderApp />
      </div>

       <HealthInsights />

      {/* Advanced Analytics Section */}
   
        <DashboardGraphs />
  

   
       
       


  
    </motion.div>
  )
}
