export interface NotificationType {
  id: string
  user_id: string
  notification_msg: string
  action: string | null
  created_at: string
  title: string
  is_read: boolean
}
