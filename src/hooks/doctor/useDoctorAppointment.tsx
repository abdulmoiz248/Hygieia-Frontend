import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export const useDoctorAppointment = (
  doctorId: string,
  status: string = "all"
) => {
  return useQuery({
    queryKey: ["doctor-appointments", doctorId, status],
    queryFn: async () => {
      if (!doctorId) throw new Error("Missing doctorId")
      const url = `/appointments?doctorId=${doctorId}${
        status !== "all" ? `&status=${status}` : ""
      }`
      const res = await api.get(url)
      return res.data.items ?? []
    },
    enabled: !!doctorId,
  })
}
