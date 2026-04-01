"use client"

import { useState } from "react"
import { Check, Copy, Eye, EyeOff, MailOpen } from "lucide-react"

interface HtmlPreviewProps {
  html: string
  show: boolean
  onToggle: () => void
}

export function HtmlPreview({ html, show, onToggle }: HtmlPreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-[var(--color-cool-gray)]/20 overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MailOpen className="w-4 h-4 text-[var(--color-soft-blue)]" />
          <span className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">
            Email Preview
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-cool-gray)] hover:bg-gray-200 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[var(--color-mint-green)]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied" : "Copy HTML"}
          </button>
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-cool-gray)] hover:bg-gray-200 transition-colors"
          >
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Content */}
      {show ? (
        <iframe
          srcDoc={html}
          title="Newsletter Preview"
          className="w-full border-0"
          style={{ height: "520px" }}
          sandbox="allow-same-origin"
        />
      ) : (
        <div className="p-8 text-center text-[var(--color-cool-gray)]">
          <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Preview hidden. Click Show to render.</p>
        </div>
      )}
    </div>
  )
}
