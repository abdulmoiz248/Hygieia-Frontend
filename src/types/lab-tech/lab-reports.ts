import type {  BookedLabTest,LabTest } from '@/types/patient/lab'

export interface PendingReport extends Omit<BookedLabTest, "bookedAt"  | "instructions"> {
  patientName: string
  type: "lab-result" | "prescription" | "scan" | "report"
  uploadedAt?: Date
  reportFile?: string
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
