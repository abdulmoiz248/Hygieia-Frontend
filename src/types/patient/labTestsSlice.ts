import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {LabTest,BookedLabTest} from './lab'

interface LabTestsState {
  availableTests: LabTest[]
  bookedTests: BookedLabTest[]
  showBookingModal: boolean
  selectedTest: LabTest | null
}
const mockLabTests: LabTest[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    description: "Comprehensive blood analysis including RBC, WBC, platelets",
    price: 45,
    duration: "15 minutes",
    category: "Blood Tests",
    preparationInstructions: ["Fast for 8-12 hours", "Stay hydrated"],
  },
  {
    id: "2",
    name: "Lipid Profile",
    description: "Cholesterol and triglyceride levels assessment",
    price: 35,
    duration: "10 minutes",
    category: "Blood Tests",
    preparationInstructions: ["Fast for 12 hours", "No alcohol 24 hours prior"],
  },
  {
    id: "3",
    name: "Thyroid Function Test",
    description: "TSH, T3, T4 hormone levels",
    price: 55,
    duration: "15 minutes",
    category: "Hormone Tests",
  },
  {
    id: "4",
    name: "Diabetes Panel",
    description: "Blood glucose and HbA1c testing",
    price: 40,
    duration: "10 minutes",
    category: "Blood Tests",
    preparationInstructions: ["Fast for 8 hours"],
  },
  {
    id: "5",
    name: "Liver Function Test",
    description: "ALT, AST, bilirubin levels",
    price: 50,
    duration: "15 minutes",
    category: "Blood Tests",
  },
]

const mockBookedTests: BookedLabTest[] = [
  {
    id: "1",
    testId: "1",
    testName: "Complete Blood Count (CBC)",
    scheduledDate: new Date("2024-01-15"),
    scheduledTime: "09:00",
    status: "pending",
    bookedAt: "2024-01-10T10:30:00Z",
    location: "Main Lab - Floor 2",
    instructions: ["Fast for 8-12 hours", "Stay hydrated"],
  },
  {
    id: "2",
    testId: "3",
    testName: "Thyroid Function Test",
    scheduledDate: new Date("2024-01-18"),
    scheduledTime: "11:30",
    status: "pending",
    bookedAt: "2024-01-12T14:15:00Z",
    location: "Main Lab - Floor 2",
  },
]

const initialState: LabTestsState = {
  availableTests: mockLabTests,
  bookedTests: mockBookedTests,
  showBookingModal: false,
  selectedTest: null,
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
      if (test) {
        test.status = "cancelled"
      }
    },
    setShowBookingModal: (state, action: PayloadAction<boolean>) => {
      state.showBookingModal = action.payload
    },
    setSelectedTest: (state, action: PayloadAction<LabTest | null>) => {
      state.selectedTest = action.payload
    },
  },
})

export const { bookLabTest, cancelLabTest, setShowBookingModal, setSelectedTest } = labTestsSlice.actions

export default labTestsSlice.reducer
