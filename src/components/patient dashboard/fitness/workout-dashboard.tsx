"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dumbbell, Plus, Building } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { WorkoutRoutine, WorkoutPreferences } from "@/types/patient/workoutSlice"
import { useWorkout } from "@/hooks/useWorkout"
import RoutineCard from "./RoutineCard"
import RoutineForm from "./RoutineForm"
import CompletionDialog from "./CompletionDialog"
import AIRecommendationDialog from "./AIRecommendationDialog"
import { addCalories } from "@/types/patient/fitnessSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/patient/store"


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
    updateWorkoutRoutine,
  } = useWorkout()



    const dispatch = useDispatch<AppDispatch>()
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false)
  const [isAIRecommendationOpen, setIsAIRecommendationOpen] = useState(false)
  const [isRoutineDetailsOpen, setIsRoutineDetailsOpen] = useState(false)
  const [isCompletionOpen, setIsCompletionOpen] = useState(false)

  const [aiPrefs, setAiPrefs] = useState<WorkoutPreferences>(preferences)
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null)

  useEffect(() => {
    if (routines.length === 0) fetchWorkouts()
  }, [])

  const handleSaveRoutine = (routine: WorkoutRoutine) => {
    if (selectedRoutine) {
      updateWorkoutRoutine(routine)
    } else {
      saveWorkoutRoutine(routine)
    }
    setIsAddRoutineOpen(false)
    setIsRoutineDetailsOpen(false)
  }

  const handleCompleteRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine)
    
         dispatch(addCalories({ 
        type:'burned', 
        amount: routine?.totalCalories || 0, 
        carbs: 0, 
        protein: 0, 
        fat: 0
      }))

    setIsCompletionOpen(true)
  }

  const gymRoutines = routines.filter((r) => r.type === "gym")

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
            
                {/* <Button
                  size="sm"
                  className="bg-soft-blue text-snow-white w-full sm:w-auto hover:bg-soft-blue/90"
                  onClick={() => setIsAIRecommendationOpen(true)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  AI Recommendations
                </Button> */}
           
              <Button
                size="sm"
                className="text-soft-blue bg-transparent border border-soft-blue hover:bg-soft-blue hover:text-snow-white w-full sm:w-auto"
                onClick={() => {
                  setSelectedRoutine(null)
                  setIsAddRoutineOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Routine
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          

      
              {gymRoutines.length > 0 ? (
                gymRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    onComplete={() => handleCompleteRoutine(routine)}
                    onView={() => {
                      setSelectedRoutine(routine)
                      setIsRoutineDetailsOpen(true)
                    }}
                    onDelete={() => deleteWorkoutRoutine(routine.id)}
                  />
                ))
              ) : (
                <div className="text-center py-6 bg-gradient-to-r from-soft-blue/5 to-soft-coral/5 rounded-xl border border-soft-blue/20">
                  <Building className="w-12 h-12 text-soft-blue mx-auto mb-3" />
                  <p className="text-soft-blue font-medium mb-2">No Workout Routines Yet</p>
                  <p className="text-cool-gray text-sm">Add structured routines like Chest Day, Leg Day, Yoga, Morning walk etc.</p>
                </div>
              )}
          
        </CardContent>
      </Card>

      {/* Add/Edit Routine Modal */}
      <Dialog open={isAddRoutineOpen || isRoutineDetailsOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddRoutineOpen(false)
          setIsRoutineDetailsOpen(false)
        }
      }}>
        <DialogContent className="max-w-2xl bg-snow-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-soft-blue">
              {selectedRoutine ? "Edit Routine" : "Add Routine"}
            </DialogTitle>
          </DialogHeader>
          <RoutineForm
            routine={
              selectedRoutine || {
                id: Date.now().toString(),
                name: "",
                type: "gym",
                category: "full-body",
                exercises: [],
                totalDuration: 0,
                totalCalories: 0,
                createdAt: new Date().toISOString(),
              }
            }
            onSave={handleSaveRoutine}
            onCancel={() => {
              setIsAddRoutineOpen(false)
              setIsRoutineDetailsOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* AI Recommendations */}
      <AIRecommendationDialog
        open={isAIRecommendationOpen}
        onClose={() => setIsAIRecommendationOpen(false)}
        prefs={aiPrefs}
        setPrefs={setAiPrefs}
        isLoading={isLoadingRoutines}
        onGenerate={async () => {
          const aiRoutines = await generateAIWorkoutPlan(aiPrefs)
          aiRoutines.forEach((routine) => saveWorkoutRoutine(routine))
          updateWorkoutPreferences(aiPrefs)
          setIsAIRecommendationOpen(false)
        }}
      />

      {/* Completion Modal */}
      <CompletionDialog
        open={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        routine={selectedRoutine}
      />
    </motion.div>
  )
}
