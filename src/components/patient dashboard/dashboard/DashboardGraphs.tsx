"use client"

import { motion } from "framer-motion"

import WeeklyActivity from "./WeeklyActivity"
import HealthFocus from "./HealthFocus"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}



export default function DashboardGraphs() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 lg:space-y-6 w-full">
      <WeeklyActivity />
      <HealthFocus />

     
     
    </motion.div>
  )
}
