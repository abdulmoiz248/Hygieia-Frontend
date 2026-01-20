import { type WorkoutRoutine, type WorkoutPreferences } from "@/types/patient/workoutSlice";
import { usePatientWorkoutStore } from "@/store/patient/workout-store";
import { usePatientProfileStore } from "@/store/patient/profile-store";

export const useWorkout = () => {
  const patient = usePatientProfileStore((store) => store.profile)
  const patientId = patient.id
  const workoutStore = usePatientWorkoutStore()
  const { routines, preferences, isLoadingRoutines, isLoadingSessions } = workoutStore

  // Load workouts from backend
  const fetchWorkouts = () => {
    if (!patientId) return;
    workoutStore.loadUserSessions(patientId);
  };

  // Generate AI workout plan (mock) and save to backend
  const generateAIWorkoutPlan = async (prefs: WorkoutPreferences): Promise<WorkoutRoutine[]> => {
    workoutStore.setLoadingRoutines(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const aiRoutines: WorkoutRoutine[] = [
      {
        id: Date.now().toString(),
        name: `${prefs.fitnessLevel} Full Body Workout`,
        type: prefs.equipment === "none" ? "basic" : "gym",
        category: "full-body",
        exercises: [
          {
            id: Date.now().toString(),
            name: prefs.equipment === "none" ? "Bodyweight Squats" : "Barbell Squats",
            type: "strength",
            sets: prefs.fitnessLevel === "beginner" ? 2 : 3,
            reps: prefs.fitnessLevel === "beginner" ? 8 : 12,
            caloriesBurned: 100,
            difficulty: prefs.fitnessLevel as "easy" | "medium" | "hard",
          },
        ],
        totalDuration:
          prefs.availableTime === "short" ? 15 : prefs.availableTime === "medium" ? 30 : 60,
        totalCalories:
          prefs.availableTime === "short" ? 100 : prefs.availableTime === "medium" ? 200 : 400,
        createdAt: new Date().toISOString(),
      },
    ];

    // Save to backend
    for (const routine of aiRoutines) {
      await workoutStore.addWorkoutSession({ routine, patientId });
    }

    workoutStore.setLoadingRoutines(false);
    return aiRoutines;
  };

  const saveWorkoutRoutine = async (routine: WorkoutRoutine) => {
    if (!patientId) return;
    await workoutStore.addWorkoutSession({ routine, patientId });
  };

  const updateWorkoutRoutine = async (routine: WorkoutRoutine) => {
    await workoutStore.updateWorkoutSession(routine);
  };

  const deleteWorkoutRoutine = async (routineId: string) => {
    await workoutStore.deleteWorkoutSession(routineId);
  };

  const updateWorkoutPreferences = (prefs: WorkoutPreferences) => {
    workoutStore.setPreferences(prefs);
    localStorage.setItem("workoutPreferences", JSON.stringify(prefs));
  };

  return {
    routines,
    preferences,
    isLoadingRoutines,
    isLoadingSessions,
    fetchWorkouts,
    generateAIWorkoutPlan,
    saveWorkoutRoutine,
    updateWorkoutRoutine,
    deleteWorkoutRoutine,
    updateWorkoutPreferences,
  };
};
