"use client"

import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"


const monthlyProgress = [
  { month: "Jan", weight: 75, bmi: 24.2, bloodPressure: 125, heartRate: 72, energy: 7.5 },
  { month: "Feb", weight: 74.5, bmi: 24.0, bloodPressure: 122, heartRate: 70, energy: 7.8 },
  { month: "Mar", weight: 74, bmi: 23.8, bloodPressure: 120, heartRate: 68, energy: 8.2 },
  { month: "Apr", weight: 73.5, bmi: 23.6, bloodPressure: 118, heartRate: 69, energy: 8.5 },
  { month: "May", weight: 73, bmi: 23.4, bloodPressure: 115, heartRate: 67, energy: 8.8 },
  { month: "Jun", weight: 72.5, bmi: 23.2, bloodPressure: 113, heartRate: 66, energy: 9.0 },
]


export default function MonthlyProgress() {
  return (
      <Card className="w-full lg:w-[60%] bg-white/50 backdrop-blur-lg shadow-md border border-white/25 rounded-2xl overflow-hidden flex-1 min-w-0">
          <CardHeader className="flex items-center justify-between pb-3 border-b border-white/20">
            <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold text-lg">
              <Activity className="w-5 h-5 text-soft-blue" />
              Monthly Health Progress
            </h3>
         
          </CardHeader>
       
          <CardContent className="p-4 pt-0 sm:p-5">
            <div className="min-h-[180px] sm:min-h-[220px]">
              <ChartContainer
                config={{
                  weight: { label: "Weight (kg)", color: "#3b82f6" },
                  bmi: { label: "BMI", color: "#10b981" },
                  bloodPressure: { label: "Blood Pressure", color: "#f87171" },
                  heartRate: { label: "Heart Rate", color: "#6b7280" },
                }}
                className="h-full mt-0"
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
  )
}
