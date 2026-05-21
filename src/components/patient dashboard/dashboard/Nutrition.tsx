"use client"

import { Droplets } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from "recharts"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { usePatientFitnessStore } from "@/store/patient/fitness-store"

/**
 * Fallback macro targets (grams) used when profile.limit is not set.
 * These match common 2000 kcal diet macros.
 */
const MACRO_FALLBACKS = {
  protein: 120,
  carbs: 250,
  fat: 65, // FIX: key was "fats" — API and store both use "fat"
}

export default function Nutrition() {
  const profileLimit = usePatientProfileStore(
    (store) => store.profile.limit as Record<string, unknown> | null | undefined
  )
  const fitness = usePatientFitnessStore()

  /**
   * FIX: was `targets.fats` — the API, store, and profile all use "fat" (no 's').
   * Added safe Number() cast and fallback so a missing limit never causes
   * divide-by-zero or NaN in the chart.
   */
  const proteinTarget =
    Number(profileLimit?.protein) > 0
      ? Number(profileLimit?.protein)
      : MACRO_FALLBACKS.protein

  const carbsTarget =
    Number(profileLimit?.carbs) > 0
      ? Number(profileLimit?.carbs)
      : MACRO_FALLBACKS.carbs

  // FIX: was profileLimit?.fats — changed to profileLimit?.fat
  const fatTarget =
    Number(profileLimit?.fat) > 0
      ? Number(profileLimit?.fat)
      : MACRO_FALLBACKS.fat

  const nutritionBreakdown = [
    {
      nutrient: "Protein",
      current: fitness.proteinConsumed,
      target: proteinTarget,
      unit: "g",
      color: "var(--color-soft-coral)",
    },
    {
      nutrient: "Carbs",
      current: fitness.carbsConsumed,
      target: carbsTarget,
      unit: "g",
      color: "var(--color-mint-green)",
    },
    {
      nutrient: "Fats",
      current: fitness.fatConsumed,
      target: fatTarget,
      unit: "g",
      color: "var(--color-soft-blue)",
    },
  ]

  const nutritionChartData = nutritionBreakdown.map((n) => ({
    name: `${n.nutrient} (${n.current}/${n.target}${n.unit})`,
    value: Math.min(Math.round((n.current / n.target) * 100), 100),
    fill: n.color,
  }))

  const allZero = nutritionBreakdown.every((n) => n.current === 0)

  return (
    <Card className="bg-white/60 backdrop-blur-xl shadow-lg border border-white/30 rounded-2xl overflow-hidden flex-1 min-w-0">
      <CardHeader className="flex items-center justify-between pb-3 border-b border-white/20">
        <h3 className="flex items-center gap-2 text-dark-slate-gray font-semibold text-lg">
          <Droplets className="w-5 h-5 text-mint-green" /> Nutrition & Wellness
        </h3>
        <span className="text-xs text-dark-slate-gray/50">Today</span>
      </CardHeader>
      <CardContent className="pt-4">
        {allZero ? (
          <div className="flex items-center justify-center h-[250px] text-sm text-dark-slate-gray/50">
            No nutrition data logged today.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              barSize={18}
              data={nutritionChartData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar background dataKey="value" cornerRadius={8} />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  paddingLeft: 20,
                  fontSize: 12,
                  color: "var(--color-dark-slate-gray)",
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [`${value}%`, name]}
                contentStyle={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        )}

        {/* Macro summary row */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          {nutritionBreakdown.map((n) => (
            <div key={n.nutrient} className="rounded-lg bg-white/40 p-2 border border-white/20">
              <div className="font-semibold text-dark-slate-gray/80">{n.nutrient}</div>
              <div style={{ color: n.color }} className="font-bold text-sm">
                {n.current}
                <span className="text-dark-slate-gray/40 font-normal">/{n.target}{n.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}