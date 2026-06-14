import { useMutation } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminError } from "@/toasts/AdminToasts"

const BASE_URL = "http://localhost:4000"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkerReview {
  id: string
  appointment_id?: string
  patient_id?: string
  provider_role?: "doctor" | "nutritionist"
  rating: number
  review_text?: string
  created_at: string
}

export interface WorkerReport {
  worker?: {
    id: string
    role: string
    email: string
    createdAt: string
  }
  workerDetails?: {
    profile?: {
      email?: string
      phone?: string
      name?: string
      img?: string
    }
  }
  overview: {
    accountAgeDays: number
    accountStatus?: string
    performanceLevel?: string
    unreadNotifications?: number
    notifications?: {
      total: number
      unread: number
      read: number
    }
    patients?: {
      totalUniquePatients: number
      returningPatients: number
      newPatientsLast7Days: number
      newPatientsLast30Days: number
    }
  }
  metrics: {
    // Legacy flat metrics
    totalAppointments?: number
    completedAppointments?: number
    upcomingAppointments?: number
    cancelledAppointments?: number
    completionRate?: number
    totalDietPlans?: number
    activeDietPlans?: number
    uniquePatients?: number
    averageRating?: number
    totalLabBookings?: number
    completedBookings?: number
    pendingBookings?: number
    cancelledBookings?: number
    totalPrescriptions?: number
    activePrescriptions?: number
    completedPrescriptions?: number
    totalReferrals?: number
    dismissedReferrals?: number
    pendingReferrals?: number
    totalBlogPosts?: number
    verifiedBlogPosts?: number
    
    // New nested metrics
    core?: any
    engagement?: any
    efficiency?: any
  }
  analytics: {
    timeSeries: {
      appointmentsLast12Months?: { month: string; totalAppointments: number; completedAppointments: number }[]
      dietPlansLast12Months?: { month: string; totalDietPlans: number }[]
      reviewsLast12Months?: { month: string; averageRating: number }[]
      labTestsLast12Months?: { month: string; totalLabBookings: number; completedBookings: number; pendingBookings: number }[]
      prescriptionsLast12Months?: { month: string; totalPrescriptions: number; activePrescriptions: number; completedPrescriptions: number }[]
      referralsLast12Months?: { month: string; totalReferrals: number; dismissedReferrals: number; pendingReferrals: number }[]
    }
    patientTrends: {
      newPatientsLast7Days: { date: string; newPatients: number; cumulative: number }[]
      patientGrowthLast12Months: { month: string; newPatients: number; cumulativePatients: number }[]
    }
    performance?: any
    quality?: any
  }
  recentActivity: {
    notifications?: { id: string; title: string; notification_msg: string; created_at: string }[]
    appointments?: { id: string; date: string; time: string; status: string; type: string }[]
    dietPlans?: { id: string; start_date: string; end_date: string; daily_calories: string }[]
    reviews?: WorkerReview[]
    labBookings?: { id: string; test_id: string; scheduled_date: string; scheduled_time: string; status: string; location: string }[]
    prescriptions?: { id: string; start_date: string; end_date: string; status: string; created_at: string }[]
    referredTests?: any[]
    blogPosts?: any[]
  }
  detailed?: {
    nextUpcomingAppointment?: { id: string; date: string; time: string; mode: string } | null
    nextScheduledBooking?: any | null
    profile?: {
      id: string
      name: string
      phone: string
      img: string
      gender: string
      dateofbirth: string
      personal_email: string | null
    }
  }
  insights: string[]
  recommendations?: string[]
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

function mapWorkerReview(review: any): WorkerReview {
  return {
    ...review,
    id: review.id,
    appointment_id: review.appointment_id || review.appointmentId,
    patient_id: review.patient_id || review.patientId,
    provider_role: review.provider_role || review.providerRole,
    rating: review.rating,
    review_text: review.review_text || review.reviewText,
    created_at: review.created_at || review.createdAt,
  }
}

function mapWorkerReport(data: any): WorkerReport {
  return {
    ...data,
    recentActivity: {
      ...data.recentActivity,
      reviews: Array.isArray(data?.recentActivity?.reviews)
        ? data.recentActivity.reviews.map(mapWorkerReview)
        : data?.recentActivity?.reviews,
    },
  }
}

async function fetchWorkerReport(
  userId: string,
  workerId: string,
): Promise<WorkerReport> {
  console.log("[worker-report] payload →", { userId, workerId })

  const res = await fetch(`${BASE_URL}/worker-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, workerId }),
  })

  const json = await res.json()
  console.log("[worker-report] response →", json)

  if (!res.ok) throw new Error(json.message || "Failed to generate report")
  return mapWorkerReport(json.data)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkerReport() {
  const adminId = useAdminStore((s) => s.adminId)

  return useMutation({
    mutationFn: (workerId: string) => {
      if (!adminId) throw new Error("Admin session not found. Please refresh and try again.")
      return fetchWorkerReport(adminId, workerId)
    },
    onError: (err: Error) => {
      adminError(err.message || "Failed to generate worker report.")
    },
  })
}
