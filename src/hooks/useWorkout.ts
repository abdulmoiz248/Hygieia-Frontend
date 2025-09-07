import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/patient/store";
import {
  setPreferences,
  type WorkoutRoutine,
  type WorkoutPreferences,
  loadUserSessions,
  addWorkoutSessionAsync,
  updateWorkoutSessionAsync,
  deleteWorkoutSessionAsync,
} from "@/types/patient/workoutSlice";

export const useWorkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const patient = useSelector((store:RootState)=>store.profile)
  const patientId=patient.id
  const {
    routines,
    preferences,
    isLoadingRoutines,
    isLoadingSessions,
  } = useSelector((state: RootState) => state.workout);



  // Load workouts from backend
  const fetchWorkouts = () => {
    if (!patientId) return;
    dispatch(loadUserSessions(patientId));
  };

  // Generate AI workout plan (mock) and save to backend
  const generateAIWorkoutPlan = async (prefs: WorkoutPreferences): Promise<WorkoutRoutine[]> => {
    dispatch({ type: "workout/setLoadingRoutines", payload: true });

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
      await dispatch(addWorkoutSessionAsync({ routine, patientId }));
    }

    dispatch({ type: "workout/setLoadingRoutines", payload: false });
    return aiRoutines;
  };

  const saveWorkoutRoutine = async (routine: WorkoutRoutine) => {
    if (!patientId) return;
    await dispatch(addWorkoutSessionAsync({ routine, patientId }));
  };

  const updateWorkoutRoutine = async (routine: WorkoutRoutine) => {
    await dispatch(updateWorkoutSessionAsync(routine));
  };

  const deleteWorkoutRoutine = async (routineId: string) => {
    await dispatch(deleteWorkoutSessionAsync(routineId));
  };

  const updateWorkoutPreferences = (prefs: WorkoutPreferences) => {
    dispatch(setPreferences(prefs));
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
