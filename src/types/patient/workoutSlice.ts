import api from "@/lib/axios";
import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


export interface Exercise {
  id: string;
  name: string;
  type: "strength" | "cardio" | "flexibility" | "hiit";
  sets?: number;
  reps?: number;
  duration?: number;
  caloriesBurned?: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  type: "gym" | "basic";
  category: "chest" | "legs" | "cardio" | "full-body" | "walking" | "jogging" | "yoga" | "stretching" | "hiit";
  exercises: Exercise[];
  totalDuration: number;
  totalCalories: number;
  createdAt: string;
}

export interface WorkoutPreferences {
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  availableTime: "short" | "medium" | "long";
  equipment: "none" | "basic" | "full-gym";
  goals: string[];
}

interface WorkoutState {
  routines: WorkoutRoutine[];
  preferences: WorkoutPreferences;
  isLoadingRoutines: boolean;
  isLoadingSessions: boolean;
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
};


// Async thunks
export const loadUserSessions = createAsyncThunk(
  "workout/loadUserSessions",
  async (patientId: string) => {
    const { data } = await api.get(`/workout-sessions/patient/${patientId}`);
    return data.map((session: any) => ({
      id: session.id,
      name: session.exercises[0]?.name || "Workout",
      type: "gym",
      category: "full-body",
      exercises: session.exercises,
      totalDuration: session.total_duration,
      totalCalories: session.total_calories,
      createdAt: session.created_at,
    }));
  }
);

export const addWorkoutSessionAsync = createAsyncThunk(
  "workout/addWorkoutSession",
  async ({ routine, patientId }: { routine: WorkoutRoutine; patientId: string }) => {
    const payload = {
      patientId,
      routineId: routine.id,
      exercises: routine.exercises,
      totalDuration: routine.totalDuration,
      totalCalories: routine.totalCalories,
    };
    const { data } = await api.post(`/workout-sessions`, payload);
    return {
      id: data.id,
      name: routine.name,
      type: routine.type,
      category: routine.category,
      exercises: routine.exercises,
      totalDuration: routine.totalDuration,
      totalCalories: routine.totalCalories,
      createdAt: data.created_at,
    };
  }
);

export const updateWorkoutSessionAsync = createAsyncThunk(
  "workout/updateWorkoutSession",
  async (routine: WorkoutRoutine) => {
    const payload = {
      routineId: routine.id,
      exercises: routine.exercises,
      totalDuration: routine.totalDuration,
      totalCalories: routine.totalCalories,
    };
    const { data } = await api.patch(`/workout-sessions/${routine.id}`, payload);
    return {
      id: data.id,
      name: routine.name,
      type: routine.type,
      category: routine.category,
      exercises: routine.exercises,
      totalDuration: routine.totalDuration,
      totalCalories: routine.totalCalories,
      createdAt: data.created_at,
    };
  }
);

export const deleteWorkoutSessionAsync = createAsyncThunk(
  "workout/deleteWorkoutSession",
  async (id: string) => {
    await api.delete(`/workout-sessions/${id}`);
    return id;
  }
);

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setRoutines: (state, action: PayloadAction<WorkoutRoutine[]>) => {
      state.routines = action.payload;
    },
    addRoutine: (state, action: PayloadAction<WorkoutRoutine>) => {
      state.routines.push(action.payload);
    },
    updateRoutine: (state, action: PayloadAction<WorkoutRoutine>) => {
      const index = state.routines.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) state.routines[index] = action.payload;
    },
    deleteRoutine: (state, action: PayloadAction<string>) => {
      state.routines = state.routines.filter((r) => r.id !== action.payload);
    },
    setPreferences: (state, action: PayloadAction<WorkoutPreferences>) => {
      state.preferences = action.payload;
    },
    setLoadingRoutines: (state, action: PayloadAction<boolean>) => {
      state.isLoadingRoutines = action.payload;
    },
    setLoadingSessions: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSessions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserSessions.pending, (state) => {
        state.isLoadingSessions = true;
      })
      .addCase(loadUserSessions.fulfilled, (state, action) => {
        state.isLoadingSessions = false;
        state.routines = action.payload;
      })
      .addCase(loadUserSessions.rejected, (state) => {
        state.isLoadingSessions = false;
      })
      .addCase(addWorkoutSessionAsync.fulfilled, (state, action) => {
        state.routines.push(action.payload);
      })
      .addCase(updateWorkoutSessionAsync.fulfilled, (state, action) => {
        const index = state.routines.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.routines[index] = action.payload;
      })
      .addCase(deleteWorkoutSessionAsync.fulfilled, (state, action) => {
        state.routines = state.routines.filter((r) => r.id !== action.payload);
      });
  },
});

export const {
  setRoutines,
  addRoutine,
  updateRoutine,
  deleteRoutine,
  setPreferences,
  setLoadingRoutines,
  setLoadingSessions,
} = workoutSlice.actions;

export default workoutSlice.reducer;
