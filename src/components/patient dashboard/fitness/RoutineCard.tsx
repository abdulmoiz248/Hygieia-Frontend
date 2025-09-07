"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Trash2 } from "lucide-react"
import type { WorkoutRoutine } from "@/types/patient/workoutSlice"

type Props = {
  routine: WorkoutRoutine
  onComplete: () => void
  onView: () => void
  onDelete: () => void
}

export default function RoutineCard({ routine, onComplete, onView, onDelete }: Props) {
  return (
    <div className="flex my-2 items-center justify-between p-4 bg-cool-gray/10 rounded-2xl border border-border hover:shadow-md transition-shadow">
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-soft-blue border-soft-blue capitalize">
            {routine.category}
          </Badge>
          <Badge variant="outline" className="text-mint-green border-mint-green">
            {routine.totalDuration} min
          </Badge>
        </div>
        <p className="text-base font-semibold">{routine.name}</p>
        <p className="text-sm text-cool-gray">
          {routine.exercises.length} exercises • {routine.totalCalories} calories
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button size="sm" className="bg-soft-blue text-white" onClick={onComplete}>
          <Play className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onView}>
          View
        </Button>
        <Button size="sm" variant="outline" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
