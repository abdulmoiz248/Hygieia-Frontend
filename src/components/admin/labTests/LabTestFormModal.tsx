"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import {
  X,
  TestTube,
  Plus,
  Trash2,
  ChevronDown,
  FlaskConical,
  ScanLine,
} from "lucide-react"
import {
  LabTest,
  LabTestFormData,
  EMPTY_LAB_TEST_FORM,
  LAB_CATEGORIES,
  RecordType,
} from "@/types/admin/labTests"

interface LabTestFormModalProps {
  initial?: LabTest
  onSubmit: (data: LabTestFormData) => void
  onClose: () => void
  isPending: boolean
}

const RECORD_TYPES: { value: RecordType; label: string; icon: React.ElementType }[] = [
  { value: "report",  label: "Report",  icon: FlaskConical },
  { value: "scan",    label: "Scan",    icon: ScanLine     },
]

function normalizeRecordType(value?: string): RecordType {
  return value === "scan" ? "scan" : "report"
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--color-cool-gray)] mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const INPUT_CLS =
  "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15 placeholder:text-gray-400"

const ERROR_INPUT_CLS =
  "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-red-50 border border-red-300 focus:bg-white focus:border-red-400 placeholder:text-gray-400"

export default function LabTestFormModal({
  initial,
  onSubmit,
  onClose,
  isPending,
}: LabTestFormModalProps) {
  const isEditing = !!initial

  const [form, setForm] = useState<LabTestFormData>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          category: initial.category,
          price: initial.price,
          duration: initial.duration,
          preparation_instructions: initial.preparation_instructions,
          unit: initial.unit,
          optimal_range: initial.optimal_range,
          // map legacy backend values to the supported UI values
          record_type: normalizeRecordType(initial.record_type),
        }
      : { ...EMPTY_LAB_TEST_FORM }
  )

  const [attempted, setAttempted] = useState(false)
  const [instrInput, setInstrInput] = useState("")

  const set = <K extends keyof LabTestFormData>(key: K) =>
    (val: LabTestFormData[K]) => setForm((f) => ({ ...f, [key]: val }))

  const addInstruction = () => {
    const trimmed = instrInput.trim()
    if (!trimmed) return
    set("preparation_instructions")([...form.preparation_instructions, trimmed])
    setInstrInput("")
  }

  const removeInstruction = (i: number) =>
    set("preparation_instructions")(form.preparation_instructions.filter((_, idx) => idx !== i))

  const errors = {
    name:     attempted && !form.name.trim()     ? "Name is required."     : "",
    category: attempted && !form.category.trim() ? "Category is required." : "",
    price:    attempted && form.price <= 0       ? "Price must be > 0."    : "",
    duration: attempted && !form.duration.trim() ? "Duration is required." : "",
  }

  const handleSubmit = () => {
    setAttempted(true)
    if (!form.name.trim() || !form.category.trim() || form.price <= 0 || !form.duration.trim()) return
    onSubmit(form)
  }

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">

        {/* Stripe */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: "var(--gradient-primary)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.95 0.05 210)" }}>
              <TestTube className="w-4.5 h-4.5 text-[var(--color-soft-blue)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--color-dark-slate-gray)] text-sm">
                {isEditing ? "Edit Lab Test" : "Add New Lab Test"}
              </h2>
              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">
                {isEditing ? "Update the fields below" : "Fill in details to create a new test"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Row 1: Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Test Name" required error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="e.g. Complete Blood Count (CBC)"
                className={errors.name ? ERROR_INPUT_CLS : INPUT_CLS}
              />
            </Field>

            <Field label="Category" required error={errors.category}>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => set("category")(e.target.value)}
                  className={`${errors.category ? ERROR_INPUT_CLS : INPUT_CLS} appearance-none pr-8`}
                >
                  <option value="">Select category…</option>
                  {LAB_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__custom__">Other (type below)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              {form.category === "__custom__" && (
                <input
                  type="text"
                  className={`${INPUT_CLS} mt-2`}
                  placeholder="Enter custom category"
                  onChange={(e) => set("category")(e.target.value)}
                />
              )}
            </Field>
          </div>

          {/* Row 2: Description */}
          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              placeholder="Describe what this test measures…"
              className={`${INPUT_CLS} resize-none`}
            />
          </Field>

          {/* Row 3: Price + Duration + Record Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Price (PKR)" required error={errors.price}>
              <input
                type="number"
                min={0}
                value={form.price || ""}
                onChange={(e) => set("price")(Number(e.target.value))}
                placeholder="e.g. 1500"
                className={errors.price ? ERROR_INPUT_CLS : INPUT_CLS}
              />
            </Field>

            <Field label="Duration" required error={errors.duration}>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => set("duration")(e.target.value)}
                placeholder="e.g. 24-48 hours"
                className={errors.duration ? ERROR_INPUT_CLS : INPUT_CLS}
              />
            </Field>

            <Field label="Record Type">
              <div className="flex gap-1.5">
                {RECORD_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("record_type")(value)}
                    className="flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 hover:scale-[1.02] flex items-center justify-center gap-1.5"
                    style={
                      form.record_type === value
                        ? { background: "oklch(0.95 0.05 210)", borderColor: "var(--color-soft-blue)", color: "var(--color-soft-blue)" }
                        : { background: "#f9fafb", borderColor: "#e5e7eb", color: "var(--color-cool-gray)" }
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Row 4: Unit + Optimal Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Unit">
              <input
                type="text"
                value={form.unit}
                onChange={(e) => set("unit")(e.target.value)}
                placeholder="e.g. mg/dL, cells/mcL"
                className={INPUT_CLS}
              />
            </Field>

            <Field label="Optimal Range">
              <input
                type="text"
                value={form.optimal_range}
                onChange={(e) => set("optimal_range")(e.target.value)}
                placeholder="e.g. 70-100"
                className={INPUT_CLS}
              />
            </Field>
          </div>

          {/* Preparation Instructions */}
          <Field label="Preparation Instructions">
            <div className="space-y-2">
              {form.preparation_instructions.map((instr, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--color-soft-blue)]/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ color: "var(--color-soft-blue)" }}>
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm text-[var(--color-dark-slate-gray)]">{instr}</p>
                  <button
                    onClick={() => removeInstruction(i)}
                    className="p-1 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add instruction row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={instrInput}
                  onChange={(e) => setInstrInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInstruction())}
                  placeholder="Type an instruction and press Add…"
                  className={`${INPUT_CLS} flex-1`}
                />
                <button
                  type="button"
                  onClick={addInstruction}
                  disabled={!instrInput.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 flex-shrink-0"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-cool-gray)] hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 shadow-md"
            style={{ background: "var(--gradient-primary)" }}
          >
            {isPending
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {isEditing ? "Saving…" : "Creating…"}</span>
              : isEditing ? "Save Changes" : "Create Lab Test"
            }
          </button>
        </div>
      </div>
    </div>
  )

  if (typeof document === "undefined") return null
  return createPortal(modal, document.body)
}