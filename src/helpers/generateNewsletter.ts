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

