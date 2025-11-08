// hooks/useAvailableSlots.ts
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

const fetchAvailableSlots = async (providerId: string, role: string, date: string) => {
  console.log("👉 Calling backend with:", { providerId: providerId.trim(), role, date })
  const res = await api.get("/appointments/available-slots", {
    params: { providerId: providerId.trim(), role, date },
  })
  console.log("✅ Backend response:", res.data)
  return res.data
}

export const useAvailableSlots = (
  providerId?: string,
  role?: string,
  date?: Date
) => {
  return useQuery({
    queryKey: [
      "available-slots",
      providerId,
      role,
      date ? date.toISOString().split("T")[0] : null,
    ],
    queryFn: () =>
      fetchAvailableSlots(providerId!, role!, date!.toISOString().split("T")[0]),
    enabled: Boolean(providerId && role && date),
  })
}
