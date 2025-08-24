import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { MedicalRecord } from "@/types"
import api from "@/lib/axios"

export const fetchMedicalRecords = createAsyncThunk<
  MedicalRecord[],
  void,
  { rejectValue: string }
>("medicalRecords/fetch", async (_, { rejectWithValue }) => {
  try {
    const patientId = localStorage.getItem("id")
    if (!patientId) return rejectWithValue("No patient id found in localStorage")

    const res = await api.get(`/medical-records/patient/${patientId}`)
    if (!res.data) throw new Error("Failed to fetch medical records")

    const records: MedicalRecord[] = res.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.record_type,
      date: item.date,
      fileUrl: item.file_url,
      doctorName: item.doctor_name || undefined,
    }))

    return records
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})


export const addRecord = createAsyncThunk<
  MedicalRecord,
  { file: File; title: string; type: string },
  { rejectValue: string }
>("medicalRecords/add", async ({ file, title, type }, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append("file", file)              // must match FileInterceptor('file')
    formData.append("title", title)
    formData.append("recordType", type)
    formData.append("patientId", localStorage.getItem('id') || '')

    const res = await api.post("/medical-records/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    if (!res.data) throw new Error("Failed to upload record")

    const record: MedicalRecord = {
      id: res.data.id,
      title: res.data.title,
      type: res.data.record_type,
      date: res.data.date,
      fileUrl: res.data.file_url,
      doctorName: res.data.doctor_name || undefined,
    }

    return record
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})


export const deleteRecord = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("medicalRecords/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/medical-records/${id}?patientId=${localStorage.getItem('id')}`)
    return id
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

      .addCase(addRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addRecord.fulfilled, (state, action) => {
        state.loading = false
        state.records.unshift(action.payload)
      })
      .addCase(addRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to add record"
      })

      .addCase(deleteRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.loading = false
        state.records = state.records.filter((record) => record.id !== action.payload)
      })
      .addCase(deleteRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to delete record"
      })
  },
})

export const { setTypeFilter, setSearchQuery, setViewingRecord, setShowUpload } =
  medicalRecordsSlice.actions

export default medicalRecordsSlice.reducer
