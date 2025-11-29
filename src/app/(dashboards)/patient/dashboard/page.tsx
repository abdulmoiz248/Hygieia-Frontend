"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const fitbitStatus = searchParams.get('fitbit')
    const error = searchParams.get('error')
    
    if (fitbitStatus === 'connected') {
      toast({
        title: "Success!",
        description: "Fitbit connected successfully! Your data will be synced automatically.",
        variant: "default",
      })
      window.history.replaceState({}, '', window.location.pathname)
    }
    
    if (error === 'no_email') {
      toast({
        title: "Error",
        description: "Email not provided. Please try again.",
        variant: "destructive",
      })
    } else if (error === 'user_not_found') {
      toast({
        title: "Error",
        description: "User not found. Please make sure you're logged in.",
        variant: "destructive",
      })
    } else if (error === 'fitbit_save_failed') {
      toast({
        title: "Error",
        description: "Failed to save Fitbit connection. Please try again.",
        variant: "destructive",
      })
    }
    
    if (error) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams, toast])

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
