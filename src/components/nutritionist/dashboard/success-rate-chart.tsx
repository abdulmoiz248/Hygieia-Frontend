"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Target } from "lucide-react"

const successData = [
  { name: "Goals Achieved", value: 94, color: "var(--color-mint-green)" },
  { name: "In Progress", value: 4, color: "var(--color-soft-blue)" },
  { name: "Not Achieved", value: 2, color: "var(--color-soft-coral)" },
]

export function SuccessRateChart() {
  return (
    <Card className="scale-in bg-white/60">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" style={{ color: "var(--color-mint-green)" }} />
          <span>Patient Success Rate</span>
        </CardTitle>
        <CardDescription>Goal achievement distribution across all patients</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            achieved: {
              label: "Goals Achieved",
              color: "var(--color-mint-green)",
            },
            progress: {
              label: "In Progress",
              color: "var(--color-soft-blue)",
            },
            notAchieved: {
              label: "Not Achieved",
              color: "var(--color-soft-coral)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={successData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {successData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
