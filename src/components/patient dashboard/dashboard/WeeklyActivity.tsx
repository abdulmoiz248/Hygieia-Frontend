"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Activity, Droplets } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, BarChart, Bar, LineChart, Line } from "recharts"
import { usePatientDashboardAnalyticsStore } from "@/store/patient/dashboard-analytics-store"
import { reorderWeekDataFromToday } from "@/helpers/reorderWeekFromToday"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function WeeklyActivity() {
  const weeklyActivity = usePatientDashboardAnalyticsStore((state) => state.weeklyActivity)
  const orderedWeeklyActivity = useMemo(
    () => reorderWeekDataFromToday(weeklyActivity, (entry) => entry.day),
    [weeklyActivity]
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className="space-y-6"
    >


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calories vs Burn */}
        <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold mb-4">
              <Activity className="w-5 h-5 text-soft-blue" /> Calories & Burn
            </h3>
            <ChartContainer
              config={{
                calories: { label: "Calories Consumed", color: "var(--color-soft-blue)" },
                burned: { label: "Calories Burned", color: "var(--color-soft-coral)" },
              }}
              className="w-full h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderedWeeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-cool-gray)" opacity={0.3} />
                  <XAxis dataKey="day" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                  <YAxis stroke="var(--color-dark-slate-gray)" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent  className="bg-snow-white/50" />}  />
                  <Bar dataKey="calories" fill="var(--color-soft-blue)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="burned" fill="var(--color-soft-coral)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Water & Sleep */}
        <Card className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold mb-4">
              <Droplets className="w-5 h-5 text-sky-500" /> Water & Sleep
            </h3>
            <ChartContainer
              config={{
                water: { label: "Water (glasses)", color: "var(--color-soft-blue)" },
                sleep: { label: "Sleep (hours)", color: "var(--color-mint-green)" },
              }}
              className="w-full h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderedWeeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-cool-gray)" opacity={0.3} />
                  <XAxis dataKey="day" stroke="var(--color-dark-slate-gray)" fontSize={12} />
                  <YAxis stroke="var(--color-dark-slate-gray)" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent className="bg-snow-white/50"/>} />
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
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
