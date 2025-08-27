"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FitnessData } from "./enhanced-fitness-charts"

interface FitnessChartsProps {
  data: FitnessData[]
}

export function FitnessCharts({ data }: FitnessChartsProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.created_at).toLocaleDateString(),
    steps: item.steps,
    water: item.water,
    sleep: item.sleep,
    calories_burned: item.calories_burned,
    calories_intake: item.calories_intake,
    fat: item.fat,
    protein: item.protein,
    carbs: item.carbs,
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Steps Chart */}
      <Card className="border-soft-blue/20">
        <CardHeader>
          <CardTitle className="text-soft-blue">Daily Steps</CardTitle>
          <CardDescription>Steps taken over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              steps: {
                label: "Steps",
                color: "var(--color-soft-blue)",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="steps" stroke="var(--color-soft-blue)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Water Intake Chart */}
      <Card className="border-mint-green/20">
        <CardHeader>
          <CardTitle className="text-mint-green">Water Intake</CardTitle>
          <CardDescription>Daily water consumption (liters)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              water: {
                label: "Water (L)",
                color: "var(--color-mint-green)",
              },
            }}
            className="h-[200px]"
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
      <Card className="border-soft-coral/20">
        <CardHeader>
          <CardTitle className="text-soft-coral">Sleep Duration</CardTitle>
          <CardDescription>Hours of sleep per night</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sleep: {
                label: "Sleep (hrs)",
                color: "var(--color-soft-coral)",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="sleep" stroke="var(--color-soft-coral)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Calories Chart */}
      <Card className="border-cool-gray/20">
        <CardHeader>
          <CardTitle className="text-cool-gray">Calories</CardTitle>
          <CardDescription>Burned vs Intake</CardDescription>
        </CardHeader>
        <CardContent>
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
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="calories_burned" stroke="var(--color-soft-coral)" strokeWidth={2} />
                <Line type="monotone" dataKey="calories_intake" stroke="var(--color-mint-green)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Macronutrients Chart */}
      <Card className="border-soft-blue/20 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-soft-blue">Macronutrients</CardTitle>
          <CardDescription>Daily protein, carbs, and fat intake (grams)</CardDescription>
        </CardHeader>
        <CardContent>
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
            className="h-[300px]"
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
    </div>
  )
}
