"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Dumbbell,
  Target,
  Plus,
  Play,
  Trash2,

  File as Fire,

  Home,
  Building,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { WorkoutRoutine, WorkoutPreferences, Exercise } from "@/types/patient/workoutSlice"
import { useWorkout } from "@/hooks/useWorkout"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function WorkoutDashboard() {
  const {
    routines,

    preferences,
   fetchWorkouts,
    isLoadingRoutines,
    generateAIWorkoutPlan,
    saveWorkoutRoutine,
    updateWorkoutPreferences,
    deleteWorkoutRoutine,
  
  } = useWorkout()



  useEffect(()=>{
    if(routines.length==0)
        fetchWorkouts()
  },[])
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false)
  const [isAIRecommendationOpen, setIsAIRecommendationOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"gym" | "basic">("basic")
  const [newRoutine, setNewRoutine] = useState<Partial<WorkoutRoutine>>({
    name: "",
    type: "basic",
    category: "full-body",
    exercises: [],
  })
  const [aiPrefs, setAiPrefs] = useState<WorkoutPreferences>(preferences)

 

  const handleAddRoutine = () => {
    if (newRoutine.name && newRoutine.exercises && newRoutine.exercises.length > 0) {
      const routine: WorkoutRoutine = {
        id: Date.now().toString(),
        name: newRoutine.name,
        type: newRoutine.type || "basic",
        category: newRoutine.category || "full-body",
        exercises: newRoutine.exercises,
        totalDuration: newRoutine.exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0),
        totalCalories: newRoutine.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0) , 0),
        createdAt: new Date().toISOString(),
      }

      saveWorkoutRoutine(routine)
      setIsAddRoutineOpen(false)
      setNewRoutine({ name: "", type: "basic", category: "full-body", exercises: [] })
    }
  }

  const handleGenerateAI = async () => {
    try {
      const aiRoutines = await generateAIWorkoutPlan(aiPrefs)
      aiRoutines.forEach((routine) => saveWorkoutRoutine(routine))
      updateWorkoutPreferences(aiPrefs)
      setIsAIRecommendationOpen(false)
    } catch (error) {
      console.error("Error generating AI workout plan:", error)
    }
  }

  const handleCompleteRoutine = (routine: WorkoutRoutine) => {

  alert(`Workout Completed! You burned ${routine.totalCalories} calories 🚀`)
}

  const addExerciseToRoutine = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      type: "strength",
      difficulty: "medium",
    }

    setNewRoutine((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), newExercise],
    }))
  }

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    setNewRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises?.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)) || [],
    }))
  }

  const removeExercise = (index: number) => {
    setNewRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index) || [],
    }))
  }

  const gymRoutines = routines.filter((r) => r.type === "gym")
  const basicRoutines = routines.filter((r) => r.type === "basic")

  return (
    <motion.div variants={itemVariants} className="mt-6">
      <Card className="bg-white/40">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-soft-blue" />
              <span className="text-base sm:text-lg">Workout Dashboard</span>
            </div>
        
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {
                activeTab=='gym' &&
                  <Button
                size="sm"
                className="bg-soft-blue text-snow-white w-full sm:w-auto hover:bg-soft-blue/90"
                onClick={() => setIsAIRecommendationOpen(true)}
              >
                <Target className="w-4 h-4 mr-2" />
                AI Recommendations
              </Button>
            }
              <Button
                size="sm"
                className="text-soft-blue bg-transparent border-1 border-soft-blue hover:bg-soft-blue hover:text-snow-white w-full sm:w-auto"
                onClick={() => setIsAddRoutineOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Routine
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
         

       

          {/* Workout Modes */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "gym" | "basic")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Basic Exercises
                </TabsTrigger>
                <TabsTrigger value="gym" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Gym Workouts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-3 mt-4">
                {basicRoutines.length > 0 ? (
                  basicRoutines.map((routine) => (
                    <div
                      key={routine.id}
                      className="flex items-center justify-between p-4 bg-cool-gray/10 rounded-2xl border border-border bg-muted/50 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-mint-green border-mint-green capitalize">
                            {routine.category.replace("-", " ")}
                          </Badge>
                          <Badge variant="outline" className="text-soft-blue border-soft-blue">
                            {routine.totalDuration} min
                          </Badge>
                        </div>
                        <p className="text-base font-semibold text-foreground">{routine.name}</p>
                        <p className="text-sm text-cool-gray">
                          {routine.exercises.length} exercises • {routine.totalCalories} calories
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                      <Button
  size="sm"
  className="bg-soft-blue hover:bg-soft-blue/90 text-white"
  onClick={() => handleCompleteRoutine(routine)}
>
  <Play className="w-4 h-4" />
</Button>

                        <Button size="sm" variant="outline" onClick={() => deleteWorkoutRoutine(routine.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-gradient-to-r from-mint-green/5 to-soft-blue/5 rounded-xl border border-mint-green/20">
                    <Home className="w-12 h-12 text-mint-green mx-auto mb-3" />
                    <p className="text-mint-green font-medium mb-2">No Basic Exercises Yet</p>
                    <p className="text-cool-gray text-sm mb-4">Add walking, jogging, yoga, or home workouts</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="gym" className="space-y-3 mt-4">
                {gymRoutines.length > 0 ? (
                  gymRoutines.map((routine) => (
                    <div
                      key={routine.id}
                      className="flex items-center justify-between p-4 bg-cool-gray/10 rounded-2xl border border-border bg-muted/50 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-soft-blue border-soft-blue capitalize">
                            {routine.category.replace("-", " ")}
                          </Badge>
                          <Badge variant="outline" className="text-soft-coral border-soft-coral">
                            {routine.totalDuration} min
                          </Badge>
                        </div>
                        <p className="text-base font-semibold text-foreground">{routine.name}</p>
                        <p className="text-sm text-cool-gray">
                          {routine.exercises.length} exercises • {routine.totalCalories} calories
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                       <Button
  size="sm"
  className="bg-soft-blue hover:bg-soft-blue/90 text-white"
  onClick={() => handleCompleteRoutine(routine)}
>
  <Play className="w-4 h-4" />
</Button>

                        <Button size="sm" variant="outline" onClick={() => deleteWorkoutRoutine(routine.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-gradient-to-r from-soft-blue/5 to-soft-coral/5 rounded-xl border border-soft-blue/20">
                    <Building className="w-12 h-12 text-soft-blue mx-auto mb-3" />
                    <p className="text-soft-blue font-medium mb-2">No Gym Routines Yet</p>
                    <p className="text-cool-gray text-sm mb-4">Add structured routines like Chest Day, Leg Day, etc.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Add Routine Modal */}
      <Dialog open={isAddRoutineOpen} onOpenChange={setIsAddRoutineOpen}>
        <DialogContent className="max-w-2xl bg-snow-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-soft-blue text-xl font-bold">
              <Plus className="w-6 h-6 text-soft-blue" />
              Add New Routine
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-soft-blue font-semibold">Routine Name</Label>
                <Input
                  value={newRoutine.name || ""}
                  onChange={(e) => setNewRoutine((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning Cardio"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-soft-blue font-semibold">Type</Label>
                <Select
                  value={newRoutine.type}
                  onValueChange={(value: "gym" | "basic") => setNewRoutine((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Exercise</SelectItem>
                    <SelectItem value="gym">Gym Workout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-soft-blue font-semibold">Exercises</Label>
                <Button
                  size="sm"
                  onClick={addExerciseToRoutine}
                  className="bg-mint-green hover:bg-mint-green/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>

              {newRoutine.exercises?.map((exercise, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, "name", e.target.value)}
                      className="flex-1 mr-2"
                    />
                    <Button size="sm" variant="outline" onClick={() => removeExercise(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {exercise.type === "strength" && (
                      <>
                        <Input
                          type="number"
                          placeholder="Sets"
                          value={exercise.sets || ""}
                          onChange={(e) => updateExercise(index, "sets", Number.parseInt(e.target.value))}
                        />
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={exercise.reps || ""}
                          onChange={(e) => updateExercise(index, "reps", Number.parseInt(e.target.value))}
                        />
                      </>
                    )}
                    <Input
                      type="number"
                      placeholder="Duration (min)"
                      value={exercise.duration || ""}
                      onChange={(e) => updateExercise(index, "duration", Number.parseInt(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="Calories"
                      value={exercise.caloriesBurned}
                      onChange={(e) => updateExercise(index, "caloriesBurned", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddRoutine}
                className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-white"
                disabled={!newRoutine.name || !newRoutine.exercises?.length}
              >
                Add Routine
              </Button>
              <Button variant="outline" onClick={() => setIsAddRoutineOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Recommendations Modal */}
      <Dialog open={isAIRecommendationOpen} onOpenChange={setIsAIRecommendationOpen}>
        <DialogContent className="max-w-2xl bg-snow-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-soft-blue text-xl font-bold">
              <Target className="w-6 h-6 text-soft-blue" />
              AI Workout Recommendations
            </DialogTitle>
          </DialogHeader>

          {isLoadingRoutines ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-soft-blue/30 border-t-soft-blue rounded-full animate-spin mb-4"></div>
              <p className="text-cool-gray">Generating personalized workout plan...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-soft-blue font-semibold">Fitness Level</Label>
                  <Select
                    value={aiPrefs.fitnessLevel}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                      setAiPrefs((prev) => ({ ...prev, fitnessLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-soft-blue font-semibold">Available Time</Label>
                  <Select
                    value={aiPrefs.availableTime}
                    onValueChange={(value: "short" | "medium" | "long") =>
                      setAiPrefs((prev) => ({ ...prev, availableTime: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">15 minutes</SelectItem>
                      <SelectItem value="medium">30 minutes</SelectItem>
                      <SelectItem value="long">60+ minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-soft-blue font-semibold">Equipment Available</Label>
                <Select
                  value={aiPrefs.equipment}
                  onValueChange={(value: "none" | "basic" | "full-gym") =>
                    setAiPrefs((prev) => ({ ...prev, equipment: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Equipment (Bodyweight)</SelectItem>
                    <SelectItem value="basic">Basic Equipment (Dumbbells, Resistance Bands)</SelectItem>
                    <SelectItem value="full-gym">Full Gym Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleGenerateAI}
                  className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-white"
                  disabled={isLoadingRoutines}
                >
                  Generate AI Plan
                </Button>
                <Button variant="outline" onClick={() => setIsAIRecommendationOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
