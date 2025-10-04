import { useQuery } from '@tanstack/react-query'
import api from "@/lib/axios"

export const useNutritionistDashboard = (doctorId: string) => {
  return useQuery({
    queryKey: ['analytics', doctorId],
    queryFn: async () => {
      if (!doctorId) throw new Error('Missing doctorId')

      const [patientsRes, appointmentsRes] = await Promise.all([
        api.get(`/analytics/patients-monthly?doctorId=${doctorId}`),
        api.get(`/analytics/appointments-weekly?doctorId=${doctorId}`),
      ])

      if (!patientsRes.data || !appointmentsRes.data) throw new Error('Failed to fetch analytics')

      return {
        patientData: patientsRes.data,
        appointmentData: appointmentsRes.data,
      }
    },
    enabled: !!doctorId,
  })
}
