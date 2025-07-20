import type { Doctor, Appointment, MedicalRecord, Prescription, FitnessGoal } from "@/types"

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    rating: 4.8,
    location: "New York, NY",
    experience: 12,
    consultationFee: 150,
    avatar: "/doctor.png",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Dermatology",
    rating: 4.9,
    location: "Los Angeles, CA",
    experience: 8,
    consultationFee: 120,
    avatar: "/doctor.png",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    rating: 4.7,
    location: "Chicago, IL",
    experience: 15,
    consultationFee: 100,
    avatar: "/doctor.png",
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorId: "1",
    doctor: mockDoctors[0],
    date: "2024-01-25",
    time: "10:00 AM",
    status: "upcoming",
    type: "consultation",
  },
  {
    id: "2",
    doctorId: "2",
    doctor: mockDoctors[1],
    date: "2024-01-28",
    time: "2:30 PM",
    status: "upcoming",
    type: "follow-up",
  },
]

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "1",
    title: "Blood Test Results",
    type: "lab-result",
    date: "2024-01-15",
    doctorName: "Dr. Sarah Johnson",
    thumbnail: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "2",
    title: "Chest X-Ray",
    type: "scan",
    date: "2024-01-10",
    doctorName: "Dr. Michael Chen",
    thumbnail: "/placeholder.svg?height=200&width=150",
  },
]

export const mockPrescriptions: Prescription[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-01-20",
    medications: [
      {
        id: "1",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food",
      },
    ],
  },
]

export const mockFitnessGoals: FitnessGoal[] = [
  {
    id: "1",
    type: "steps",
    target: 10000,
    current: 7500,
    unit: "steps",
  },
  {
    id: "2",
    type: "water",
    target: 8,
    current: 5,
    unit: "glasses",
  },
]
