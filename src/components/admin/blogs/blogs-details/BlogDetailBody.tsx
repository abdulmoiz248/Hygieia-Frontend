import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { useMemo } from "react"

interface BlogDetailBodyProps {
  content: string
}

function markdownToHtml(raw: string): string {
  // Normalise escape sequences and line endings
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

    // Fenced code block (``` or ~~~)
    if (/^(`{3,}|~{3,})/.test(line.trim())) {
      const fence  = line.trim().match(/^(`{3,}|~{3,})/)?.[1] ?? "```"
      const lang   = line.trim().slice(fence.length).trim()
      i++
      const codeLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith(fence)) {
        codeLines.push(
          lines[i]
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        )
        i++
      }
      i++ // consume closing fence
      const langAttr = lang ? ` class="language-${lang}"` : ""
      output.push(`<pre><code${langAttr}>${codeLines.join("\n")}</code></pre>`)
      continue
    }

    // Headings h1–h6
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
    if (line.trimStart().startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trimStart().startsWith("> ")) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""))
        i++
      }
      output.push(`<blockquote><p>${inline(quoteLines.join(" "))}</p></blockquote>`)
      continue
    }

    // Unordered list — trim() before testing so leading spaces don't break detection
    if (/^[-*+]\s+/.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^[-*+]\s+/, ""))}</li>`)
        i++
      }
      output.push(`<ul>${items.join("")}</ul>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^\d+\.\s+/, ""))}</li>`)
        i++
      }
      output.push(`<ol>${items.join("")}</ol>`)
      continue
    }

    // Paragraph — collect consecutive non-blank, non-block lines.
    // Single newlines within a paragraph become <br /> so they're visible.
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

/** Inline markdown: bold, italic, strikethrough, code, links */
function inline(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g,     "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,         "<em>$1</em>")
    .replace(/___(.+?)___/g,       "<strong><em>$1</em></strong>")
    .replace(/__(.+?)__/g,         "<strong>$1</strong>")
    .replace(/_(.+?)_/g,           "<em>$1</em>")
    .replace(/~~(.+?)~~/g,         "<del>$1</del>")
    .replace(/`([^`]+)`/g,         "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

export function BlogDetailBody({ content }: BlogDetailBodyProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return ""
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
        /*
          Using arbitrary Tailwind child-element selectors ([&_tag]) instead of
          @tailwindcss/typography prose classes — this works even if the prose
          plugin is not installed, and gives us direct control over every element.
        */
        <div
          className={`
            text-sm leading-relaxed text-[var(--color-dark-slate-gray)]

            [&_h1]:text-2xl  [&_h1]:font-bold [&_h1]:mt-6  [&_h1]:mb-3  [&_h1]:text-[var(--color-dark-slate-gray)]
            [&_h2]:text-xl   [&_h2]:font-bold [&_h2]:mt-5  [&_h2]:mb-2  [&_h2]:text-[var(--color-dark-slate-gray)]
            [&_h3]:text-lg   [&_h3]:font-bold [&_h3]:mt-4  [&_h3]:mb-2  [&_h3]:text-[var(--color-dark-slate-gray)]
            [&_h4]:text-base [&_h4]:font-bold [&_h4]:mt-4  [&_h4]:mb-1  [&_h4]:text-[var(--color-dark-slate-gray)]
            [&_h5]:text-sm   [&_h5]:font-bold [&_h5]:mt-3  [&_h5]:mb-1  [&_h5]:text-[var(--color-dark-slate-gray)]
            [&_h6]:text-xs   [&_h6]:font-bold [&_h6]:mt-3  [&_h6]:mb-1  [&_h6]:text-[var(--color-cool-gray)]

            [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[var(--color-dark-slate-gray)]

            [&_ul]:list-disc   [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1.5
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1.5
            [&_li]:leading-relaxed [&_li]:text-[var(--color-dark-slate-gray)]

            [&_strong]:font-bold   [&_strong]:text-[var(--color-dark-slate-gray)]
            [&_em]:italic
            [&_del]:line-through   [&_del]:opacity-60

            [&_code]:bg-[oklch(0.95_0.02_210)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                     [&_code]:text-[var(--color-soft-blue)] [&_code]:text-[12px] [&_code]:font-mono

            [&_pre]:bg-[oklch(0.14_0.02_250)] [&_pre]:text-[oklch(0.92_0.04_210)]
                    [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto
                    [&_pre]:mb-4 [&_pre]:text-[13px] [&_pre]:leading-relaxed
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit

            [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-soft-blue)]
                          [&_blockquote]:pl-4 [&_blockquote]:italic
                          [&_blockquote]:text-[var(--color-cool-gray)] [&_blockquote]:mb-4

            [&_a]:text-[var(--color-soft-blue)] [&_a]:underline [&_a]:underline-offset-2
                  [&_a]:hover:opacity-80

            [&_hr]:border-[oklch(0.90_0.02_210)] [&_hr]:my-6
          `}
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
