"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import CountUp from "@/blocks/TextAnimations/CountUp/CountUp"
import {
  Plus, Search, Trash2, X, User, Stethoscope, FlaskConical,
  Salad, Phone, Mail, Calendar, Star, Clock, ChevronDown,
  BadgeCheck, Globe
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "doctor" | "nutritionist" | "pathologist"

interface WorkingHour {
  day: string
  start: string
  end: string
  location: string
  _id?: string
}

interface Worker {
  _id: string
  id: string
  name: string
  phone: string
  gender: string
  dateofbirth: string
  img: string
  personal_email: string
  specialization: string
  experienceYears: number
  certifications: string[]
  education: string[]
  languages: string[]
  bio: string
  consultationFee: number
  workingHours: WorkingHour[]
  rating: number
  createdAt: string
  role: Role
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_WORKERS: Worker[] = [
  {
    _id: "1", id: "d1", name: "Dr. Sarah Johnson", phone: "0308-4855737",
    gender: "Female", dateofbirth: "24-09-1984", img: "",
    personal_email: "sarah.johnson@gmail.com", specialization: "General Medicine",
    experienceYears: 8, certifications: ["MBBS", "FCPS"], education: ["Aga Khan University"],
    languages: ["English", "Urdu"], bio: "Experienced general physician.",
    consultationFee: 1500, workingHours: [{ day: "Monday", start: "09:00", end: "17:00", location: "Bahria Hospital", _id: "w1" }],
    rating: 4.8, createdAt: "2026-01-15T10:00:00Z", role: "doctor",
  },
  {
    _id: "2", id: "d2", name: "Dr. Ahmed Raza", phone: "0321-1234567",
    gender: "Male", dateofbirth: "10-03-1979", img: "",
    personal_email: "ahmed.raza@gmail.com", specialization: "Cardiology",
    experienceYears: 15, certifications: ["MBBS", "MD", "FACC"], education: ["King Edward Medical University"],
    languages: ["English", "Urdu", "Punjabi"], bio: "Specialist in cardiovascular diseases.",
    consultationFee: 3000, workingHours: [{ day: "Tuesday", start: "10:00", end: "16:00", location: "Shaukat Khanum", _id: "w2" }],
    rating: 4.9, createdAt: "2026-02-01T08:00:00Z", role: "doctor",
  },
  {
    _id: "3", id: "n1", name: "Ayesha Malik", phone: "0345-9876543",
    gender: "Female", dateofbirth: "15-07-1990", img: "",
    personal_email: "ayesha.malik@gmail.com", specialization: "Clinical Nutrition",
    experienceYears: 5, certifications: ["BSc Nutrition", "RDN"], education: ["University of Health Sciences"],
    languages: ["English", "Urdu"], bio: "Certified dietitian specializing in metabolic health.",
    consultationFee: 1000, workingHours: [{ day: "Wednesday", start: "11:00", end: "19:00", location: "Online", _id: "w3" }],
    rating: 4.6, createdAt: "2026-01-20T09:00:00Z", role: "nutritionist",
  },
  {
    _id: "4", id: "n2", name: "Zara Khan", phone: "0312-5647382",
    gender: "Female", dateofbirth: "22-11-1992", img: "",
    personal_email: "zara.khan@gmail.com", specialization: "Sports Nutrition",
    experienceYears: 3, certifications: ["MSc Nutrition"], education: ["Lahore College for Women University"],
    languages: ["English", "Urdu"], bio: "Helping athletes reach peak performance through diet.",
    consultationFee: 800, workingHours: [{ day: "Thursday", start: "12:00", end: "18:00", location: "Fitness Hub", _id: "w4" }],
    rating: 4.5, createdAt: "2026-03-01T10:00:00Z", role: "nutritionist",
  },
  {
    _id: "5", id: "p1", name: "Dr. Usman Tariq", phone: "0300-1122334",
    gender: "Male", dateofbirth: "05-04-1975", img: "",
    personal_email: "usman.tariq@gmail.com", specialization: "Clinical Pathology",
    experienceYears: 20, certifications: ["MBBS", "MRCPath"], education: ["Rawalpindi Medical University"],
    languages: ["English", "Urdu"], bio: "Expert in diagnostic lab testing and blood analysis.",
    consultationFee: 2000, workingHours: [{ day: "Monday", start: "08:00", end: "14:00", location: "Chughtai Lab", _id: "w5" }],
    rating: 4.7, createdAt: "2025-12-10T07:00:00Z", role: "pathologist",
  },
  {
    _id: "6", id: "p2", name: "Dr. Nadia Hussain", phone: "0333-7788990",
    gender: "Female", dateofbirth: "18-06-1983", img: "",
    personal_email: "nadia.hussain@gmail.com", specialization: "Histopathology",
    experienceYears: 12, certifications: ["MBBS", "FCPS Pathology"], education: ["University of the Punjab"],
    languages: ["English", "Urdu", "French"], bio: "Specialist in tissue-based diagnosis.",
    consultationFee: 2500, workingHours: [{ day: "Friday", start: "09:00", end: "15:00", location: "Mayo Hospital", _id: "w6" }],
    rating: 4.9, createdAt: "2026-01-05T11:00:00Z", role: "pathologist",
  },
]

// ─── Role Config ──────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<Role, {
  label: string
  plural: string
  icon: React.ElementType
  color: string
  colorClass: string
  gradient: string
  lightBg: string
}> = {
  doctor: {
    label: "Doctor", plural: "Doctors", icon: Stethoscope,
    color: "var(--color-soft-blue)",
    colorClass: "soft-blue",
    gradient: "linear-gradient(135deg, var(--color-soft-blue), oklch(0.45 0.18 230))",
    lightBg: "oklch(0.95 0.05 210)",
  },
  nutritionist: {
    label: "Nutritionist", plural: "Nutritionists", icon: Salad,
    color: "var(--color-mint-green)",
    colorClass: "mint-green",
    gradient: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))",
    lightBg: "oklch(0.95 0.04 178)",
  },
  pathologist: {
    label: "Pathologist", plural: "Pathologists", icon: FlaskConical,
    color: "var(--color-soft-coral)",
    colorClass: "soft-coral",
    gradient: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))",
    lightBg: "oklch(0.96 0.06 10)",
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-[var(--color-dark-slate-gray)]">{rating.toFixed(1)}</span>
    </div>
  )
}

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("")
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

// ─── Stat Cards — AdminStatsCards layout ──────────────────────────────────────

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function WorkerStatCards({ counts }: { counts: Record<Role, number> }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => {
        const cfg = ROLE_CONFIG[role]
        const Icon = cfg.icon
        return (
          <motion.div key={role} variants={itemVariants} className="h-full">
            <Card
              className={`h-full flex flex-col justify-between bg-gradient-to-br from-${cfg.colorClass}/10 to-${cfg.colorClass}/5 border-${cfg.colorClass}/20`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{cfg.plural}</p>
                    <p className={`text-2xl font-bold text-${cfg.colorClass}`}>
                      <CountUp
                        from={0}
                        to={counts[role]}
                        separator=","
                        direction="up"
                        duration={1}
                        className={`text-${cfg.colorClass}`}
                      />
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 text-${cfg.colorClass}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── Worker Card ──────────────────────────────────────────────────────────────

function WorkerCard({ worker, onDelete }: { worker: Worker; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = ROLE_CONFIG[worker.role]
  const Icon = cfg.icon

  return (
    <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="h-1 w-full" style={{ background: cfg.gradient }} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar name={worker.name} color={cfg.color} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-[var(--color-dark-slate-gray)] text-base leading-tight truncate">
                  {worker.name}
                </h3>
                <p className="text-xs mt-1 font-medium" style={{ color: cfg.color }}>
                  {worker.specialization}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                <StarRating rating={worker.rating} />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {worker.experienceYears > 0 && (
                <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: cfg.lightBg, color: cfg.color }}>
                  {worker.experienceYears} yrs exp
                </span>
              )}
              {worker.consultationFee > 0 && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium">
                  Rs. {worker.consultationFee.toLocaleString()}
                </span>
              )}
              {worker.certifications.slice(0, 2).map(c => (
                <span key={c} className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" />{c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-4 text-xs text-[var(--color-cool-gray)]">
          {worker.personal_email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{worker.personal_email}</span>
            </div>
          )}
          {worker.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{worker.phone}</span>
            </div>
          )}
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-xs text-[var(--color-cool-gray)]">
            {worker.bio && <p className="italic leading-relaxed">{worker.bio}</p>}

            {worker.languages.length > 0 && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{worker.languages.join(", ")}</span>
              </div>
            )}

            {worker.workingHours.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[var(--color-dark-slate-gray)]">Working Hours</span>
                </div>
                <div className="grid gap-1.5">
                  {worker.workingHours.slice(0, 3).map((wh, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 text-[11px]">
                      <span className="font-semibold w-20">{wh.day}</span>
                      <span>{wh.start} – {wh.end}</span>
                      <span className="truncate ml-2 max-w-[100px] text-right">{wh.location}</span>
                    </div>
                  ))}
                  {worker.workingHours.length > 3 && (
                    <p className="text-[11px] text-center text-[var(--color-cool-gray)] pt-0.5">
                      +{worker.workingHours.length - 3} more days
                    </p>
                  )}
                </div>
              </div>
            )}

            {worker.dateofbirth && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>DOB: {worker.dateofbirth} · {worker.gender}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: cfg.color }}
          >
            {expanded ? "Less info" : "More info"}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={() => onDelete(worker._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-soft-coral)] hover:bg-[var(--color-soft-coral)]/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Add Worker Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "", personal_email: "", phone: "", specialization: "",
  gender: "", dateofbirth: "", bio: "", consultationFee: "", experienceYears: "",
  role: "doctor" as Role,
}

function AddWorkerModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (worker: Worker) => void
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
        rating: 0, createdAt: new Date().toISOString(),
        certifications: [], education: [], languages: ["English"],
        workingHours: [], img: "",
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

  const field = (key: keyof typeof form, label: string, type = "text", options?: string[]) => (
    <div>
      <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1">{label}</label>
      {options ? (
        <select
          value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value as any })}
          className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none bg-white"
        >
          {options.map(o => <option key={o} value={o}>{o || `Select ${label}`}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none"
          placeholder={label}
        />
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-semibold text-[var(--color-dark-slate-gray)]">Add New Worker</h2>
          <p className="text-sm text-[var(--color-cool-gray)] mt-0.5">Register a new team member</p>
        </div>

        <div className="p-6 space-y-3">
          {field("role", "Role", "text", ["doctor", "nutritionist", "pathologist"])}
          {field("name", "Full Name")}
          {field("personal_email", "Email", "email")}
          {field("phone", "Phone Number")}
          {field("specialization", "Specialization")}
          {field("gender", "Gender", "text", ["", "Male", "Female", "Other"])}
          {field("dateofbirth", "Date of Birth (DD-MM-YYYY)")}
          {field("experienceYears", "Years of Experience", "number")}
          {field("consultationFee", "Consultation Fee (Rs.)", "number")}

          <div>
            <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-mint-green)] outline-none resize-none"
              placeholder="Short bio..."
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-soft-coral)] bg-[var(--color-soft-coral)]/10 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-white font-medium shadow-md disabled:opacity-60 transition"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? "Registering..." : "Register Worker"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 rounded-full bg-[var(--color-soft-coral)]/10 flex items-center justify-center">
          <Trash2 className="text-[var(--color-soft-coral)] w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-dark-slate-gray)]">Remove Worker?</h2>
        <p className="text-sm text-[var(--color-cool-gray)]">This action cannot be undone.</p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border hover:bg-gray-50 text-sm">Cancel</button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-white text-sm"
            style={{ background: "var(--color-soft-coral)" }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { label: string; value: Role | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Doctors", value: "doctor" },
  { label: "Nutritionists", value: "nutritionist" },
  { label: "Pathologists", value: "pathologist" },
]

export default function ManageUsersPage() {
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<Role | "all">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const counts = useMemo(() => ({
    doctor:       workers.filter(w => w.role === "doctor").length,
    nutritionist: workers.filter(w => w.role === "nutritionist").length,
    pathologist:  workers.filter(w => w.role === "pathologist").length,
  }), [workers])

  const filtered = useMemo(() => {
    return workers.filter(w => {
      const matchTab = activeTab === "all" || w.role === activeTab
      const q = search.toLowerCase()
      const matchSearch = !q || w.name.toLowerCase().includes(q) ||
        w.specialization.toLowerCase().includes(q) ||
        w.personal_email.toLowerCase().includes(q)
      return matchTab && matchSearch
    })
  }, [workers, search, activeTab])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`http://localhost:4000/auth/delete-worker`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      })
    } catch { /* optimistic delete */ }
    setWorkers(prev => prev.filter(w => w._id !== deleteId))
    setDeleteId(null)
  }

  const groupedFiltered = useMemo(() => {
    const roles: Role[] = ["doctor", "nutritionist", "pathologist"]
    if (activeTab !== "all") {
      return { [activeTab]: filtered }
    }
    return Object.fromEntries(roles.map(r => [r, filtered.filter(w => w.role === r)]))
  }, [filtered, activeTab])

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)] fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-soft-blue)] via-[var(--color-mint-green)] to-[var(--color-soft-coral)] bg-clip-text text-transparent pb-1">
            Manage Workers
          </h1>
          <p className="text-sm text-[var(--color-cool-gray)] mt-1">
            {workers.length} total registered workers
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-md hover:scale-[1.02] transition"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="w-4 h-4" />
          Add Worker
        </button>
      </div>

      {/* STAT CARDS — AdminStatsCards layout */}
      <WorkerStatCards counts={counts} />

      {/* SEARCH + TABS */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, specialization or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none bg-white shadow-sm text-sm"
            />
          </div>

          <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm self-start sm:self-auto">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={
                  activeTab === tab.value
                    ? { background: "var(--gradient-primary)", color: "white" }
                    : { color: "var(--color-cool-gray)" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WORKER SECTIONS */}
      {(Object.entries(groupedFiltered) as [Role, Worker[]][]).map(([role, list]) => {
        if (list.length === 0 && activeTab !== "all") return null
        const cfg = ROLE_CONFIG[role]
        const Icon = cfg.icon

        return (
          <div key={role} className="space-y-3">
            {activeTab === "all" && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: cfg.lightBg }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <h2 className="font-semibold text-[var(--color-dark-slate-gray)]">
                  {cfg.plural}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: cfg.lightBg, color: cfg.color }}>
                  {list.length}
                </span>
              </div>
            )}

            {list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-cool-gray)]/30 p-8 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: cfg.color }} />
                <p className="text-sm text-[var(--color-cool-gray)]">No {cfg.plural.toLowerCase()} found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {list.map(worker => (
                  <WorkerCard key={worker._id} worker={worker} onDelete={setDeleteId} />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {showAddModal && (
        <AddWorkerModal
          onClose={() => setShowAddModal(false)}
          onAdd={(w) => setWorkers(prev => [...prev, w])}
        />
      )}

      {deleteId && (
        <DeleteModal
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
