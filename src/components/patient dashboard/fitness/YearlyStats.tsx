"use client"

import { useEffect, useMemo, useState } from "react"
import { ResponsiveContainer, LineChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts"
import { format as formatDate } from "date-fns"
import api from "@/lib/axios"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/utils"

type FitnessMetrics = {
  steps: number
  water: number
  sleep: number
  calories_burned: number
  calories_intake: number
  fat: number
  protein: number
  carbs: number
  walk_calories_burned?: number
}

type DailyRow = {
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
  walk_calories_burned?: number
}

export default function YearlyStats() {
  const profile = usePatientProfileStore((s) => s.profile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [daily, setDaily] = useState<DailyRow[]>([])
  const [monthly, setMonthly] = useState<any[]>([])
  const [totals, setTotals] = useState<FitnessMetrics | null>(null)
  const [averages, setAverages] = useState<FitnessMetrics | null>(null)
  const [range, setRange] = useState<string>("7d")

  useEffect(() => {
    if (!profile?.id) return
    const fetch = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/fitness/stats/yearly?userId=${profile.id}`)
        const data = res.data
        setDaily(data.daily || [])
        setMonthly(data.monthly || [])
        setTotals(data.totals || null)
        setAverages(data.averages || null)
        setError(null)
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch yearly stats")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [profile?.id])

  const rangeDays = useMemo(() => {
    switch (range) {
      case "7d":
        return 7
      case "1m":
        return 30
      case "3m":
        return 90
      case "6m":
        return 180
      case "1y":
        return 365
      default:
        return 30
    }
  }, [range])

  const now = new Date()
  const cutoff = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000)

  const filteredDaily = daily.filter((d) => new Date(d.created_at) >= cutoff).map((d) => ({
    date: new Date(d.created_at).toLocaleDateString(),
    steps: Math.round(d.steps || 0),
    calories_burned: Math.round(d.calories_burned || 0),
    calories_intake: Math.round(d.calories_intake || 0),
  }))

  const monthlyBars = monthly.map((m: any) => {
    let label = m.month
    try {
      // expect m.month like "2025-04"
      const dt = new Date(`${m.month}-01T00:00:00Z`)
      label = formatDate(dt, "MMMM yyyy") // e.g. "May 2026"
    } catch {
      label = m.month
    }

    return {
      month: m.month,
      monthLabel: label,
      steps: Math.round(m.totals?.steps || 0),
      calories_burned: Math.round(m.totals?.calories_burned || 0),
    }
  })

  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null
    return (
      <div className="bg-white p-2 rounded shadow text-sm border">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span style={{ width: 10, height: 10, background: p.color }} className="inline-block rounded-sm" />
            <span className="text-muted-foreground">{p.name || p.dataKey}</span>
            <span className="ml-auto font-medium">{formatNumber(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-white/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-soft-coral">Activity — Custom Range</h3>
            <p className="text-sm text-muted-foreground">View daily, weekly and monthly trends</p>
          </div>

          <div className="flex items-center gap-4">
          

            <div className="flex gap-2">
            {[
              { key: "7d", label: "7d" },
              { key: "1m", label: "1m" },
              { key: "3m", label: "3m" },
              { key: "6m", label: "6m" },
              { key: "1y", label: "1y" },
            ].map((b) => (
              <Button
                key={b.key}
                size="sm"
                variant={range === b.key ? "default" : "ghost"}
                className={range === b.key ? "bg-soft-coral text-snow-white" : "text-cool-gray"}
                onClick={() => setRange(b.key)}
              >
                {b.label}
              </Button>
            ))}
          </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && <div>Loading yearly stats…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
           

              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyBars} margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis tickFormatter={(v) => formatNumber(v)} tick={{ fontSize: 12, fill: "#6b7280" }} label={{ value: 'Value', angle: -90, position: 'insideLeft', offset: 0 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="steps" fill="#06b6d4" name="Steps" />
                    <Bar dataKey="calories_burned" fill="#f59e0b" name="Calories burned" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <aside className="space-y-3">
              <div className="p-3 rounded-lg border border-gray-100 bg-white">
                <h4 className="text-sm font-medium text-cool-gray">Totals (selected)</h4>
                <div className="mt-2 text-sm text-gray-700">
                  <div className="flex justify-between"><span className="text-muted-foreground">Steps</span><span className="font-medium">{formatNumber(filteredDaily.reduce((s, r) => s + (r.steps || 0), 0))}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Calories burned</span><span className="font-medium">{formatNumber(filteredDaily.reduce((s, r) => s + (r.calories_burned || 0), 0))}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Calories intake</span><span className="font-medium">{formatNumber(filteredDaily.reduce((s, r) => s + (r.calories_intake || 0), 0))}</span></div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-gray-100 bg-white">
                <h4 className="text-sm font-medium text-cool-gray">Yearly Averages</h4>
                <div className="mt-2 text-sm text-gray-700">
                  <div className="flex justify-between"><span className="text-muted-foreground">Steps/day</span><span className="font-medium">{averages ? formatNumber(averages.steps) : "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Water (L/day)</span><span className="font-medium">{averages ? formatNumber(averages.water) : "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Sleep (hrs/day)</span><span className="font-medium">{averages ? formatNumber(averages.sleep) : "—"}</span></div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
