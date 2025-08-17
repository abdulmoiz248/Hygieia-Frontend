"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Calendar } from "lucide-react"

const appointmentData = [
  { day: "Mon", scheduled: 12, completed: 10, cancelled: 2 },
  { day: "Tue", scheduled: 15, completed: 13, cancelled: 2 },
  { day: "Wed", scheduled: 18, completed: 16, cancelled: 2 },
  { day: "Thu", scheduled: 14, completed: 12, cancelled: 2 },
  { day: "Fri", scheduled: 16, completed: 14, cancelled: 2 },
  { day: "Sat", scheduled: 8, completed: 7, cancelled: 1 },
  { day: "Sun", scheduled: 6, completed: 5, cancelled: 1 },
]

export function AppointmentTrendsChart() {
  return (
    <Card className="scale-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" style={{ color: "var(--color-mint-green)" }} />
          <span>Weekly Appointments</span>
        </CardTitle>
        <CardDescription>Appointment completion rates by day of the week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            scheduled: {
              label: "Scheduled",
              color: "var(--color-cool-gray)",
            },
            completed: {
              label: "Completed",
              color: "var(--color-mint-green)",
            },
            cancelled: {
              label: "Cancelled",
              color: "var(--color-soft-coral)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="scheduled" fill="var(--color-cool-gray)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="completed" fill="var(--color-mint-green)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="cancelled" fill="var(--color-soft-coral)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
