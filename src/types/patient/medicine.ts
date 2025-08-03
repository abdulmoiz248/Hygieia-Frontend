export interface Medicine {
  id: string
  name: string
  dosage: string
  time: string
  taken: boolean
  frequency: string
  instructions?: string
  duration: string
}

export interface MedicineState {
  todaysMeds: Medicine[]
}

export interface Prescription {
  id: string
  doctorName: string
  doctorSpecialty: string
  date: string // 'YYYY-MM-DD'
  status: 'active' | 'completed'
  medications: Medicine[]
}



export interface MedicineTrackerState {
  MedicineState:MedicineState
  Prescription:Prescription[]
}
