"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ExerciseEditor from "./ExerciseEditor"
import type { WorkoutRoutine, Exercise } from "@/types/patient/workoutSlice"
import { Plus } from "lucide-react"

type Props = {
  routine: WorkoutRoutine
  onSave: (routine: WorkoutRoutine) => void
  onCancel: () => void
}

export default function RoutineForm({ routine: initialRoutine, onSave, onCancel }: Props) {
  const [routine, setRoutine] = useState<WorkoutRoutine>(initialRoutine)

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...routine.exercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setRoutine({ ...routine, exercises: updatedExercises })
  }

  const addExercise = () => {
    setRoutine((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { id: Date.now().toString(), name: "", type: "strength", difficulty: "medium" },
      ],
    }))
  }

  const removeExercise = (index: number) => {
    setRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Routine Name</Label>
          <Input
            value={routine.name}
            onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
          />
        </div>
     
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Exercises</Label>
          <Button size="sm" onClick={addExercise} className="bg-mint-green text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
        </div>
        {routine.exercises.map((exercise, i) => (
          <ExerciseEditor
            key={exercise.id}
            exercise={exercise}
            onChange={(field, value) => updateExercise(i, field, value)}
            onRemove={() => removeExercise(i)}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <Button className="flex-1 bg-soft-blue text-white" onClick={() => onSave({
          ...routine,
          totalDuration: routine.exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0),
          totalCalories: routine.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0),
        })}>
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
