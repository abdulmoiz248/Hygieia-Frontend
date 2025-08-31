import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { X } from "lucide-react"

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

export default function WorkingHoursCard({ value, onChange, disabled }: WorkingHoursCardProps) {
  const [newDay, setNewDay] = useState<string>("")

  const addDay = () => {
    if (!newDay || value.find((h) => h.day === newDay)) return
    onChange([...value, { day: newDay, start: "", end: "" }])
    setNewDay("")
  }

  const updateTime = (day: string, field: "start" | "end", time: string) => {
    onChange(value.map((h) => (h.day === day ? { ...h, [field]: time } : h)))
  }

  const removeDay = (day: string) => {
    onChange(value.filter((h) => h.day !== day))
  }

  return (
    <Card className="rounded-2xl shadow-md border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-soft-coral">Working Hours</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        
        {/* Existing working hours */}
        <div className="flex flex-col gap-3">
          {value.length === 0 && (
            <p className="text-sm text-muted-foreground">No working hours set</p>
          )}
          {value.map((h) => (
            <div key={h.day} className="flex items-center gap-3 border p-3 rounded-lg">
              <span className="w-24 font-medium">{h.day}</span>
              <Input
                type="time"
                value={h.start}
                onChange={(e) => updateTime(h.day, "start", e.target.value)}
                disabled={disabled}
              />
              <span>-</span>
              <Input
                type="time"
                value={h.end}
                onChange={(e) => updateTime(h.day, "end", e.target.value)}
                disabled={disabled}
              />
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDay(h.day)}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add new day */}
        {!disabled && (
          <div className="flex items-center gap-3">
            <Select value={newDay} onValueChange={setNewDay}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem
                    key={day}
                    value={day}
                    disabled={value.some((h) => h.day === day)}
                  >
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addDay}>Add</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
