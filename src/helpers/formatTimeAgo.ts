export const timeAgo = (timestamp: string): string => {
  const now = new Date()
  const created = new Date(timestamp)
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000)

  const minutes = Math.floor(diff / 60)
  const hours = Math.floor(diff / 3600)
  const days = Math.floor(diff / 86400)
  const weeks = Math.floor(diff / 604800)
  const months = Math.floor(diff / 2592000)
  const years = Math.floor(diff / 31536000)

  if (diff < 60) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  return `${years} year${years > 1 ? 's' : ''} ago`
}
