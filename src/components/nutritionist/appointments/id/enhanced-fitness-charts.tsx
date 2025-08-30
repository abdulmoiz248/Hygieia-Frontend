"use client"

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import HealthMetrics from "./HealthMetrics"

export interface FitnessData {
  id: string
  created_at: string
  patient_id: string
  steps: number
  water: number
  sleep: number
  calories_burned: number
  calories_intake: number
  fat: number
  protein: number
  carbs: number
}

interface EnhancedFitnessChartsProps {
  data: FitnessData[]
}

export function EnhancedFitnessCharts({ data }: EnhancedFitnessChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>No fitness data available</p>
      </div>
    )
  }

  const chartData = data.map((item, index) => ({
    date: new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    fullDate: new Date(item.created_at).toLocaleDateString(),
    steps: item.steps || 0,
    water: item.water || 0,
    sleep: item.sleep || 0,
    calories_burned: item.calories_burned || 0,
    calories_intake: item.calories_intake || 0,
    fat: item.fat || 0,
    protein: item.protein || 0,
    carbs: item.carbs || 0,
    day: index + 1,
  }))

  const safeDivide = (num: number, denom: number) => (denom > 0 ? num / denom : 0)

  // Calculate averages
  const avgSteps = Math.round(safeDivide(data.reduce((s, i) => s + (i.steps || 0), 0), data.length))
  const avgWater = safeDivide(data.reduce((s, i) => s + (i.water || 0), 0), data.length).toFixed(1)
  const avgSleep = safeDivide(data.reduce((s, i) => s + (i.sleep || 0), 0), data.length).toFixed(1)
  const avgCaloriesBurned = Math.round(
    safeDivide(data.reduce((s, i) => s + (i.calories_burned || 0), 0), data.length)
  )
  const avgCaloriesIntake = Math.round(
    safeDivide(data.reduce((s, i) => s + (i.calories_intake || 0), 0), data.length)
  )

  // Latest week vs previous week comparison
  const latestWeek = data.slice(-7)
  const previousWeek = data.slice(-14, -7)

  const latestWeekAvgSteps = safeDivide(
    latestWeek.reduce((s, i) => s + (i.steps || 0), 0),
    latestWeek.length
  )
  const previousWeekAvgSteps = safeDivide(
    previousWeek.reduce((s, i) => s + (i.steps || 0), 0),
    previousWeek.length
  )

  const stepsChange =
    previousWeekAvgSteps > 0
      ? (((latestWeekAvgSteps - previousWeekAvgSteps) / previousWeekAvgSteps) * 100).toFixed(1)
      : "0.0"

  // Macronutrient distribution for latest day
  const latestDay = data[data.length - 1]
  const macroData = [
    { name: "Protein", value: latestDay?.protein || 0, color: "#FF6F61" },
    { name: "Carbs", value: latestDay?.carbs || 0, color: "#34D399" },
    { name: "Fat", value: latestDay?.fat || 0, color: "#3B82F6" },
  ]

  // Weekly summary data
  const weeklyData = []
  for (let i = 0; i < data.length; i += 7) {
    const week = data.slice(i, i + 7)
    if (week.length > 0) {
      weeklyData.push({
        week: `Week ${Math.floor(i / 7) + 1}`,
        steps: Math.round(safeDivide(week.reduce((s, i) => s + (i.steps || 0), 0), week.length)),
        water: safeDivide(week.reduce((s, i) => s + (i.water || 0), 0), week.length).toFixed(1),
        sleep: safeDivide(week.reduce((s, i) => s + (i.sleep || 0), 0), week.length).toFixed(1),
        calories_burned: Math.round(
          safeDivide(week.reduce((s, i) => s + (i.calories_burned || 0), 0), week.length)
        ),
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Overview */}
     <HealthMetrics
        avgSteps={avgSteps}
        stepsChange={stepsChange}
        avgWater={avgWater}
        avgSleep={avgSleep}
        avgCaloriesIntake={avgCaloriesIntake}
        avgCaloriesBurned={avgCaloriesBurned}
      />


<Card className="border-soft-blue/20 w-full bg-cool-gray/10">
  <CardHeader>
    <CardTitle className="text-soft-blue">Macronutrients</CardTitle>
    <CardDescription>Daily protein, carbs, and fat intake (grams)</CardDescription>
  </CardHeader>
  <CardContent className="w-full">
    <ChartContainer
      config={{
        protein: {
          label: "Protein (g)",
          color: "var(--color-soft-coral)",
        },
        carbs: {
          label: "Carbs (g)",
          color: "var(--color-mint-green)",
        },
        fat: {
          label: "Fat (g)",
          color: "var(--color-soft-blue)",
        },
      }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="protein" stroke="var(--color-soft-coral)" strokeWidth={2} />
          <Line type="monotone" dataKey="carbs" stroke="var(--color-mint-green)" strokeWidth={2} />
          <Line type="monotone" dataKey="fat" stroke="var(--color-soft-blue)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Steps Chart */}
  <Card className="border-soft-blue/20 bg-cool-gray/10">
    <CardHeader>
      <CardTitle className="text-soft-blue">Daily Steps</CardTitle>
      <CardDescription>Steps taken over the last 30 days</CardDescription>
    </CardHeader>
    <CardContent className="h-[250px]">
      <ChartContainer
        config={{
          steps: {
            label: "Steps",
            color: "var(--color-soft-blue)",
          },
        }}
        className="w-full h-full flex-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="steps"
              stroke="var(--color-soft-blue)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>

  {/* Water Intake Chart */}
  <Card className="border-mint-green/20 bg-cool-gray/10">
    <CardHeader>
      <CardTitle className="text-mint-green">Water Intake</CardTitle>
      <CardDescription>Daily water consumption (liters)</CardDescription>
    </CardHeader>
    <CardContent className="h-[250px]">
      <ChartContainer
        config={{
          water: {
            label: "Water (L)",
            color: "var(--color-mint-green)",
          },
        }}
        className="w-full h-full flex-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="water" fill="var(--color-mint-green)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>

  {/* Sleep Chart */}
  <Card className="border-soft-coral/20 bg-cool-gray/10">
    <CardHeader>
      <CardTitle className="text-soft-coral">Sleep Duration</CardTitle>
      <CardDescription>Hours of sleep per night</CardDescription>
    </CardHeader>
    <CardContent className="h-[250px]">
      <ChartContainer
        config={{
          sleep: {
            label: "Sleep (hrs)",
            color: "var(--color-soft-coral)",
          },
        }}
        className="w-full h-full flex-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="sleep"
              stroke="var(--color-soft-coral)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>

  {/* Calories Chart */}
  <Card className="border-cool-gray/20 bg-cool-gray/10">
    <CardHeader>
      <CardTitle className="text-cool-gray">Calories</CardTitle>
      <CardDescription>Burned vs Intake</CardDescription>
    </CardHeader>
    <CardContent className="h-[250px]">
      <ChartContainer
        config={{
          calories_burned: {
            label: "Burned",
            color: "var(--color-soft-coral)",
          },
          calories_intake: {
            label: "Intake",
            color: "var(--color-mint-green)",
          },
        }}
        className="w-full h-full flex-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="calories_burned"
              stroke="var(--color-soft-coral)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="calories_intake"
              stroke="var(--color-mint-green)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
</div>

   
    </div>
  )
}



