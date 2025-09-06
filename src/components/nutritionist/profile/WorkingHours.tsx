import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ArrowRight, X } from "lucide-react"

interface WorkingHour {
  day: string
  start: string
  end: string
}

interface WorkingHoursCardProps {
  value: WorkingHour[]
  onChange: (value: WorkingHour[]) => void
  disabled?: boolean
}

const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return [`${hour}:00`, `${hour}:30`]
}).flat()

const batchOptions = [
  { label: "9–5", start: "09:00", end: "17:00" },
  { label: "10–6", start: "10:00", end: "18:00" },
  { label: "12–8", start: "12:00", end: "20:00" },
]

export default function WorkingHoursCard({ value = [], onChange, disabled }: WorkingHoursCardProps) {

  const addDay = (day: string) => {
    if (!day || value.find((h) => h.day === day)) return
    onChange([...value, { day, start: "09:00", end: "17:00" }])
  }

  const updateTime = (day: string, field: "start" | "end", time: string) => {
    onChange(value.map((h) => (h.day === day ? { ...h, [field]: time } : h)))
  }

  const removeDay = (day: string) => {
    onChange(value.filter((h) => h.day !== day))
  }

  const applyToAll = (start: string, end: string) => {
    const updated = daysOfWeek.map(d => ({ day: d, start, end }))
    onChange(updated)
  }

  return (
    <Card className="rounded-2xl shadow-lg border border-soft-blue/30 backdrop-blur-md bg-white/80">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-soft-blue">Working Hours</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">

        {/* Current Schedule */}
        <div className="space-y-3">
        
          {value?.length === 0 && (
            <p className="text-sm text-soft-coral">No working hours set</p>
          )}
          {value?.map((h) => (
            <div
              key={h.day}
              className="flex items-center gap-3 border border-gray-200 bg-gray-50 p-4 rounded-xl hover:shadow transition"
            >
              <span className="w-28 font-medium text-soft-coral">{h.day}</span>

              {/* Start */}
              <Select
                value={h.start}
                onValueChange={(v) => updateTime(h.day, "start", v)}
                disabled={disabled}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent className="max-h-60 ">
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <ArrowRight className="text-dark-slate-gray h-4 w-4"/> 

              {/* End */}
              <Select
                value={h.end}
                onValueChange={(v) => updateTime(h.day, "end", v)}
                disabled={disabled}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-50 ml-auto"
                  onClick={() => removeDay(h.day)}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Day */}
        {!disabled && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-soft-blue">Add Days</h3>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => {
                const alreadyAdded = value?.some((h) => h.day === day)
                return (
                  <Button
                    key={day}
                    
                    className={`rounded-full px-4 ${alreadyAdded ? "opacity-50 cursor-not-allowed bg-white border-b text-black" : "bg-mint-green hover:bg-mint-green/80"}`}
                    disabled={alreadyAdded}
                    onClick={() => addDay(day)}
                  >
                    {day}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Apply */}
        {!disabled && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-soft-blue">Quick Apply</h3>
            <div className="flex flex-wrap gap-2">
              {batchOptions.map(opt => (
                <Button
                  key={opt.label}
                  size="sm"
                
                  className="rounded-full bg-mint-green hover:bg-mint-green/80"
                  onClick={() => applyToAll(opt.start, opt.end)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
