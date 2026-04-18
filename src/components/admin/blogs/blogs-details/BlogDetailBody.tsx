import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { useMemo } from "react"

interface BlogDetailBodyProps {
  content: string
}

function markdownToHtml(raw: string): string {
  // Normalise: replace literal \n escape sequences with real newlines,
  // then normalise \r\n to \n
  let md = raw
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")

  const lines = md.split("\n")
  const output: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Blank line — paragraph break
    if (line.trim() === "") {
      i++
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      output.push(`<h${level}>${inline(headingMatch[2])}</h${level}>`)
      i++
      continue
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      output.push("<hr />")
      i++
      continue
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2))
        i++
      }
      output.push(`<blockquote>${inline(quoteLines.join(" "))}</blockquote>`)
      continue
    }

    // Unordered list
    if (/^[*\-]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[*\-]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^[*\-]\s+/, ""))}</li>`)
        i++
      }
      output.push(`<ul>${items.join("")}</ul>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, ""))}</li>`)
        i++
      }
      output.push(`<ol>${items.join("")}</ol>`)
      continue
    }

    // Paragraph — collect until blank line or block element
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^[*\-]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^>\s/.test(lines[i]) &&
      !/^[-*_]{3,}$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length) {
      output.push(`<p>${inline(paraLines.join(" "))}</p>`)
    }
  }

  return output.join("\n")
}

/** Process inline markdown: bold, italic, code, links */
function inline(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/___(.+?)___/g, "<strong><em>$1</em></strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

export function BlogDetailBody({ content }: BlogDetailBodyProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return ""
    // If already HTML, render as-is
    if (content.trimStart().startsWith("<")) return content
    return markdownToHtml(content)
  }, [content])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {content ? (
        <div
          className="
            prose prose-sm max-w-none leading-relaxed
            prose-headings:font-bold prose-headings:text-[var(--color-dark-slate-gray)]
            prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-3
            prose-h2:text-xl prose-h2:mt-5 prose-h2:mb-2
            prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
            prose-p:text-[var(--color-dark-slate-gray)] prose-p:mb-3
            prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-3 prose-ul:space-y-1
            prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-3 prose-ol:space-y-1
            prose-li:text-[var(--color-dark-slate-gray)]
            prose-strong:font-semibold prose-strong:text-[var(--color-dark-slate-gray)]
            prose-code:bg-[oklch(0.95_0.02_210)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[var(--color-soft-blue)] prose-code:text-[12px]
            prose-blockquote:border-l-2 prose-blockquote:border-[var(--color-soft-blue)] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[var(--color-cool-gray)]
            prose-a:text-[var(--color-soft-blue)] prose-a:underline
            prose-hr:border-[oklch(0.90_0.02_210)]
          "
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      ) : (
        <div
          className="rounded-2xl p-8 text-center border border-dashed"
          style={{ borderColor: "oklch(0.88 0.04 210)" }}
        >
          <BookOpen
            className="w-8 h-8 mx-auto mb-2 opacity-20"
            style={{ color: "var(--color-cool-gray)" }}
          />
          <p className="text-sm text-[var(--color-cool-gray)]">No content body available.</p>
        </div>
      )}
    </motion.div>
  )
}
