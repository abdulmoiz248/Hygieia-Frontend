"use client"

import { useEffect, useMemo, useState } from "react"
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
import { usePatientDashboardAnalyticsStore } from "@/store/patient/dashboard-analytics-store"
import { reorderWeekDataFromToday } from "@/helpers/reorderWeekFromToday"

export default function HealthFocus() {
  const user = usePatientProfileStore((store) => store.profile)
  const healthFocus = usePatientDashboardAnalyticsStore((state) => state.healthFocus)
  const medicationAdherence = usePatientDashboardAnalyticsStore((state) => state.medicationAdherence)
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }

  const orderedMedicationAdherence = useMemo(
    () => reorderWeekDataFromToday(medicationAdherence, (entry) => entry.week),
    [medicationAdherence]
  )

  const initialMetrics = useMemo(
    () =>
      healthFocus.map((metric) => ({
        name: metric.name,
        value: metric.value,
        color: metric.color || "var(--color-cool-gray)",
        icon: metric.icon || "",
      })),
    [healthFocus]
  )

  const [visibleMetrics, setVisibleMetrics] = useState(initialMetrics)

  useEffect(() => {
    setVisibleMetrics(initialMetrics)
  }, [initialMetrics])

  

  const wellnessScore = Math.round(
    visibleMetrics.length
      ? visibleMetrics.reduce((acc, m) => acc + m.value, 0) / visibleMetrics.length
      : 0
  )

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* Health Focus (Donut) */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden p-4 flex flex-col">
        <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold mb-4">
          <Target className=" w-5 h-5 text-mint-green" /> Health Focus
        </h3>
        <CardContent className="p-0 flex-1 flex items-center justify-center">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[420px] h-[320px] relative">
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
                      outerRadius={120}
                      innerRadius={78}
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
                  <ComposedChart data={orderedMedicationAdherence}>
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
