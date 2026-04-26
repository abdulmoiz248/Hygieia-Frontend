import { createPortal } from "react-dom"
import { X, ExternalLink } from "lucide-react"

interface CVPdfPreviewModalProps {
  cvLink: string
  name: string
  onClose: () => void
}

/** Embedded iframe — Google Docs viewer renders the PDF inline */
function toEmbedUrl(url: string): string {
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
}

/** "Open in new tab" — uses the production app viewer so the URL and title look professional */
function toAppViewerUrl(url: string, name: string): string {
  return `https://hygieia-frontend.vercel.app/viewReport?fileUrl=${encodeURIComponent(url)}&title=${encodeURIComponent(name + " — CV")}`
}

export default function CVPdfPreviewModal({ cvLink, name, onClose }: CVPdfPreviewModalProps) {
  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">

        {/* Top stripe */}
        <div className="h-1 w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)] leading-tight">{name}</h2>
            <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">CV Preview</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Opens via your own /viewReport route — clean URL and proper title */}
            <a
              href={toAppViewerUrl(cvLink, name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-[var(--color-cool-gray)]/20 text-[var(--color-cool-gray)] hover:text-[var(--color-dark-slate-gray)] hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
            >
              <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
            </button>
          </div>
        </div>

        {/* PDF iframe — embedded Google Docs viewer renders the actual PDF */}
        <div className="flex-1 min-h-0">
          <iframe
            src={toEmbedUrl(cvLink)}
            className="w-full h-full"
            title={`${name} — CV`}
          />
        </div>
      </div>
    </div>
  )

  if (typeof document === "undefined") return null
  return createPortal(modal, document.body)
}