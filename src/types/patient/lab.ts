export interface LabTest {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: string
  preparation_instructions?: string[]
}

export interface BookedLabTest {
  id: string
  testId: string
  testName: string
  scheduledDate: Date
  scheduledTime: string
  status: "pending" | "completed" | "cancelled"
  bookedAt: string
  location: string
  instructions?: string[]
}


