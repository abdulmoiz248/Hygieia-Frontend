"use client"

import { motion } from "framer-motion"
import { Activity, Pill, TrendingUp, Target, Heart, Droplets, Moon, Zap, Calendar, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from "recharts"

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

// Enhanced data with more comprehensive health metrics
const weeklyActivity = [
  { day: "Mon", calories: 2200, burned: 450, steps: 8500, water: 6, sleep: 7.5, mood: 8 },
  { day: "Tue", calories: 2100, burned: 380, steps: 7200, water: 7, sleep: 6.8, mood: 7 },
  { day: "Wed", calories: 2300, burned: 520, steps: 9800, water: 8, sleep: 8.2, mood: 9 },
  { day: "Thu", calories: 1900, burned: 300, steps: 6500, water: 5, sleep: 6.5, mood: 6 },
  { day: "Fri", calories: 2400, burned: 600, steps: 11200, water: 9, sleep: 7.8, mood: 8 },
  { day: "Sat", calories: 2600, burned: 700, steps: 12500, water: 8, sleep: 8.5, mood: 9 },
  { day: "Sun", calories: 2200, burned: 400, steps: 8900, water: 7, sleep: 7.2, mood: 7 },
]

const healthMetrics = [
  { name: "Exercise", value: 35, color: "var(--color-soft-coral)", icon: "💪" },
  { name: "Diet", value: 25, color: "var(--color-mint-green)", icon: "🥗" },
  { name: "Sleep", value: 20, color: "var(--color-soft-blue)", icon: "😴" },
  { name: "Hydration", value: 20, color: "var(--color-cool-gray)", icon: "💧" },
]

const monthlyProgress = [
  { month: "Jan", weight: 75, bmi: 24.2, bloodPressure: 125, heartRate: 72, energy: 7.5 },
  { month: "Feb", weight: 74.5, bmi: 24.0, bloodPressure: 122, heartRate: 70, energy: 7.8 },
  { month: "Mar", weight: 74, bmi: 23.8, bloodPressure: 120, heartRate: 68, energy: 8.2 },
  { month: "Apr", weight: 73.5, bmi: 23.6, bloodPressure: 118, heartRate: 69, energy: 8.5 },
  { month: "May", weight: 73, bmi: 23.4, bloodPressure: 115, heartRate: 67, energy: 8.8 },
  { month: "Jun", weight: 72.5, bmi: 23.2, bloodPressure: 113, heartRate: 66, energy: 9.0 },
]

const dailyHealthMetrics = [
  { time: "6 AM", heartRate: 65, bloodPressure: 115, mood: 7, energy: 6.5 },
  { time: "9 AM", heartRate: 72, bloodPressure: 120, mood: 8, energy: 8.2 },
  { time: "12 PM", heartRate: 78, bloodPressure: 125, mood: 8, energy: 7.8 },
  { time: "3 PM", heartRate: 75, bloodPressure: 122, mood: 7, energy: 6.5 },
  { time: "6 PM", heartRate: 80, bloodPressure: 128, mood: 6, energy: 5.8 },
  { time: "9 PM", heartRate: 68, bloodPressure: 118, mood: 8, energy: 7.2 },
]

const medicationAdherence = [
  { week: "Week 1", adherence: 95, missed: 1, sideEffects: 0, effectiveness: 9.2 },
  { week: "Week 2", adherence: 88, missed: 3, sideEffects: 1, effectiveness: 8.8 },
  { week: "Week 3", adherence: 92, missed: 2, sideEffects: 0, effectiveness: 9.0 },
  { week: "Week 4", adherence: 97, missed: 1, sideEffects: 0, effectiveness: 9.5 },
]

const sleepQuality = [
  { day: "Mon", deep: 2.5, light: 4.0, rem: 1.5, total: 8.0, quality: 8.5 },
  { day: "Tue", deep: 2.0, light: 4.5, rem: 1.8, total: 8.3, quality: 7.8 },
  { day: "Wed", deep: 3.0, light: 3.8, rem: 2.0, total: 8.8, quality: 9.2 },
  { day: "Thu", deep: 1.8, light: 4.2, rem: 1.5, total: 7.5, quality: 6.5 },
  { day: "Fri", deep: 2.8, light: 4.0, rem: 1.8, total: 8.6, quality: 8.8 },
  { day: "Sat", deep: 3.2, light: 3.5, rem: 2.2, total: 8.9, quality: 9.5 },
  { day: "Sun", deep: 2.2, light: 4.3, rem: 1.6, total: 8.1, quality: 7.2 },
]

const nutritionBreakdown = [
  { nutrient: "Protein", current: 85, target: 100, unit: "g", color: "var(--color-soft-coral)" },
  { nutrient: "Carbs", current: 220, target: 250, unit: "g", color: "var(--color-mint-green)" },
  { nutrient: "Fats", current: 65, target: 70, unit: "g", color: "var(--color-soft-blue)" },
  { nutrient: "Fiber", current: 28, target: 30, unit: "g", color: "var(--color-cool-gray)" },
  { nutrient: "Vitamins", current: 92, target: 100, unit: "%", color: "var(--color-dark-slate-gray)" },
]

const stressLevels = [
  { time: "Morning", stress: 3, anxiety: 2, focus: 8, productivity: 9 },
  { time: "Afternoon", stress: 5, anxiety: 4, focus: 6, productivity: 7 },
  { time: "Evening", stress: 4, anxiety: 3, focus: 7, productivity: 6 },
  { time: "Night", stress: 2, anxiety: 1, focus: 5, productivity: 4 },
]

export default function DashboardGraphs() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Weekly Activity Overview - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-mint-green/10 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
              <div className="p-2 bg-soft-blue/20 rounded-lg">
                <Activity className="w-5 h-5 text-soft-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Weekly Activity Overview</h3>
                <p className="text-sm font-normal text-dark-slate-gray/60">Track your daily health metrics</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    calories: { label: "Calories Consumed", color: "var(--color-soft-blue)" },
                    burned: { label: "Calories Burned", color: "var(--color-soft-coral)" },
                    steps: { label: "Steps", color: "var(--color-mint-green)" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-cool-gray)" opacity={0.3} />
                      <XAxis dataKey="day" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <YAxis stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="calories" fill="var(--color-soft-blue)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="burned" fill="var(--color-soft-coral)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Water & Sleep Line Chart */}
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    water: { label: "Water (glasses)", color: "var(--color-soft-blue)" },
                    sleep: { label: "Sleep (hours)", color: "var(--color-mint-green)" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-cool-gray)" opacity={0.3} />
                      <XAxis dataKey="day" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <YAxis stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="water" 
                        stroke="var(--color-soft-blue)" 
                        strokeWidth={3}
                        dot={{ fill: "var(--color-soft-blue)", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "var(--color-soft-blue)", strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sleep" 
                        stroke="var(--color-mint-green)" 
                        strokeWidth={3}
                        dot={{ fill: "var(--color-mint-green)", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "var(--color-mint-green)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Focus Distribution - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-mint-green/10 to-soft-blue/10 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
              <div className="p-2 bg-mint-green/20 rounded-lg">
                <Target className="w-5 h-5 text-mint-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Health Focus Distribution</h3>
                <p className="text-sm font-normal text-dark-slate-gray/60">Your wellness priorities breakdown</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-[300px] flex items-center justify-center">
                <ChartContainer
                  config={{
                    Exercise: { label: "Exercise", color: "var(--color-soft-coral)" },
                    Diet: { label: "Diet", color: "var(--color-mint-green)" },
                    Sleep: { label: "Sleep", color: "var(--color-soft-blue)" },
                    Hydration: { label: "Hydration", color: "var(--color-cool-gray)" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={healthMetrics}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {healthMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Metrics Breakdown */}
              <div className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/30 rounded-xl border border-white/20">
                    <div className="text-2xl">{metric.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-dark-slate-gray/80">{metric.name}</span>
                        <span className="font-bold text-lg" style={{ color: metric.color }}>
                          {metric.value}%
                        </span>
                      </div>
                      <div className="w-full bg-cool-gray/20 rounded-full h-2 mt-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${metric.value}%`, 
                            backgroundColor: metric.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Vital Signs - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-soft-coral/10 to-soft-blue/10 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
              <div className="p-2 bg-soft-coral/20 rounded-lg">
                <Heart className="w-5 h-5 text-soft-coral" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Today's Vital Signs</h3>
                <p className="text-sm font-normal text-dark-slate-gray/60">Real-time health monitoring</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Area Chart */}
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    heartRate: { label: "Heart Rate", color: "var(--color-soft-coral)" },
                    bloodPressure: { label: "Blood Pressure", color: "var(--color-soft-blue)" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyHealthMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-cool-gray)" opacity={0.3} />
                      <XAxis dataKey="time" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <YAxis stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="heartRate"
                        stackId="1"
                        stroke="var(--color-soft-coral)"
                        fill="var(--color-soft-coral)"
                        fillOpacity={0.6}
                        name="Heart Rate"
                      />
                      <Area
                        type="monotone"
                        dataKey="bloodPressure"
                        stackId="2"
                        stroke="var(--color-soft-blue)"
                        fill="var(--color-soft-blue)"
                        fillOpacity={0.6}
                        name="Blood Pressure"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Current Stats */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-soft-coral/20 to-soft-coral/10 rounded-xl border border-soft-coral/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-soft-coral" />
                      <span className="text-sm font-medium text-dark-slate-gray/70">Heart Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-soft-coral">
                      {dailyHealthMetrics[3]?.heartRate || 75} <span className="text-sm">BPM</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-soft-blue/20 to-soft-blue/10 rounded-xl border border-soft-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-soft-blue" />
                      <span className="text-sm font-medium text-dark-slate-gray/70">Blood Pressure</span>
                    </div>
                    <div className="text-2xl font-bold text-soft-blue">
                      {dailyHealthMetrics[3]?.bloodPressure || 122} <span className="text-sm">mmHg</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-mint-green/20 to-mint-green/10 rounded-xl border border-mint-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-mint-green" />
                    <span className="text-sm font-medium text-dark-slate-gray/70">Current Energy Level</span>
                  </div>
                  <div className="text-2xl font-bold text-mint-green">
                    {dailyHealthMetrics[3]?.energy || 6.5} <span className="text-sm">/10</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Medication Adherence - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-mint-green/10 to-soft-coral/10 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
              <div className="p-2 bg-mint-green/20 rounded-lg">
                <Pill className="w-5 h-5 text-mint-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Medication Adherence</h3>
                <p className="text-sm font-normal text-dark-slate-gray/60">Track your treatment compliance</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    adherence: { label: "Adherence %", color: "var(--color-mint-green)" },
                    effectiveness: { label: "Effectiveness", color: "var(--color-soft-coral)" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={medicationAdherence}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-cool-gray)" opacity={0.3} />
                      <XAxis dataKey="week" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <YAxis stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="adherence" fill="var(--color-mint-green)" radius={[4, 4, 0, 0]} />
                      <Line 
                        type="monotone" 
                        dataKey="effectiveness" 
                        stroke="var(--color-soft-coral)" 
                        strokeWidth={3}
                        dot={{ fill: "var(--color-soft-coral)", strokeWidth: 2, r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Adherence Stats */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-mint-green/20 to-mint-green/10 rounded-xl border border-mint-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-mint-green" />
                    <span className="text-sm font-medium text-dark-slate-gray/70">Overall Adherence</span>
                  </div>
                  <div className="text-3xl font-bold text-mint-green">
                    {Math.round(medicationAdherence.reduce((acc, week) => acc + week.adherence, 0) / medicationAdherence.length)}%
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gradient-to-br from-soft-coral/20 to-soft-coral/10 rounded-lg border border-soft-coral/20">
                    <div className="text-sm text-dark-slate-gray/70 mb-1">Missed Doses</div>
                    <div className="text-lg font-bold text-soft-coral">
                      {medicationAdherence.reduce((acc, week) => acc + week.missed, 0)}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-br from-soft-blue/20 to-soft-blue/10 rounded-lg border border-soft-blue/20">
                    <div className="text-sm text-dark-slate-gray/70 mb-1">Side Effects</div>
                    <div className="text-lg font-bold text-soft-blue">
                      {medicationAdherence.reduce((acc, week) => acc + week.sideEffects, 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sleep Quality Analysis - New */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-mint-green/10 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
              <div className="p-2 bg-soft-blue/20 rounded-lg">
                <Moon className="w-5 h-5 text-soft-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Sleep Quality Analysis</h3>
                <p className="text-sm font-normal text-dark-slate-gray/60">Monitor your sleep patterns</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stacked Area Chart */}
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    deep: { label: "Deep Sleep", color: "var(--color-dark-slate-gray)" },
                    light: { label: "Light Sleep", color: "var(--color-soft-blue)" },
                    rem: { label: "REM Sleep", color: "var(--color-mint-green)" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sleepQuality}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-cool-gray)" opacity={0.3} />
                      <XAxis dataKey="day" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <YAxis stroke="var(--color-dark-slate-gray)" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="deep"
                        stackId="1"
                        stroke="var(--color-dark-slate-gray)"
                        fill="var(--color-dark-slate-gray)"
                        fillOpacity={0.8}
                        name="Deep Sleep"
                      />
                      <Area
                        type="monotone"
                        dataKey="light"
                        stackId="1"
                        stroke="var(--color-soft-blue)"
                        fill="var(--color-soft-blue)"
                        fillOpacity={0.6}
                        name="Light Sleep"
                      />
                      <Area
                        type="monotone"
                        dataKey="rem"
                        stackId="1"
                        stroke="var(--color-mint-green)"
                        fill="var(--color-mint-green)"
                        fillOpacity={0.6}
                        name="REM Sleep"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Sleep Stats */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-soft-blue/20 to-soft-blue/10 rounded-xl border border-soft-blue/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-soft-blue" />
                    <span className="text-sm font-medium text-dark-slate-gray/70">Average Sleep Duration</span>
                  </div>
                  <div className="text-2xl font-bold text-soft-blue">
                    {(sleepQuality.reduce((acc, day) => acc + day.total, 0) / sleepQuality.length).toFixed(1)}h
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gradient-to-br from-mint-green/20 to-mint-green/10 rounded-lg border border-mint-green/20">
                    <div className="text-sm text-dark-slate-gray/70 mb-1">Best Quality</div>
                    <div className="text-lg font-bold text-mint-green">
                      {Math.max(...sleepQuality.map(day => day.quality))}/10
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-br from-soft-coral/20 to-soft-coral/10 rounded-lg border border-soft-coral/20">
                    <div className="text-sm text-dark-slate-gray/70 mb-1">Deep Sleep</div>
                    <div className="text-lg font-bold text-soft-coral">
                      {(sleepQuality.reduce((acc, day) => acc + day.deep, 0) / sleepQuality.length).toFixed(1)}h
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Nutrition & Wellness - New */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-mint-green/10 to-soft-coral/10 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
              <div className="p-2 bg-mint-green/20 rounded-lg">
                <Droplets className="w-5 h-5 text-mint-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nutrition & Wellness</h3>
                <p className="text-sm font-normal text-dark-slate-gray/60">Track your daily nutrition goals</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {nutritionBreakdown.map((nutrient, index) => (
                <div key={index} className="p-4 bg-white/30 rounded-xl border border-white/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-dark-slate-gray/80">{nutrient.nutrient}</span>
                    <span className="font-bold text-lg" style={{ color: nutrient.color }}>
                      {nutrient.current}/{nutrient.target} {nutrient.unit}
                    </span>
                  </div>
                  <div className="w-full bg-cool-gray/20 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${Math.min((nutrient.current / nutrient.target) * 100, 100)}%`, 
                        backgroundColor: nutrient.color 
                      }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-sm text-dark-slate-gray/60">
                      {Math.round((nutrient.current / nutrient.target) * 100)}% of daily goal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Health Progress - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-mint-green/10 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
              <div className="p-2 bg-soft-blue/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-soft-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Monthly Health Progress</h3>
                <p className="text-sm font-normal text-dark-slate-gray/60">Long-term health trends</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  weight: { label: "Weight (kg)", color: "var(--color-soft-coral)" },
                  bmi: { label: "BMI", color: "var(--color-mint-green)" },
                  bloodPressure: { label: "Blood Pressure (mmHg)", color: "var(--color-soft-blue)" },
                  heartRate: { label: "Heart Rate (BPM)", color: "var(--color-dark-slate-gray)" },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-cool-gray)" opacity={0.3} />
                    <XAxis dataKey="month" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                    <YAxis yAxisId="left" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="weight" fill="var(--color-soft-blue)" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="left" type="monotone" dataKey="bmi" stroke="var(--color-mint-green)" strokeWidth={3} dot={{ fill: "var(--color-mint-green)", strokeWidth: 2, r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="bloodPressure" stroke="var(--color-soft-blue)" strokeWidth={2} dot={{ fill: "var(--color-soft-blue)", strokeWidth: 2, r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="var(--color-dark-slate-gray)" strokeWidth={2} dot={{ fill: "var(--color-dark-slate-gray)", strokeWidth: 2, r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stress & Mental Health - New */}
      <motion.div variants={itemVariants}>
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
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  stress: { label: "Stress Level", color: "var(--color-soft-coral)" },
                  focus: { label: "Focus Level", color: "var(--color-mint-green)" },
                  productivity: { label: "Productivity", color: "var(--color-soft-blue)" },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
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
      </motion.div>
    </motion.div>
  )
}
