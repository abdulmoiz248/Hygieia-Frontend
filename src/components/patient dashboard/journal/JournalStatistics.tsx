"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useJournalStatistics } from "@/hooks/patient/usePatientJournal"
import { formatDateOnly } from "@/helpers/date"
import { FileText, Calendar, BarChart3, AlertTriangle } from "lucide-react"

interface JournalStatisticsProps {
  patientId: string | undefined
}

export function JournalStatistics({ patientId }: JournalStatisticsProps) {
  const { data: stats, isLoading, error } = useJournalStatistics(patientId)

  if (isLoading) {
    return (
      <Card className="bg-white/40 border border-gray-100 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <p className="text-cool-gray text-sm">Loading statistics...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card className="bg-white/40 border border-gray-100 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <p className="text-soft-coral text-sm">Failed to load statistics</p>
        </CardContent>
      </Card>
    )
  }

  const categoryEntries = Object.entries(stats.entriesByCategory || {})
  const alertEntries = Object.entries(stats.entriesByAlertLevel || {})

  return (
    <div className="space-y-4">
      <Card className="bg-white/40 border border-gray-100 rounded-xl shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-soft-blue" />
              <span className="text-sm font-medium text-cool-gray">
                Total Entries
              </span>
            </div>
            <span className="text-2xl font-bold text-soft-coral">
              {stats.totalEntries}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-soft-blue" />
              <span className="text-sm font-medium text-cool-gray">
                Last Entry
              </span>
            </div>
            <span className="text-sm text-dark-slate-gray">
              {stats.lastEntryDate
                ? formatDateOnly(stats.lastEntryDate)
                : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/40 border border-gray-100 rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-soft-blue">
            <BarChart3 className="w-4 h-4" />
            By Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-sm">
            {categoryEntries.length > 0 ? (
              categoryEntries.map(([cat, count]) => (
                <li
                  key={cat}
                  className="flex justify-between text-cool-gray"
                >
                  <span className="capitalize">{cat}</span>
                  <span className="font-medium text-dark-slate-gray">{count}</span>
                </li>
              ))
            ) : (
              <li className="text-cool-gray">No entries yet</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-white/40 border border-gray-100 rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-soft-blue">
            <AlertTriangle className="w-4 h-4" />
            By Alert Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-sm">
            {alertEntries.length > 0 ? (
              alertEntries.map(([level, count]) => (
                <li
                  key={level}
                  className="flex justify-between text-cool-gray"
                >
                  <span className="capitalize">{level}</span>
                  <span className="font-medium text-dark-slate-gray">{count}</span>
                </li>
              ))
            ) : (
              <li className="text-cool-gray">No entries yet</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
