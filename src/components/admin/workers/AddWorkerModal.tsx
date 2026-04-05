"use client"

import { useState } from "react"
import { X, User, Stethoscope, Salad, FlaskConical } from "lucide-react"
import { Role } from "@/types/admin/workers"
import { useRegisterWorker } from "@/hooks/admin/workers/useRegisterWorker"
import { adminSuccess, adminError } from "@/toasts/AdminToasts"

// Backend accepts "lab-technician" for the pathologist role
const ROLE_API_VALUE: Record<Role, string> = {
  doctor:       "doctor",
  nutritionist: "nutritionist",
  pathologist:  "lab-technician",
}

const ROLE_OPTIONS: {
  value: Role
  label: string
  icon: React.ElementType
  color: string
  bg: string
}[] = [
  { value: "doctor",       label: "Doctor",       icon: Stethoscope,  color: "var(--color-soft-blue)",  bg: "oklch(0.95 0.05 210)" },
  { value: "nutritionist", label: "Nutritionist", icon: Salad,        color: "var(--color-mint-green)", bg: "oklch(0.95 0.04 178)" },
  { value: "pathologist",  label: "Pathologist",  icon: FlaskConical, color: "var(--color-soft-coral)", bg: "oklch(0.96 0.06 10)"  },
]

const EMPTY_FORM = {
  name:          "",
  personalEmail: "",
  role:          "doctor" as Role,
}

interface AddWorkerModalProps {
  onClose: () => void
}

export default function AddWorkerModal({ onClose }: AddWorkerModalProps) {
  const [form, setForm]                       = useState(EMPTY_FORM)
  const [validationError, setValidationError] = useState("")

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }))

  const { mutate: register, isPending } = useRegisterWorker({
    onSuccess: () => {
      adminSuccess(`${form.name} registered. Credentials sent to their email.`)
      onClose()
    },
    onError: (err) => {
      adminError(err.message || "Failed to register worker.")
    },
  })

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setValidationError("Name is required.")
      return
    }
    if (!form.personalEmail.trim()) {
      setValidationError("Personal email is required.")
      return
    }
    setValidationError("")

    // FIX: Separate the API payload (sent to backend) from the frontendRole
    // (used only for cache invalidation in the hook). Previously _frontendRole
    // was merged into the body and caused a 400 Bad Request from the backend DTO.
    register(
      {
        name:          form.name.trim(),
        personalEmail: form.personalEmail.trim(),
        role:          ROLE_API_VALUE[form.role], // "doctor" | "nutritionist" | "lab-technician"
      },
      // Pass frontend Role as the second arg — your hook should accept this
      // as metadata for cache invalidation (not forwarded to the API).
      // If your hook signature is useRegisterWorker({ onSuccess, onError }),
      // move frontendRole into a ref or closure instead — see comment below.
      { meta: { frontendRole: form.role } } as any
    )
  }

  const selectedRoleCfg = ROLE_OPTIONS.find((r) => r.value === form.role)!

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden">

        {/* Role-coloured top stripe */}
        <div
          className="h-1 w-full flex-shrink-0 transition-all duration-300"
          style={{ background: selectedRoleCfg.color }}
        />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{ background: selectedRoleCfg.bg }}
            >
              <User className="w-5 h-5" style={{ color: selectedRoleCfg.color }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">Add New Worker</h2>
              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">Credentials will be emailed automatically</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mt-0.5">
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">

          {/* Role selector */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-2">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map(({ value, label, icon: Icon, color, bg }) => {
                const active = form.role === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("role")(value)}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-200"
                    style={
                      active
                        ? { background: bg, borderColor: color, color }
                        : { background: "#f9fafb", borderColor: "#e5e7eb", color: "var(--color-cool-gray)" }
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">Full Name</label>
            <input
              type="text"
              name="worker-name"
              autoComplete="off"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="e.g. Dr. Sarah Johnson"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all
                bg-gray-50 border border-gray-200
                focus:bg-white focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15
                placeholder:text-gray-400"
            />
          </div>

          {/* Personal Email */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">Personal Email</label>
            <input
              type="email"
              name="worker-personal-email"
              autoComplete="off"
              value={form.personalEmail}
              onChange={(e) => set("personalEmail")(e.target.value)}
              placeholder="e.g. sarah@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all
                bg-gray-50 border border-gray-200
                focus:bg-white focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15
                placeholder:text-gray-400"
            />
            <p className="text-[11px] text-[var(--color-cool-gray)]/70 mt-1.5 pl-0.5">
              Login credentials will be sent to this address.
            </p>
          </div>

          {/* Validation error */}
          {validationError && (
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--color-soft-coral)]/30"
              style={{ background: "oklch(0.98 0.02 10)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-soft-coral)" }} />
              <p className="text-sm text-[var(--color-soft-coral)]">{validationError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-2.5 rounded-xl text-white font-medium shadow-md disabled:opacity-60 transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "var(--gradient-primary)" }}
          >
            {isPending ? "Registering…" : "Register Worker"}
          </button>
        </div>
      </div>
    </div>
  )
}
