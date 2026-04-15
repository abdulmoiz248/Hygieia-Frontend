import { useUserRoleCounts } from "./useUserRoleCounts"
import { useBlogPosts }      from "./useBlogPosts"
import { useCVs }            from "./useCVs"
import { useFetchFaqs }      from "./useFaqs"

export function useAdminDashboardStats() {
  const users = useUserRoleCounts()
  const blogs = useBlogPosts()
  const cvs   = useCVs()
  const faqs  = useFetchFaqs()

  const pendingCVsCount =
    cvs.data?.filter((cv) => cv.status === "new").length ?? 0

  const isLoading =
    users.isLoading || blogs.isLoading || cvs.isLoading || faqs.isLoading

  return {
    isLoading,
    totalUsers:  users.data?.totalUsers       ?? 0,
    totalBlogs:  blogs.data?.length           ?? 0,
    pendingCVs:  pendingCVsCount,
    totalFaqs:   (faqs.data as any[])?.length ?? 0,
  }
}
