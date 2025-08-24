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

// book a new lab test
export const bookLabTest = createAsyncThunk(
  "labTests/bookLabTest",
  async (
    body: {
      testName:string
      testId: string
      patientId: string
      scheduledDate: string
      scheduledTime: string
      location?: string
      instructions?: string[]
    }
  ) => {
    
    const response = await api.post("/booked-lab-tests", body)
     const data=response.data
    const map:BookedLabTest= {
      testName:body.testName,
          testId: data.test_id,
          id:data.id,
          scheduledDate: data.scheduled_date,
          scheduledTime: data.scheduled_time,
          location: data.location,
          instructions: data.instructions,
          bookedAt:new Date().toISOString(),

          status: 'pending',
        }
    return map
  }
)

// cancel a booked test
export const cancelLabTest = createAsyncThunk(
  "labTests/cancelLabTest",
  async (bookingId: string) => {
    const response = await api.patch<BookedLabTest>(`/booked-lab-tests/${bookingId}/cancel`)
    return response.data
  }
)

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
      .addCase(bookLabTest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(bookLabTest.fulfilled, (state, action) => {
        state.loading = false
        state.bookedTests.push(action.payload)
      })
      .addCase(bookLabTest.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to book lab test"
      })
      .addCase(cancelLabTest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cancelLabTest.fulfilled, (state, action) => {
        state.loading = false
        const idx = state.bookedTests.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) state.bookedTests[idx] = action.payload
      })
      .addCase(cancelLabTest.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to cancel lab test"
      })
  },
})

export const { setShowBookingModal, setSelectedTest } = labTestsSlice.actions
export default labTestsSlice.reducer
