"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Heart } from "lucide-react"

const nutritionData = [
  { week: "Week 1", weightLoss: 12, muscleGain: 8, maintenance: 15 },
  { week: "Week 2", weightLoss: 15, muscleGain: 10, maintenance: 18 },
  { week: "Week 3", weightLoss: 18, muscleGain: 12, maintenance: 20 },
  { week: "Week 4", weightLoss: 22, muscleGain: 15, maintenance: 22 },
  { week: "Week 5", weightLoss: 25, muscleGain: 18, maintenance: 25 },
  { week: "Week 6", weightLoss: 28, muscleGain: 20, maintenance: 28 },
]

export function NutritionGoalsChart() {
  return (
    <Card className="scale-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5" style={{ color: "var(--color-soft-coral)" }} />
          <span>Nutrition Goals Progress</span>
        </CardTitle>
        <CardDescription>Weekly progress tracking by goal type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            weightLoss: {
              label: "Weight Loss",
              color: "var(--color-soft-coral)",
            },
            muscleGain: {
              label: "Muscle Gain",
              color: "var(--color-soft-blue)",
            },
            maintenance: {
              label: "Maintenance",
              color: "var(--color-mint-green)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="weightLoss"
                stackId="1"
                stroke="var(--color-soft-coral)"
                fill="var(--color-soft-coral)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="muscleGain"
                stackId="1"
                stroke="var(--color-soft-blue)"
                fill="var(--color-soft-blue)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="maintenance"
                stackId="1"
                stroke="var(--color-mint-green)"
                fill="var(--color-mint-green)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
