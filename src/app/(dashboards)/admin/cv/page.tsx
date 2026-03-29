"use client"

import { useEffect, useMemo, useState } from "react"
import { FileText, Sparkles } from "lucide-react"
import { STATUS_ORDER } from "@/types/admin/cv.config"
import type { CV, CVStatus, FilterRole, FilterStatus, SortKey } from "@/types/admin/cv"
import CVStatCards        from "@/components/admin/cv/CVStatCards"
import CVCard             from "@/components/admin/cv/CVCard"
import CVFiltersBar       from "@/components/admin/cv/CVFiltersBar"
import CVDeleteModal      from "@/components/admin/cv/CVDeleteModal"
import CVAddWorkerModal   from "@/components/admin/cv/CVAddWorkerModal"
import CVChatPanel        from "@/components/admin/cv/CVChatPanel"
import CVPdfPreviewModal  from "@/components/admin/cv/CVPdfPreviewModal"

const API = "http://localhost:4000"

export default function CVPage() {
  const [cvs, setCvs]               = useState<CV[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [filterRole, setFilterRole] = useState<FilterRole>("all")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [sortKey, setSortKey]       = useState<SortKey>("date")
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [workerName, setWorkerName] = useState<string | null>(null)
  const [chatOpen, setChatOpen]     = useState(false)
  const [preview, setPreview]       = useState<{ cvLink: string; name: string } | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const loadCvs = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/cv`)
      const data: Omit<CV, "status">[] = await res.json()
      // API has no status field — default all to "new" on first load
      setCvs(data.map(cv => ({ ...cv, status: "new" as CVStatus })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCvs() }, [])

  // ── Derived state ──────────────────────────────────────────────────────────

  const counts = useMemo(() => ({
    new:         cvs.filter(c => c.status === "new").length,
    reviewed:    cvs.filter(c => c.status === "reviewed").length,
    shortlisted: cvs.filter(c => c.status === "shortlisted").length,
    rejected:    cvs.filter(c => c.status === "rejected").length,
  }), [cvs])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return [...cvs]
      .filter(c => {
        const matchRole   = filterRole === "all" || c.role === filterRole
        const matchStatus = filterStatus === "all" || c.status === filterStatus
        const matchSearch = !q
          || c.fullName.toLowerCase().includes(q)
          || c.email.toLowerCase().includes(q)
          || c.phone.includes(q)
        return matchRole && matchStatus && matchSearch
      })
      .sort((a, b) => {
        if (sortKey === "date")       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        if (sortKey === "name")       return a.fullName.localeCompare(b.fullName)
        if (sortKey === "experience") return Number(b.experience) - Number(a.experience)
        if (sortKey === "status")     return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        return 0
      })
  }, [cvs, search, filterRole, filterStatus, sortKey])

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`${API}/cv/${deleteId}`, { method: "DELETE" })
    setCvs(prev => prev.filter(c => c.id !== deleteId))
    setDeleteId(null)
  }

  const handleStatusChange = (id: string, status: CVStatus) =>
    setCvs(prev => prev.map(c => c.id === id ? { ...c, status } : c))

  const handleAddAsWorker = (cv: CV) => setWorkerName(cv.fullName)

  const handlePreview = (cvLink: string, name: string) => setPreview({ cvLink, name })

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)] fade-in">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-soft-coral bg-clip-text pb-1">CV Management</h1>
        <p className="text-sm text-[var(--color-cool-gray)] mt-1">
          {loading ? "Loading…" : `${cvs.length} total CVs received`}
        </p>
      </div>

      {/* Stat cards */}
      <CVStatCards counts={counts} />

      {/* Filters */}
      <CVFiltersBar
        search={search}               onSearch={setSearch}
        filterRole={filterRole}       onFilterRole={setFilterRole}
        filterStatus={filterStatus}   onFilterStatus={setFilterStatus}
        sortKey={sortKey}             onSort={setSortKey}
      />

      {/* CV grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-[var(--color-cool-gray)]/15 shadow-sm h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-cool-gray)]/30 p-12 text-center">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-20 text-[var(--color-cool-gray)]" />
          <p className="text-sm text-[var(--color-cool-gray)]">No CVs match your filters</p>
          {filterStatus !== "all" && (
            <button onClick={() => setFilterStatus("all")}
              className="mt-3 text-xs font-medium underline"
              style={{ color: "var(--color-soft-blue)" }}>
              Clear status filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {filtered.map(cv => (
            <CVCard key={cv.id} cv={cv}
              onDelete={setDeleteId}
              onAddAsWorker={handleAddAsWorker}
              onStatusChange={handleStatusChange}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}

      {/* Floating chat button */}
      {!chatOpen && (
  <button
    onClick={() => setChatOpen(true)}
    className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full text-white shadow-2xl hover:scale-105 transition-all duration-200 z-40"
    style={{ background: "var(--gradient-primary)" }}
  >
    <Sparkles className="w-5 h-5" />
  </button>
)}

      {/* Modals & overlays */}
      {chatOpen   && <CVChatPanel      onClose={() => setChatOpen(false)} />}
      {deleteId   && <CVDeleteModal    onConfirm={handleDelete} onClose={() => setDeleteId(null)} />}
      {workerName && <CVAddWorkerModal name={workerName}        onClose={() => setWorkerName(null)} />}
      {preview    && <CVPdfPreviewModal cvLink={preview.cvLink} name={preview.name} onClose={() => setPreview(null)} />}
    </div>
  )
}
