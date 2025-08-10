import { RootState } from "@/store/patient/store"
import React from "react"
import { useSelector } from "react-redux"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartBarIcon } from "@heroicons/react/24/solid"

const MacroGraphToday = () => {
  const { proteinConsumed, fatConsumed, carbsConsumed } = useSelector(
    (state: RootState) => state.fitness
  )

  const data = [
    { macro: "Carbs", value: carbsConsumed },
    { macro: "Protein", value: proteinConsumed },
    { macro: "Fat", value: fatConsumed },
  ]

  const maxValue = Math.max(proteinConsumed, fatConsumed, carbsConsumed) || 100

  // Map each macro to a color for axis labels
  const macroColors: Record<string, string> = {
    Carbs: "#3a5ca9", // soft blue
    Protein: "#4ab68a", // mint green
    Fat: "#d47a6a", // soft coral
  }

  return (
    <Card className="w-full max-w-screen-lg mx-auto bg-white/40 pb-0">
      <CardHeader className="flex items-center space-x-3 ">
        <ChartBarIcon className="w-6 h-6 text-[#4ab68a]" />
        <CardTitle className="text-lg font-semibold text-[#2c3e50]">
          Today&apos;s Macros
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#748399" strokeDasharray="4 4" />
            <PolarAngleAxis
              dataKey="macro"
              tick={({ payload, x, y, textAnchor }) => {
                const color = macroColors[payload.value] || "#2c3e50"
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    fill={color}
                    fontWeight="700"
                    fontSize={14}
                  >
                    {payload.value}
                  </text>
                )
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, maxValue]}
              tick={{ fill: "#2c3e50" }}
            />
            <Radar
              name="Macros"
              dataKey="value"
              stroke="#4ab68a"
              fill="#4ab68a"
              fillOpacity={0.3}
              animationDuration={1000}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                border: "1px solid #748399",
              }}
              itemStyle={{ color: "#2c3e50", fontWeight: "700" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default MacroGraphToday
