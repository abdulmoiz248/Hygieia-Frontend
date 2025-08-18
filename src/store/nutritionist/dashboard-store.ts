import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  activeDietPlans: number
  successRate: number
  completedAppointments: number
  upcomingAppointments: number
}

interface DashboardStore {
  stats: DashboardStats
  isLoading: boolean

  // Actions
  setStats: (stats: DashboardStats) => void
  setLoading: (loading: boolean) => void
  refreshStats: () => Promise<void>
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set) => ({
      stats: {
        totalPatients: 247,
        todayAppointments: 8,
        activeDietPlans: 156,
        successRate: 94,
        completedAppointments: 3,
        upcomingAppointments: 5,
      },
      isLoading: false,

      setStats: (stats) => set({ stats }),

      setLoading: (loading) => set({ isLoading: loading }),

      refreshStats: async () => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In a real app, this would fetch from an API
        const newStats = {
          totalPatients: 247 + Math.floor(Math.random() * 5),
          todayAppointments: 8,
          activeDietPlans: 156 + Math.floor(Math.random() * 3),
          successRate: 94 + Math.floor(Math.random() * 3),
          completedAppointments: 3,
          upcomingAppointments: 5,
        }

        set({ stats: newStats, isLoading: false })
      },
    }),
    { name: "dashboard-store" },
  ),
)
