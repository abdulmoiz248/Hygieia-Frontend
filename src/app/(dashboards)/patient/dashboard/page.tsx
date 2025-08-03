"use client"

import { motion } from "framer-motion"
import { Calendar, FileText, Activity, Pill, Clock, TrendingUp,  Target, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { mockAppointments, mockMedicalRecords, mockFitnessGoals } from "@/mocks/data"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import DashboardStats from "@/components/patient dashboard/dashboard/DisplayStats"
import {  useSelector } from "react-redux"
import type { RootState } from "@/store/patient/store"


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

// Enhanced mock data for charts
const weeklyActivity = [
  { day: "Mon", calories: 2200, burned: 450, steps: 8500, water: 6 },
  { day: "Tue", calories: 2100, burned: 380, steps: 7200, water: 7 },
  { day: "Wed", calories: 2300, burned: 520, steps: 9800, water: 8 },
  { day: "Thu", calories: 1900, burned: 300, steps: 6500, water: 5 },
  { day: "Fri", calories: 2400, burned: 600, steps: 11200, water: 9 },
  { day: "Sat", calories: 2600, burned: 700, steps: 12500, water: 8 },
  { day: "Sun", calories: 2200, burned: 400, steps: 8900, water: 7 },
]

const healthMetrics = [
  { name: "Exercise", value: 35, color: "#FF6B6B" },
  { name: "Diet", value: 25, color: "#4ECDC4" },
  { name: "Sleep", value: 20, color: "#45B7D1" },
  { name: "Hydration", value: 20, color: "#96CEB4" },
]

const monthlyProgress = [
  { month: "Jan", weight: 75, bmi: 24.2, bloodPressure: 125, heartRate: 72 },
  { month: "Feb", weight: 74.5, bmi: 24.0, bloodPressure: 122, heartRate: 70 },
  { month: "Mar", weight: 74, bmi: 23.8, bloodPressure: 120, heartRate: 68 },
  { month: "Apr", weight: 73.5, bmi: 23.6, bloodPressure: 118, heartRate: 69 },
  { month: "May", weight: 73, bmi: 23.4, bloodPressure: 115, heartRate: 67 },
]

// New comprehensive health data
const dailyHealthMetrics = [
  { time: "6 AM", heartRate: 65, bloodPressure: 115, mood: 7 },
  { time: "9 AM", heartRate: 72, bloodPressure: 120, mood: 8 },
  { time: "12 PM", heartRate: 78, bloodPressure: 125, mood: 8 },
  { time: "3 PM", heartRate: 75, bloodPressure: 122, mood: 7 },
  { time: "6 PM", heartRate: 80, bloodPressure: 128, mood: 6 },
  { time: "9 PM", heartRate: 68, bloodPressure: 118, mood: 8 },
]

const medicationAdherence = [
  { week: "Week 1", adherence: 95, missed: 1 },
  { week: "Week 2", adherence: 88, missed: 3 },
  { week: "Week 3", adherence: 92, missed: 2 },
  { week: "Week 4", adherence: 97, missed: 1 },
]

export default function DashboardPage() {
  const upcomingAppointments = mockAppointments.filter((apt) => apt.status === "upcoming").slice(0, 3)
  const recentRecords = mockMedicalRecords.slice(0, 3)
  const user=useSelector((state: RootState) => state.profile)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-dark-slate-gray mb-2"><span className="text-soft-coral">Welcome back,</span> {user.name}! 👋</h1>
        <p className="text-cool-gray">Here&apos;s what&apos;s happening with your health today.</p>
      </motion.div>

      {/* Quick Stats */}
   <DashboardStats/>

      {/* Enhanced Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Overview */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-soft-blue" />
                Weekly Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  calories: {
                    label: "Calories Consumed",
                    color: "hsl(var(--chart-1))",
                  },
                  burned: {
                    label: "Calories Burned",
                    color: "hsl(var(--chart-2))",
                  },
                  steps: {
                    label: "Steps",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="calories" fill="var(--color-calories)" name="Consumed" />
                    <Bar dataKey="burned" fill="var(--color-burned)" name="Burned" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Distribution */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-mint-green" />
                Health Focus Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  exercise: {
                    label: "Exercise",
                    color: "#FF6B6B",
                  },
                  diet: {
                    label: "Diet",
                    color: "#4ECDC4",
                  },
                  sleep: {
                    label: "Sleep",
                    color: "#45B7D1",
                  },
                  hydration: {
                    label: "Hydration",
                    color: "#96CEB4",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthMetrics}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {healthMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* New Enhanced Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Health Metrics */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-soft-coral" />
                Today&apos;s Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  heartRate: {
                    label: "Heart Rate (BPM)",
                    color: "hsl(var(--chart-1))",
                  },
                  bloodPressure: {
                    label: "Blood Pressure",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyHealthMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      stackId="1"
                      stroke="var(--color-heartRate)"
                      fill="var(--color-heartRate)"
                      fillOpacity={0.6}
                      name="Heart Rate"
                    />
                    <Area
                      type="monotone"
                      dataKey="bloodPressure"
                      stackId="2"
                      stroke="var(--color-bloodPressure)"
                      fill="var(--color-bloodPressure)"
                      fillOpacity={0.6}
                      name="Blood Pressure"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medication Adherence */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-mint-green" />
                Medication Adherence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  adherence: {
                    label: "Adherence %",
                    color: "hsl(var(--chart-1))",
                  },
                  missed: {
                    label: "Missed Doses",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={medicationAdherence}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="adherence"
                      stroke="var(--color-adherence)"
                      strokeWidth={3}
                      name="Adherence %"
                    />
                    <Line
                      type="monotone"
                      dataKey="missed"
                      stroke="var(--color-missed)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Missed Doses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Progress Tracking */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-soft-blue" />
              Monthly Health Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                weight: {
                  label: "Weight (kg)",
                  color: "hsl(var(--chart-1))",
                },
                bmi: {
                  label: "BMI",
                  color: "hsl(var(--chart-2))",
                },
                bloodPressure: {
                  label: "Blood Pressure",
                  color: "hsl(var(--chart-3))",
                },
                heartRate: {
                  label: "Resting Heart Rate",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--color-weight)"
                    strokeWidth={3}
                    name="Weight (kg)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="bmi"
                    stroke="var(--color-bmi)"
                    strokeWidth={2}
                    name="BMI"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bloodPressure"
                    stroke="var(--color-bloodPressure)"
                    strokeWidth={2}
                    name="Blood Pressure"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="heartRate"
                    stroke="var(--color-heartRate)"
                    strokeWidth={2}
                    name="Heart Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-soft-blue" />
                Upcoming Appointments
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/appointments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-soft-blue/20 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-soft-blue" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.doctor.name}</p>
                      <p className="text-sm text-cool-gray">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-soft-blue/20 text-soft-blue px-2 py-1 rounded-full">
                    {appointment.type}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Medical Records */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-mint-green" />
                Recent Medical Records
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/medical-records">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mint-green/20 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-mint-green" />
                    </div>
                    <div>
                      <p className="font-medium">{record.title}</p>
                      <p className="text-sm text-cool-gray">
                        {record.date} • {record.doctorName}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-mint-green/20 text-mint-green px-2 py-1 rounded-full">{record.type}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fitness Progress */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-soft-coral" />
              Today&apos;s Fitness Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockFitnessGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{goal.type}</span>
                    <span className="text-sm text-cool-gray">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
