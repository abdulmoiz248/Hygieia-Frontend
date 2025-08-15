import type {  BookedLabTest,LabTest } from '@/types/patient/lab'

export interface PendingReport extends Omit<BookedLabTest, "bookedAt" | "location" | "instructions"> {
  patientName: string
  priority: "low" | "medium" | "high"
  uploadedAt?: Date
  reportFile?: File
}

export interface LabAnalytics {
  totalTests: number
  completedTests: number
  pendingReports: number
  todayTests: number
  weeklyGrowth: number
  monthlyRevenue: number
}



export type { BookedLabTest,LabTest }
