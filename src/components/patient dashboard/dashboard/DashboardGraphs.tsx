"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadialBarChart, RadialBar, Legend, Tooltip } from "recharts"
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

      {/* Side-by-side Nutrition & Monthly Progress */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row gap-6 w-full"
      >
        {/* Nutrition RadialBarChart Card */}
      <Nutrition/>
    
        {/* Monthly Health Progress Radar Chart Card */}
       
     <MonthlyProgress/>
      </motion.div>
    </motion.div>
  )
}
