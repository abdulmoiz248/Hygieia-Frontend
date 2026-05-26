"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { format as formatDate, startOfWeek } from "date-fns"
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

// For short ranges (≤ 3 months) we show per-day bars; for 6m / 1y we aggregate by month.
const USE_DAILY_FOR = new Set(["7d", "1m", "3m"])

export default function YearlyStats() {
  const profile = usePatientProfileStore((s) => s.profile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [daily, setDaily] = useState<DailyRow[]>([])
  const [monthly, setMonthly] = useState<any[]>([])
  const [averages, setAverages] = useState<FitnessMetrics | null>(null)
  const [range, setRange] = useState<string>("7d")

  useEffect(() => {
    if (!profile?.id) return
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/fitness/stats/yearly?userId=${profile.id}`)
        const data = res.data
        setDaily(data.daily || [])
        setMonthly(data.monthly || [])
        setAverages(data.averages || null)
        setError(null)
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch yearly stats")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [profile?.id])

  const rangeDays = useMemo(() => {
    switch (range) {
      case "7d": return 7
      case "1m": return 30
      case "3m": return 90
      case "6m": return 180
      case "1y": return 365
      default:   return 30
    }
  }, [range])

  const now = new Date()
  const cutoff = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000)

  // Daily data filtered by selected range
  const filteredDaily = useMemo(() =>
    daily
      .filter((d) => new Date(d.created_at) >= cutoff)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((d) => ({
        label: new Date(d.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        steps: Math.round(d.steps || 0),
        calories_burned: Math.round(d.calories_burned || 0),
        calories_intake: Math.round(d.calories_intake || 0),
      })),
    [daily, cutoff]
  )

  // Monthly aggregates for 6m / 1y view, filtered to the selected range
  const filteredMonthly = useMemo(() =>
    monthly
      .filter((m) => new Date(`${m.month}-01T00:00:00Z`) >= cutoff)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => {
        let label = m.month
        try {
          label = formatDate(new Date(`${m.month}-01T00:00:00Z`), "MMM yyyy")
        } catch {}
        return {
          label,
          steps: Math.round(m.totals?.steps || 0),
          calories_burned: Math.round(m.totals?.calories_burned || 0),
          calories_intake: Math.round(m.totals?.calories_intake || 0),
        }
      }),
    [monthly, cutoff]
  )

  // Weekly aggregates for 3m view (group daily into weeks)
  const weeklyData = useMemo(() => {
    if (range !== "3m") return []
    const groups = new Map()
    daily
      .filter((d) => new Date(d.created_at) >= cutoff)
      .forEach((d) => {
        const wkStart = startOfWeek(new Date(d.created_at), { weekStartsOn: 1 })
        const key = wkStart.toISOString().slice(0, 10)
        const curr = groups.get(key) || { steps: 0, calories_burned: 0, calories_intake: 0 }
        curr.steps += Math.round(d.steps || 0)
        curr.calories_burned += Math.round(d.calories_burned || 0)
        curr.calories_intake += Math.round(d.calories_intake || 0)
        groups.set(key, curr)
      })
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({
        label: formatDate(new Date(k), "dd MMM"),
        steps: v.steps,
        calories_burned: v.calories_burned,
        calories_intake: v.calories_intake,
      }))
  }, [daily, cutoff, range])

  // Pick the right dataset based on range
  const chartData = range === "3m" ? weeklyData : (USE_DAILY_FOR.has(range) ? filteredDaily : filteredMonthly)
  const xLabel = range === "3m" ? "Weekly" : (USE_DAILY_FOR.has(range) ? "Daily" : "Monthly")

  // Totals for the sidebar summary (always from filtered daily rows)
  const totalSteps         = filteredDaily.reduce((s, r) => s + r.steps, 0)
  const totalCalBurned     = filteredDaily.reduce((s, r) => s + r.calories_burned, 0)
  const totalCalIntake     = filteredDaily.reduce((s, r) => s + r.calories_intake, 0)

  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null
    return (
      <div className="bg-white p-2 rounded shadow text-sm border">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span
              style={{ width: 10, height: 10, background: p.color }}
              className="inline-block rounded-sm shrink-0"
            />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="ml-auto font-medium">{formatNumber(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-white/40">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-soft-coral">Activity — Custom Range</h3>
            <p className="text-sm text-muted-foreground">
              {xLabel} trends · {chartData.length} data point{chartData.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
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
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && <div className="text-sm text-muted-foreground py-4">Loading stats…</div>}
        {error   && <div className="text-red-600 py-4">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* ── Chart ── */}
            <div className="col-span-2">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground rounded-xl border border-dashed">
                  No data for this period
                </div>
              ) : (
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ left: -10, right: 10, top: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tickFormatter={(v) => formatNumber(v)}
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                        formatter={(value) => (
                          <span className="text-gray-600">{value}</span>
                        )}
                      />
                      <Bar dataKey="steps"           fill="#06b6d4" name="Steps"            radius={[3,3,0,0]} />
                      <Bar dataKey="calories_burned" fill="#f59e0b" name="Calories Burned"  radius={[3,3,0,0]} />
                      <Bar dataKey="calories_intake" fill="#10b981" name="Calories Intake"  radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside className="space-y-3">
              <div className="p-3 rounded-lg border border-gray-100 bg-white">
                <h4 className="text-sm font-medium text-cool-gray mb-2">Totals (selected range)</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Steps</span>
                    <span className="font-medium">{formatNumber(totalSteps)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories burned</span>
                    <span className="font-medium">{formatNumber(totalCalBurned)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories intake</span>
                    <span className="font-medium">{formatNumber(totalCalIntake)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-gray-100 bg-white">
                <h4 className="text-sm font-medium text-cool-gray mb-2">Yearly Averages / day</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Steps</span>
                    <span className="font-medium">{averages ? formatNumber(averages.steps) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Water (L)</span>
                    <span className="font-medium">{averages ? formatNumber(averages.water) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sleep (hrs)</span>
                    <span className="font-medium">{averages ? formatNumber(averages.sleep) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cal burned</span>
                    <span className="font-medium">{averages ? formatNumber(averages.calories_burned) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein (g)</span>
                    <span className="font-medium">{averages ? formatNumber(averages.protein) : "—"}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </CardContent>
    </Card>
  )
}