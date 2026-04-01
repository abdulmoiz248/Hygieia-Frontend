// ─── HTML escape / unescape ───────────────────────────────────────────────────

/**
 * Converts a JSON-escaped HTML string back into a valid HTML string.
 * Handles newlines, tabs, carriage returns, quotes and backslashes.
 */
export function unescapeHtml(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
}

/**
 * Escapes an HTML string so it can be safely embedded inside a JSON body.
 */
export function escapeHtml(html: string): string {
  return html
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Returns a human-readable relative time string from an ISO 8601 date.
 * e.g. "Today", "Yesterday", "5d ago"
 */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days}d ago`
}
