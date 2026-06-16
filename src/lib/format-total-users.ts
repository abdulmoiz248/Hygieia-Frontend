export function formatTotalUsers(totalUsers: number | undefined) {
  if (totalUsers === undefined) return "..."

  if (totalUsers >= 1_000_000) {
    return `${(totalUsers / 1_000_000).toFixed(1)}M+`
  }

  if (totalUsers >= 1_000) {
    return `${(totalUsers / 1_000).toFixed(1)}K+`
  }

  return `${totalUsers}+`
}
