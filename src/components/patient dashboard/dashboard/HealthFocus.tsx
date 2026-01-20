"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Pill, TrendingUp } from "lucide-react"

import {
  Card,
  CardContent
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
 
} from "recharts"
import { usePatientProfileStore } from "@/store/patient/profile-store"

export default function HealthFocus() {
  const user = usePatientProfileStore((store) => store.profile)
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }
  
  const medicationAdherence = [
    { week: "Week 1", adherence: 95, missed: 1, sideEffects: 0, effectiveness: 9.2 },
    { week: "Week 2", adherence: 88, missed: 3, sideEffects: 1, effectiveness: 8.8 },
    { week: "Week 3", adherence: 92, missed: 2, sideEffects: 0, effectiveness: 9.0 },
    { week: "Week 4", adherence: user.adherence , missed: 1, sideEffects: 0, effectiveness: 9.5 },
  ]

  const initialMetrics = [
    { name: "Diet", value: 25, color: "var(--color-mint-green)", icon: "🥗" },
    { name: "Sleep", value: 20, color: "var(--color-soft-blue)", icon: "😴" },
    { name: "Hydration", value: 20, color: "var(--color-cool-gray)", icon: "💧" },
  ]
  const [visibleMetrics, setVisibleMetrics] = useState(initialMetrics)
  const toggleMetric = (name: string) => {
    setVisibleMetrics(prev =>
      prev.some(m => m.name === name)
        ? prev.filter(m => m.name !== name)
        : [...prev, initialMetrics.find(m => m.name === name)!]
    )
  }
  const wellnessScore = Math.round(
    visibleMetrics.reduce((acc, m) => acc + m.value, 0) / visibleMetrics.length
  )

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* Health Focus (Donut) */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden ">
        <h3 className="pl-3 flex items-center gap-2 text-dark-slate-gray font-semibold mb-4">
          <Target className=" w-5 h-5 text-mint-green" /> Health Focus
        </h3>
        <CardContent className="p-0">
          <div className="flex flex-col items-center">
            <div className="w-full h-[220px] relative">
              <ChartContainer
                config={Object.fromEntries(
                  visibleMetrics.map(m => [m.name, { label: m.name, color: m.color }])
                )}
                className="h-full w-full p-0"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visibleMetrics}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={55}
                      dataKey="value"
                      labelLine={false}
                    >
                      {visibleMetrics.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          style={{ filter: "drop-shadow(0px 0px 3px rgba(0,0,0,0.15))" }}
                          className="cursor-pointer transition-transform duration-300 hover:scale-105"
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent className="bg-white border border-gray-200 text-dark-slate-gray shadow-md rounded-lg text-xs" />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-dark-slate-gray/60">Avg</p>
                <p className="text-lg font-bold text-dark-slate-gray">{wellnessScore}%</p>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex gap-2 flex-wrap justify-center">
              {initialMetrics.map(m => (
                <button
                  key={m.name}
                  onClick={() => toggleMetric(m.name)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-all duration-200 ${
                    visibleMetrics.some(vm => vm.name === m.name)
                      ? "bg-white/60 border-white/40"
                      : "bg-gray-100/50 border-gray-200 opacity-50"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication Adherence */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden p-4">
        <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold mb-4">
          <Pill className="w-5 h-5 text-mint-green" /> Medication Adherence
        </h3>
        <CardContent className="p-0 ">
          <div className="block">
            <div className="min-h-[220px]">
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
                    
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="space-y-4 ">
              <div className="p-3 bg-gradient-to-br from-mint-green/20 to-mint-green/10 rounded-xl border border-mint-green/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-mint-green" />
                  <span className="text-xs font-medium text-dark-slate-gray/70">Overall Adherence</span>
                </div>
                <div className="text-2xl font-bold text-mint-green">
                       {user.adherence}%
                 </div>
              </div>

             
            </div>
          </div>
        </CardContent>
      </Card>

    </motion.div>
  )
}
