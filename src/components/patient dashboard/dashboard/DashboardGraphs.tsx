"use client"

import { motion } from "framer-motion"

import WeeklyActivity from "./WeeklyActivity"
import HealthFocus from "./HealthFocus"
import Nutrition from "./Nutrition"
import MonthlyProgress from "./MonthlyProgress"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}


export default function DashboardGraphs() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 lg:space-y-6 w-full">
      <WeeklyActivity />
      <HealthFocus />

     
     
    </motion.div>
  )
}
