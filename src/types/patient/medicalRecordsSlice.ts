import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { MedicalRecord } from "@/types"
import api from "@/lib/axios"


export const fetchMedicalRecords = createAsyncThunk<
  MedicalRecord[], // return type
  void,            // no args
  { rejectValue: string }
>("medicalRecords/fetch", async (_, { rejectWithValue }) => {
  try {
    const patientId = localStorage.getItem("id")
    if (!patientId) return rejectWithValue("No patient id found in localStorage")

    const res = await api.get(`/medical-records/patient/${patientId}`)

    if (!res.data) throw new Error("Failed to fetch medical records")

    // ✅ transform snake_case → camelCase
    const records: MedicalRecord[] = res.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.record_type,       // "report", "scan", etc.
      date: item.date,
      fileUrl: item.file_url,
      doctorName: item.doctor_name || undefined, // optional
    }))

    return records
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})


interface MedicalRecordsState {
  records: MedicalRecord[]
  typeFilter: string
  searchQuery: string
  viewingRecord: MedicalRecord | null
  showUpload: boolean
  loading: boolean
  error: string | null
}

const initialState: MedicalRecordsState = {
  records: [],
  typeFilter: "all",
  searchQuery: "",
  viewingRecord: null,
  showUpload: false,
  loading: false,
  error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to load medical records"
      })
  },
})

export const {
  addRecord,
  deleteRecord,
  setTypeFilter,
  setSearchQuery,
  setViewingRecord,
  setShowUpload,
} = medicalRecordsSlice.actions

export default medicalRecordsSlice.reducer
