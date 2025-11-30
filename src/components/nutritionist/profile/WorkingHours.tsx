import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowRight, X, MapPin, Clock, Building2 } from "lucide-react"

export interface WorkingHour {
  day: string
  start: string
  end: string
  location: string
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
  // Get unique locations from existing working hours for reuse
  const getUniqueLocations = () => {
    const locations = value.map(h => h.location).filter(Boolean)
    return [...new Set(locations)]
  }

  // Get the most commonly used location for default when adding new day
  const getDefaultLocation = () => {
    const locations = value.map(h => h.location).filter(Boolean)
    if (locations.length === 0) return ""
    const locationCounts = locations.reduce((acc, loc) => {
      acc[loc] = (acc[loc] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ""
  }

  const addDay = (day: string) => {
    if (!day || value.find((h) => h.day === day)) return
    onChange([...value, { day, start: "09:00", end: "17:00", location: getDefaultLocation() }])
  }

  const updateTime = (day: string, field: "start" | "end", time: string) => {
    onChange(value.map((h) => (h.day === day ? { ...h, [field]: time } : h)))
  }

  const updateLocation = (day: string, location: string) => {
    onChange(value.map((h) => (h.day === day ? { ...h, location } : h)))
  }

  const removeDay = (day: string) => {
    onChange(value.filter((h) => h.day !== day))
  }

  const applyToAll = (start: string, end: string) => {
    const defaultLocation = getDefaultLocation()
    const updated = daysOfWeek.map(d => {
      const existing = value.find(h => h.day === d)
      return { day: d, start, end, location: existing?.location || defaultLocation }
    })
    onChange(updated)
  }

  const applyLocationToAll = (location: string) => {
    onChange(value.map(h => ({ ...h, location })))
  }

  const uniqueLocations = getUniqueLocations()

  return (
    <Card className="rounded-2xl shadow-lg border border-soft-blue/30 backdrop-blur-md bg-white/80">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-soft-blue flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Working Hours & Locations
        </CardTitle>
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
              className="flex flex-col gap-3 border border-gray-200 bg-gray-50 p-4 rounded-xl hover:shadow transition"
            >
              {/* Day and Time Row */}
              <div className="flex flex-wrap items-center gap-3">
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

              {/* Location Row */}
              <div className="flex items-center gap-2 pl-0 md:pl-28">
                <MapPin className="w-4 h-4 text-mint-green flex-shrink-0" />
                {disabled ? (
                  <span className="text-sm text-gray-600">{h.location || "No location set"}</span>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <Input
                      placeholder="Enter clinic/hospital location *"
                      value={h.location || ""}
                      onChange={(e) => updateLocation(h.day, e.target.value)}
                      className={`flex-1 min-w-[200px] max-w-md text-sm ${!h.location ? "border-red-300 focus:border-red-500" : ""}`}
                      required
                    />
                    {!h.location && (
                      <span className="text-xs text-red-500">Location is required</span>
                    )}
                  </div>
                )}
              </div>
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
            <h3 className="text-sm font-bold text-soft-blue flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Quick Apply Time
            </h3>
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

        {/* Apply Location to All Days - Only show if user has entered locations */}
        {!disabled && value?.length > 1 && uniqueLocations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-soft-blue flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Apply Location to All Days
            </h3>
            <p className="text-xs text-gray-500">
              Click on any of your previously entered locations to apply it to all working days:
            </p>
            <div className="flex flex-wrap gap-2">
              {uniqueLocations.map(loc => (
                <Button
                  key={loc}
                  size="sm"
                  variant="outline"
                  className="rounded-full border-mint-green text-mint-green hover:bg-mint-green hover:text-white"
                  onClick={() => applyLocationToAll(loc)}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {loc}
                </Button>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
