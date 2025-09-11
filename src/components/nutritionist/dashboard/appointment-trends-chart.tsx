"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Calendar } from "lucide-react"
import { useDashboardStore } from "@/store/nutritionist/dashboard-store"


// Hook to force chart re-render when window resizes (sidebar toggle)
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight])
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight])
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return size
}

export function AppointmentTrendsChart() {
    const { appointmentData, isLoading } = useDashboardStore()
  const [width] = useWindowSize()

  if(isLoading) return <>Loading...</>
  return (
    <Card className="w-full max-w-full sm:max-w-3xl mx-auto scale-in overflow-hidden bg-white/60">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "var(--color-mint-green)" }} />
          <span>Weekly Appointments</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Appointment completion rates by day of the week
        </CardDescription>
      </CardHeader>

      <CardContent className="overflow-hidden">
        <ChartContainer
          config={{
            scheduled: { label: "Scheduled", color: "var(--color-cool-gray)" },
            completed: { label: "Completed", color: "var(--color-mint-green)" },
            cancelled: { label: "Cancelled", color: "var(--color-soft-coral)" },
          }}
          className="h-[250px] sm:h-[300px] md:h-[350px] w-full"
        >
          <ResponsiveContainer key={width} width="100%" height="100%">
            <BarChart data={appointmentData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="scheduled" fill="var(--color-cool-gray)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="var(--color-mint-green)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" fill="var(--color-soft-coral)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
