import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

interface TotalUsersResponse {
  success: boolean
  message: string
  data: {
    totalUsers: number
    success: boolean
    message: string
  }
  statusCode: number
}

async function fetchTotalUsers(): Promise<number> {
  const response = await api.get<TotalUsersResponse>("/auth/total-users")
  return response.data.data.totalUsers
}

export function useTotalUsers() {
  return useQuery({
    queryKey: ["totalUsers"],
    queryFn: fetchTotalUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })
}