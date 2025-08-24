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

}



export type WeeklyDataItem = {
  day: string; // "Mon", "Tue", etc.
  completed: number;
};

export type TestCategoryDataItem = {
  category: string;
  count: number;
  color: string;
};

export type { BookedLabTest,LabTest }
