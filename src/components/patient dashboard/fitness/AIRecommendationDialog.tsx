"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WorkoutPreferences } from "@/types/patient/workoutSlice"
import Loader from "@/components/loader/loader"
import { Loader2 } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  prefs: WorkoutPreferences
  setPrefs: (prefs: WorkoutPreferences) => void
  isLoading: boolean
  onGenerate: () => void
}

export default function AIRecommendationDialog({ open, onClose, prefs, setPrefs, isLoading, onGenerate }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-snow-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-soft-blue">AI Workout Plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Goal</Label>
            <Select
              value={prefs.goals[0]}
              onValueChange={(value) => setPrefs({ ...prefs, goals: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="general-fitness">General Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-soft-blue text-white"
            onClick={onGenerate}
            disabled={isLoading}
          >
            {isLoading ?  (
    <>
      <Loader2 className="w-4 h-4 animate-spin" /> Generating...
    </>
  ) : (
    <>
    Generating Plan
    </>
  )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
