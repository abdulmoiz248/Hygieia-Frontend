import { create } from "zustand"
import { devtools } from "zustand/middleware"

import api from "@/lib/axios"
import type { WorkoutPreferences, WorkoutRoutine } from "@/types/patient/workoutSlice"

type WorkoutState = {
  routines: WorkoutRoutine[]
  preferences: WorkoutPreferences
  isLoadingRoutines: boolean
  isLoadingSessions: boolean
  setRoutines: (routines: WorkoutRoutine[]) => void
  addRoutine: (routine: WorkoutRoutine) => void
  updateRoutine: (routine: WorkoutRoutine) => void
  deleteRoutine: (id: string) => void
  setPreferences: (prefs: WorkoutPreferences) => void
  setLoadingRoutines: (loading: boolean) => void
  setLoadingSessions: (loading: boolean) => void
  loadUserSessions: (patientId: string) => Promise<void>
  addWorkoutSession: (payload: {
    routine: WorkoutRoutine
    patientId: string
  }) => Promise<void>
  updateWorkoutSession: (routine: WorkoutRoutine) => Promise<void>
  deleteWorkoutSession: (id: string) => Promise<void>
}

const initialState: WorkoutState = {
  routines: [],
  preferences: {
    fitnessLevel: "beginner",
    availableTime: "medium",
    equipment: "none",
    goals: [],
  },
  isLoadingRoutines: false,
  isLoadingSessions: false,
  setRoutines: () => {},
  addRoutine: () => {},
  updateRoutine: () => {},
  deleteRoutine: () => {},
  setPreferences: () => {},
  setLoadingRoutines: () => {},
  setLoadingSessions: () => {},
  loadUserSessions: async () => {},
  addWorkoutSession: async () => {},
  updateWorkoutSession: async () => {},
  deleteWorkoutSession: async () => {},
}

export const usePatientWorkoutStore = create<WorkoutState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setRoutines: (routines) => set({ routines }),
      addRoutine: (routine) =>
        set((state) => ({ routines: [...state.routines, routine] })),
      updateRoutine: (routine) =>
        set((state) => ({
          routines: state.routines.map((r) => (r.id === routine.id ? routine : r)),
        })),
      deleteRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        })),
      setPreferences: (prefs) => set({ preferences: prefs }),
      setLoadingRoutines: (loading) => set({ isLoadingRoutines: loading }),
      setLoadingSessions: (loading) => set({ isLoadingSessions: loading }),

      loadUserSessions: async (patientId: string) => {
        set({ isLoadingSessions: true })
        try {
          const { data } = await api.get(`/workout-sessions/patient/${patientId}`)
          const routines: WorkoutRoutine[] = data.map((session: any) => ({
            id: session.id,
            name: session.exercises[0]?.name || "Workout",
            type: "gym",
            category: "full-body",
            exercises: session.exercises,
            totalDuration: session.total_duration,
            totalCalories: session.total_calories,
            createdAt: session.created_at,
          }))
          set({ routines, isLoadingSessions: false })
        } catch {
          set({ isLoadingSessions: false })
        }
      },

      addWorkoutSession: async ({ routine, patientId }) => {
        const payload = {
          patientId,
          routineId: routine.id,
          exercises: routine.exercises,
          totalDuration: routine.totalDuration,
          totalCalories: routine.totalCalories,
        }
        const { data } = await api.post(`/workout-sessions`, payload)
        const created: WorkoutRoutine = {
          id: data.id,
          name: routine.name,
          type: routine.type,
          category: routine.category,
          exercises: routine.exercises,
          totalDuration: routine.totalDuration,
          totalCalories: routine.totalCalories,
          createdAt: data.created_at,
        }
        get().addRoutine(created)
      },

      updateWorkoutSession: async (routine) => {
        const payload = {
          routineId: routine.id,
          exercises: routine.exercises,
          totalDuration: routine.totalDuration,
          totalCalories: routine.totalCalories,
        }
        const { data } = await api.patch(`/workout-sessions/${routine.id}`, payload)
        const updated: WorkoutRoutine = {
          id: data.id,
          name: routine.name,
          type: routine.type,
          category: routine.category,
          exercises: routine.exercises,
          totalDuration: routine.totalDuration,
          totalCalories: routine.totalCalories,
          createdAt: data.created_at,
        }
        get().updateRoutine(updated)
      },

      deleteWorkoutSession: async (id) => {
        await api.delete(`/workout-sessions/${id}`)
        get().deleteRoutine(id)
      },
    }),
    { name: "patient-workout-store" }
  )
)

