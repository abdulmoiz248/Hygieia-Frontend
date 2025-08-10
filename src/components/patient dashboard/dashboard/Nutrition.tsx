"use client"

import {  Droplets } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ResponsiveContainer,  RadialBarChart, RadialBar, Legend, Tooltip } from "recharts"


export default function Nutrition() {
    const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const nutritionBreakdown = [
  { nutrient: "Protein", current: 85, target: 100, unit: "g", color: "var(--color-soft-coral)" },
  { nutrient: "Carbs", current: 220, target: 250, unit: "g", color: "var(--color-mint-green)" },
  { nutrient: "Fats", current: 65, target: 70, unit: "g", color: "var(--color-soft-blue)" }
]

// Prep data for RadialBarChart, add percentage and fill color
const nutritionChartData = nutritionBreakdown.map(n => ({
  name: n.nutrient,
  value: Math.min((n.current / n.target) * 100, 100),
  fill: n.color,
}))

  return (
     <Card className="bg-white/60 backdrop-blur-xl shadow-lg border border-white/30 rounded-2xl overflow-hidden flex-1 min-w-0">
          <CardHeader className="flex items-center justify-between pb-3 border-b border-white/20">
            <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold text-lg">
              <Droplets className="w-5 h-5 text-mint-green" /> Nutrition & Wellness
            </h3>
            <span className="text-xs text-dark-slate-gray/50">Today</span>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                barSize={18}
                data={nutritionChartData}
                startAngle={90}
                endAngle={-270} // full circle clockwise
              >
                <RadialBar
               
                  background
                
                  dataKey="value"
                  cornerRadius={8}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: 20, fontSize: 12, color: "var(--color-dark-slate-gray)" }}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  )
}
