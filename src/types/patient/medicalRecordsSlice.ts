import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { mockMedicalRecords } from "@/mocks/data"
import type { MedicalRecord } from "@/types"

interface MedicalRecordsState {
  records: MedicalRecord[]
  typeFilter: string
  searchQuery: string
  viewingRecord: MedicalRecord | null
  showUpload: boolean
}

const initialState: MedicalRecordsState = {
  records: mockMedicalRecords,
  typeFilter: "all",
  searchQuery: "",
  viewingRecord: null,
  showUpload: false,
}

const medicalRecordsSlice = createSlice({
  name: "medicalRecords",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<MedicalRecord>) => {
      state.records.unshift(action.payload)
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((record) => record.id !== action.payload)
    },
    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.typeFilter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setViewingRecord: (state, action: PayloadAction<MedicalRecord | null>) => {
      state.viewingRecord = action.payload
    },
    setShowUpload: (state, action: PayloadAction<boolean>) => {
      state.showUpload = action.payload
    },
  },
})

export const { addRecord, deleteRecord, setTypeFilter, setSearchQuery, setViewingRecord, setShowUpload } =
  medicalRecordsSlice.actions

export default medicalRecordsSlice.reducer
