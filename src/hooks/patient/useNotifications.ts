import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationApi } from "@/api/patient/notificationApi"
import { NotificationType } from "@/types/patient/notification"

export function useNotifications(userId: string) {
  const queryClient = useQueryClient()

  // Fetch notifications
  const notificationsQuery = useQuery<NotificationType[]>({
    queryKey: ["notifications", userId],
    queryFn: () => notificationApi.getNotifications(userId),
    staleTime: 1000 * 60 * 2, // cache for 2 minutes
    refetchInterval: 1000 * 60 * 2, // refetch every 2 minutes
    enabled: !!userId, // only fetch if userId is available
  })

  // Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: (_, notificationId) => {
      // Optimistically update the cache
      queryClient.setQueryData<NotificationType[]>(["notifications", userId], (old) => {
        if (!old) return old
        return old.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      })
    },
  })

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(userId),
    onSuccess: () => {
      // Optimistically update the cache
      queryClient.setQueryData<NotificationType[]>(["notifications", userId], (old) => {
        if (!old) return old
        return old.map((n) => ({ ...n, is_read: true }))
      })
    },
  })

  return {
    notifications: notificationsQuery.data ?? [],
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    refetch: notificationsQuery.refetch,
  }
}
