export function markdownToHtml(raw: string): string {
  const md = normalizeEscapedText(raw)

  const lines = md.split("\n")
  const output: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === "") {
      i++
      continue
    }

    if (/^(`{3,}|~{3,})/.test(line.trim())) {
      const fence = line.trim().match(/^(`{3,}|~{3,})/)?.[1] ?? "```"
      const lang = line.trim().slice(fence.length).trim()
      i++
      const codeLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith(fence)) {
        codeLines.push(escapeHtml(lines[i]))
        i++
      }
      i++
      const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : ""
      output.push(`<pre><code${langAttr}>${codeLines.join("\n")}</code></pre>`)
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      output.push(`<h${level}>${inline(headingMatch[2])}</h${level}>`)
      i++
      continue
    }

    if (/^[-*_]{3,}$/.test(line.trim())) {
      output.push("<hr />")
      i++
      continue
    }

    if (line.trimStart().startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trimStart().startsWith("> ")) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""))
        i++
      }
      output.push(`<blockquote><p>${inline(quoteLines.join(" "))}</p></blockquote>`)
      continue
    }

    if (/^[-*+]\s+/.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^[-*+]\s+/, ""))}</li>`)
        i++
      }
      output.push(`<ul>${items.join("")}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^\d+\.\s+/, ""))}</li>`)
        i++
      }
      output.push(`<ol>${items.join("")}</ol>`)
      continue
    }

    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^\s*>\s/.test(lines[i]) &&
      !/^[-*_]{3,}$/.test(lines[i].trim()) &&
      !/^(`{3,}|~{3,})/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length) {
      output.push(`<p>${inline(paraLines.join("<br />"))}</p>`)
    }
  }

  return output.join("\n")
}

export function normalizeEscapedText(raw: string): string {
  let text = raw

  for (let i = 0; i < 4; i++) {
    const next = text
      .replace(/&#92;n/gi, "\n")
      .replace(/&#x5c;n/gi, "\n")
      .replace(/&bsol;n/gi, "\n")
      .replace(/&#92;r/gi, "\n")
      .replace(/&#x5c;r/gi, "\n")
      .replace(/&bsol;r/gi, "\n")
      .replace(/&#92;t/gi, " ")
      .replace(/&#x5c;t/gi, " ")
      .replace(/&bsol;t/gi, " ")
      .replace(/\\+r\\+n/g, "\n")
      .replace(/\\+n/g, "\n")
      .replace(/\\+r/g, "\n")
      .replace(/\\+t/g, " ")
      .replace(/\/+r\/+n(?=\s|\/|#|\*|\d|$)/g, "\n")
      .replace(/\/+n(?=\s|\/|#|\*|\d|$)/g, "\n")
      .replace(/\/+r(?=\s|\/|#|\*|\d|$)/g, "\n")
      .replace(/\/+t(?=\s|\/|#|\*|\d|$)/g, " ")
      .replace(/\\\\r\\\\n/g, "\n")
      .replace(/\\\\n/g, "\n")
      .replace(/\\\\r/g, "\n")
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\n")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")

    if (next === text) break
    text = next
  }

  return text
    .replace(/\\+"/g, '"')
    .replace(/\\+'/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export function htmlToPlainText(raw: string): string {
  return normalizeEscapedText(raw)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function renderBlogContent(raw: string): string {
  const normalized = normalizeEscapedText(raw)
  const looksLikeHtml = normalized.trimStart().startsWith("<")
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(normalized)
  const plainText = containsHtml ? htmlToPlainText(normalized) : normalized
  const hasMarkdownBlocks = /(^|\n)\s*(#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+)/.test(plainText)
  const hasDecodedLineBreaks = plainText.includes("\n")

  if (containsHtml && (hasMarkdownBlocks || hasDecodedLineBreaks)) {
    return markdownToHtml(plainText)
  }

  if (looksLikeHtml) {
    return normalized
  }

  return markdownToHtml(normalized)
}

function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/___(.+?)___/g, "<strong><em>$1</em></strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
