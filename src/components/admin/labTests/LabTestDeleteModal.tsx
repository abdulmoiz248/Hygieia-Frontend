"use client"

import { createPortal } from "react-dom"
import { X, Trash2, AlertTriangle } from "lucide-react"

interface LabTestDeleteModalProps {
  testName: string
  onConfirm: () => void
  onClose: () => void
  isPending: boolean
}

export default function LabTestDeleteModal({
  testName,
  onConfirm,
  onClose,
  isPending,
}: LabTestDeleteModalProps) {
  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div
          className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
        />

        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.96 0.06 10)" }}>
              <Trash2 className="w-5 h-5" style={{ color: "var(--color-soft-coral)" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)] leading-tight">Delete Lab Test</h2>
              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">This action is permanent</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div
            className="flex gap-3 p-3.5 rounded-xl border border-[var(--color-soft-coral)]/20"
            style={{ background: "oklch(0.98 0.02 10)" }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-soft-coral)" }} />
            <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed">
              <span className="font-semibold text-[var(--color-dark-slate-gray)]">"{testName}"</span> will be permanently deleted. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-[var(--color-cool-gray)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-5 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] shadow-sm disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
          >
            {isPending ? "Deleting…" : "Delete Test"}
          </button>
        </div>
      </div>
    </div>
  )

  if (typeof document === "undefined") return null
  return createPortal(modal, document.body)
}
