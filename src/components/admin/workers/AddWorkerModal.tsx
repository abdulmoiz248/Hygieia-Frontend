"use client"

import { useState } from "react"
import { X, User, Stethoscope, Salad, FlaskConical } from "lucide-react"
import { Worker, Role } from "@/types/admin/workers"

const EMPTY_FORM = {
  name: "",
  personal_email: "",
  phone: "",
  specialization: "",
  gender: "",
  dateofbirth: "",
  bio: "",
  consultationFee: "",
  experienceYears: "",
  role: "doctor" as Role,
}

const ROLE_OPTIONS: { value: Role; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { value: "doctor",       label: "Doctor",       icon: Stethoscope,   color: "var(--color-soft-blue)",  bg: "oklch(0.95 0.05 210)" },
  { value: "nutritionist", label: "Nutritionist", icon: Salad,         color: "var(--color-mint-green)", bg: "oklch(0.95 0.04 178)" },
  { value: "pathologist",  label: "Pathologist",  icon: FlaskConical,  color: "var(--color-soft-coral)", bg: "oklch(0.96 0.06 10)"  },
]

interface AddWorkerModalProps {
  onClose: () => void
  onAdd: (worker: Worker) => void
}

// Reusable field components
function TextInput({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all
          bg-gray-50 border border-gray-200
          focus:bg-white focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15
          placeholder:text-gray-400"
      />
    </div>
  )
}

function SelectInput({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all
          bg-gray-50 border border-gray-200
          focus:bg-white focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15
          text-gray-700"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-cool-gray)]/60 pt-1">
      {children}
    </p>
  )
}

export default function AddWorkerModal({ onClose, onAdd }: AddWorkerModalProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.personal_email || !form.role) {
      setError("Name, email and role are required.")
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:4000/auth/register-worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          consultationFee: Number(form.consultationFee) || 0,
          experienceYears: Number(form.experienceYears) || 0,
          languages: ["English"],
          certifications: [],
          education: [],
          workingHours: [],
        }),
      })

      if (!res.ok) throw new Error("Registration failed")
      const data = await res.json()

      onAdd({
        _id: data._id || Math.random().toString(),
        id: data.id || Math.random().toString(),
        rating: 0,
        createdAt: new Date().toISOString(),
        certifications: [],
        education: [],
        languages: ["English"],
        workingHours: [],
        img: "",
        ...form,
        consultationFee: Number(form.consultationFee) || 0,
        experienceYears: Number(form.experienceYears) || 0,
      })
      onClose()
    } catch {
      setError("Failed to register worker. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const selectedRoleCfg = ROLE_OPTIONS.find((r) => r.value === form.role)!

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[92vh] flex flex-col border border-gray-100 overflow-hidden">

        {/* Gradient top stripe — changes with selected role */}
        <div className="h-1 w-full flex-shrink-0 transition-all duration-300"
          style={{ background: selectedRoleCfg.color }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{ background: selectedRoleCfg.bg }}>
              <User className="w-5 h-5 transition-colors" style={{ color: selectedRoleCfg.color }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">Add New Worker</h2>
              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">Register a new team member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mt-0.5"
          >
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="p-6 space-y-4 overflow-y-auto">

          {/* Role selector — visual pill buttons */}
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
                    style={active
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

          {/* Personal info */}
          <SectionLabel>Personal Info</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <TextInput label="Full Name" value={form.name} onChange={set("name")} />
            </div>
            <TextInput label="Email" value={form.personal_email} onChange={set("personal_email")} type="email" />
            <TextInput label="Phone" value={form.phone} onChange={set("phone")} />
            <SelectInput
              label="Gender"
              value={form.gender}
              onChange={set("gender")}
              options={[
                { value: "", label: "Select gender" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
            <TextInput label="Date of Birth" value={form.dateofbirth} onChange={set("dateofbirth")} placeholder="DD-MM-YYYY" />
          </div>

          {/* Professional info */}
          <SectionLabel>Professional Info</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <TextInput label="Specialization" value={form.specialization} onChange={set("specialization")} />
            </div>
            <TextInput label="Years of Experience" value={form.experienceYears} onChange={set("experienceYears")} type="number" />
            <TextInput label="Consultation Fee (Rs.)" value={form.consultationFee} onChange={set("consultationFee")} type="number" />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => set("bio")(e.target.value)}
              rows={3}
              placeholder="Short professional bio…"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all resize-none
                bg-gray-50 border border-gray-200
                focus:bg-white focus:border-[var(--color-mint-green)] focus:ring-2 focus:ring-[var(--color-mint-green)]/15
                placeholder:text-gray-400"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--color-soft-coral)]/30"
              style={{ background: "oklch(0.98 0.02 10)" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-soft-coral)" }} />
              <p className="text-sm text-[var(--color-soft-coral)]">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-white font-medium shadow-md disabled:opacity-60 transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? "Registering…" : "Register Worker"}
          </button>
        </div>
      </div>
    </div>
  )
}
