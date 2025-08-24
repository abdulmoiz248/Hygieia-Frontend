
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { LabTest, BookedLabTest } from "./lab"
import api from "@/lib/axios"

interface LabTestsState {
  availableTests: LabTest[]
  bookedTests: BookedLabTest[]
  showBookingModal: boolean
  selectedTest: LabTest | null
  loading: boolean
  error: string | null
}

// fetch all lab tests
export const fetchLabTests = createAsyncThunk("labTests/fetchLabTests", async () => {
  const response = await api.get<LabTest[]>("/lab-tests")
 
  return response.data
})

// fetch booked tests for current patient
export const fetchBookedTests = createAsyncThunk("labTests/fetchBookedTests", async () => {
  const patientId = localStorage.getItem("id")
  if (!patientId) throw new Error("Patient ID not found in localStorage")

  const response = await api.get<BookedLabTest[]>(`/booked-lab-tests/patient/${patientId}`)
  
  return response.data
})

const initialState: LabTestsState = {
  availableTests: [],
  bookedTests: [],
  showBookingModal: false,
  selectedTest: null,
  loading: false,
  error: null,
}

const labTestsSlice = createSlice({
  name: "labTests",
  initialState,
  reducers: {
    bookLabTest: (state, action: PayloadAction<Omit<BookedLabTest, "id" | "bookedAt">>) => {
      const newBooking: BookedLabTest = {
        ...action.payload,
        id: Date.now().toString(),
        bookedAt: new Date().toISOString(),
      }
      state.bookedTests.push(newBooking)
    },
    cancelLabTest: (state, action: PayloadAction<string>) => {
      const test = state.bookedTests.find((test) => test.id === action.payload)
      if (test) test.status = "cancelled"
    },
    setShowBookingModal: (state, action: PayloadAction<boolean>) => {
      state.showBookingModal = action.payload
    },
    setSelectedTest: (state, action: PayloadAction<LabTest | null>) => {
      state.selectedTest = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabTests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLabTests.fulfilled, (state, action) => {
        state.loading = false
        state.availableTests = action.payload
      })
      .addCase(fetchLabTests.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch lab tests"
      })
      .addCase(fetchBookedTests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookedTests.fulfilled, (state, action) => {
        state.loading = false
        state.bookedTests = action.payload
      })
      .addCase(fetchBookedTests.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch booked tests"
      })
  },
})

export const { bookLabTest, cancelLabTest, setShowBookingModal, setSelectedTest } = labTestsSlice.actions

export default labTestsSlice.reducer
