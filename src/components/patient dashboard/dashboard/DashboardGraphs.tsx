"use client"

import { motion } from "framer-motion"
import { Activity, Pill, TrendingUp, Target, Heart, Droplets, Moon, Zap, Calendar, Clock, AlertCircle, Brain, Eye, Shield, Users, Globe, Smartphone, Wifi, Battery } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from "recharts"
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}


const monthlyProgress = [
  { month: "Jan", weight: 75, bmi: 24.2, bloodPressure: 125, heartRate: 72, energy: 7.5 },
  { month: "Feb", weight: 74.5, bmi: 24.0, bloodPressure: 122, heartRate: 70, energy: 7.8 },
  { month: "Mar", weight: 74, bmi: 23.8, bloodPressure: 120, heartRate: 68, energy: 8.2 },
  { month: "Apr", weight: 73.5, bmi: 23.6, bloodPressure: 118, heartRate: 69, energy: 8.5 },
  { month: "May", weight: 73, bmi: 23.4, bloodPressure: 115, heartRate: 67, energy: 8.8 },
  { month: "Jun", weight: 72.5, bmi: 23.2, bloodPressure: 113, heartRate: 66, energy: 9.0 },
]




// const nutritionBreakdown = [
//   { nutrient: "Protein", current: 85, target: 100, unit: "g", color: "var(--color-soft-coral)" },
//   { nutrient: "Carbs", current: 220, target: 250, unit: "g", color: "var(--color-mint-green)" },
//   { nutrient: "Fats", current: 65, target: 70, unit: "g", color: "var(--color-soft-blue)" },
//   { nutrient: "Fiber", current: 28, target: 30, unit: "g", color: "var(--color-cool-gray)" },
//   { nutrient: "Vitamins", current: 92, target: 100, unit: "%", color: "var(--color-dark-slate-gray)" },
// ]


export default function DashboardGraphs() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 lg:space-y-6 w-full">
      {/* Weekly Activity Overview - Enhanced */}
      <WeeklyActivity/>

{/* Health Focus Distribution - Enhanced */}
      <HealthFocus/>


   

  {/* Nutrition & Wellness - Dashboard Style */}

{/* <motion.div variants={itemVariants}>
  <Card className="bg-white/60 backdrop-blur-xl shadow-lg border border-white/30 rounded-2xl overflow-hidden">
    <CardHeader className="flex items-center justify-between pb-3 border-b border-white/20">
      <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold text-lg">
        <Droplets className="w-5 h-5 text-mint-green" /> Nutrition & Wellness
      </h3>
      <span className="text-xs text-dark-slate-gray/50">Today</span>
    </CardHeader>
    <CardContent className="grid gap-3 pt-4">
      {nutritionBreakdown.map((nutrient, index) => (
        <div 
          key={index} 
          className="p-3 bg-white/50 rounded-xl border border-white/20 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-dark-slate-gray/80 text-sm">{nutrient.nutrient}</span>
            <span className="font-semibold text-dark-slate-gray text-sm">
              <span style={{ color: nutrient.color }}>{nutrient.current}</span> / {nutrient.target} {nutrient.unit}
            </span>
          </div>
          <div className="relative w-full h-2 bg-cool-gray/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((nutrient.current / nutrient.target) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{ backgroundColor: nutrient.color }}
            />
          </div>
          <div className="text-right text-xs text-dark-slate-gray/60 mt-1">
            {Math.round((nutrient.current / nutrient.target) * 100)}% of goal
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
</motion.div> */}


<motion.div variants={itemVariants}>
  <Card className="w-full bg-white/50 backdrop-blur-lg shadow-md border border-white/25 rounded-2xl overflow-hidden">
    <CardHeader className="border-b border-white/30 px-6 py-3">
      <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold mb-0 text-lg">
        <Activity className="w-5 h-5 text-soft-blue" />
        Monthly Health Progress
      </h3>
    </CardHeader>
    <CardContent className="p-5">
      <div className="min-h-[220px]">
        <ChartContainer
          config={{
            weight: { label: "Weight (kg)", color: "#3b82f6" },
            bmi: { label: "BMI", color: "#10b981" },
            bloodPressure: { label: "Blood Pressure", color: "#f87171" },
            heartRate: { label: "Heart Rate", color: "#6b7280" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={220}>
            <RadarChart data={monthlyProgress}>
              <defs>
                <radialGradient id="weightGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.15} />
                </radialGradient>
                <radialGradient id="bmiGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.15} />
                </radialGradient>
                <radialGradient id="bpGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0.15} />
                </radialGradient>
                <radialGradient id="hrGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#6b7280" stopOpacity={0.15} />
                </radialGradient>
              </defs>
              <PolarGrid stroke="#d1d5db" opacity={0.3} />
              <PolarAngleAxis dataKey="month" stroke="#374151" fontSize={11} />
              <PolarRadiusAxis stroke="#374151" fontSize={11} />
              <Radar
                name="Weight"
                dataKey="weight"
                stroke="#3b82f6"
                fill="url(#weightGrad)"
                fillOpacity={0.7}
                strokeWidth={2}
              />
              <Radar
                name="BMI"
                dataKey="bmi"
                stroke="#10b981"
                fill="url(#bmiGrad)"
                fillOpacity={0.7}
                strokeWidth={2}
              />
              <Radar
                name="Blood Pressure"
                dataKey="bloodPressure"
                stroke="#f87171"
                fill="url(#bpGrad)"
                fillOpacity={0.7}
                strokeWidth={2}
              />
              <Radar
                name="Heart Rate"
                dataKey="heartRate"
                stroke="#6b7280"
                fill="url(#hrGrad)"
                fillOpacity={0.7}
                strokeWidth={2}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </CardContent>
  </Card>
</motion.div>




      {/* Stress & Mental Health - New */}
      {/* <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-soft-coral/10 to-soft-blue/10 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
              <div className="p-2 bg-soft-coral/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-soft-coral" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Stress & Mental Health</h3>
                <p className="text-sm font-normal text-dark-slate-gray/60">Monitor your mental wellness</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="min-h-[250px] lg:min-h-[300px]">
              <ChartContainer
                config={{
                  stress: { label: "Stress Level", color: "var(--color-soft-coral)" },
                  focus: { label: "Focus Level", color: "var(--color-mint-green)" },
                  productivity: { label: "Productivity", color: "var(--color-soft-blue)" },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <RadarChart data={stressLevels}>
                    <PolarGrid stroke="var(--color-cool-gray)" opacity={0.3} />
                    <PolarAngleAxis dataKey="time" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                    <PolarRadiusAxis stroke="var(--color-dark-slate-gray)" fontSize={12} />
                    <Radar
                      name="Stress Level"
                      dataKey="stress"
                      stroke="var(--color-soft-coral)"
                      fill="var(--color-soft-coral)"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Focus Level"
                      dataKey="focus"
                      stroke="var(--color-mint-green)"
                      fill="var(--color-mint-green)"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Productivity"
                      dataKey="productivity"
                      stroke="var(--color-soft-blue)"
                      fill="var(--color-soft-blue)"
                      fillOpacity={0.3}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}

    

  


    </motion.div>
  )
}
