"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Activity } from "lucide-react"

const patientData = [
  { month: "Jan", newPatients: 18, totalPatients: 210 },
  { month: "Feb", newPatients: 22, totalPatients: 225 },
  { month: "Mar", newPatients: 15, totalPatients: 235 },
  { month: "Apr", newPatients: 28, totalPatients: 247 },
  { month: "May", newPatients: 19, totalPatients: 260 },
  { month: "Jun", newPatients: 24, totalPatients: 275 },
]

export function PatientMetricsChart() {
  return (
    <Card className="scale-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" style={{ color: "var(--color-soft-blue)" }} />
          <span>Patient Growth</span>
        </CardTitle>
        <CardDescription>Monthly patient acquisition and total patient count</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            newPatients: {
              label: "New Patients",
              color: "var(--color-soft-coral)",
            },
            totalPatients: {
              label: "Total Patients",
              color: "var(--color-soft-blue)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="newPatients"
                stroke="var(--color-soft-coral)"
                strokeWidth={3}
                dot={{ fill: "var(--color-soft-coral)", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="totalPatients"
                stroke="var(--color-soft-blue)"
                strokeWidth={3}
                dot={{ fill: "var(--color-soft-blue)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
