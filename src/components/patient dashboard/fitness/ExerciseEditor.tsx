"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Exercise } from "@/types/patient/workoutSlice"

type Props = {
  exercise: Exercise
  onChange: (field: keyof Exercise, value: any) => void
  onRemove: () => void
}

export default function ExerciseEditor({ exercise, onChange, onRemove }: Props) {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Exercise name"
          value={exercise.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="flex-1 mr-2"
        />
        <Button size="sm" variant="outline" onClick={onRemove}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Input
          type="number"
          placeholder="Sets"
          value={exercise.sets || ""}
          onChange={(e) => onChange("sets", Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder="Reps"
          value={exercise.reps || ""}
          onChange={(e) => onChange("reps", Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder="Duration (min)"
          value={exercise.duration || ""}
          onChange={(e) => onChange("duration", Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder="Calories"
          value={exercise.caloriesBurned || ""}
          onChange={(e) => onChange("caloriesBurned", Number(e.target.value))}
        />
      </div>
    </div>
  )
}
