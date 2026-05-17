export type RecordType = "lab" | "scan"

export interface LabTest {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration: string
  preparation_instructions: string[]
  unit: string
  optimal_range: string
  record_type: RecordType
}

export type LabTestFormData = Omit<LabTest, "id">

export const EMPTY_LAB_TEST_FORM: LabTestFormData = {
  name: "",
  description: "",
  category: "",
  price: 0,
  duration: "",
  preparation_instructions: [],
  unit: "",
  optimal_range: "",
  record_type: "lab",
}

// Common lab test categories for suggestions
export const LAB_CATEGORIES = [
  "Hematology",
  "Biochemistry",
  "Microbiology",
  "Immunology",
  "Endocrinology",
  "Cardiology",
  "Urology",
  "Serology",
  "Pathology",
  "Radiology",
  "Genetics",
  "Toxicology",
] as const
