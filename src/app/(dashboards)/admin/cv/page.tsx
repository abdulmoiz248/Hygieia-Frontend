"use client"

import { useMemo, useState } from "react"
import { FileText, Sparkles }  from "lucide-react"
import { STATUS_ORDER }        from "@/types/admin/cv.config"
import type { CV, CVStatus, FilterRole, FilterStatus, SortKey } from "@/types/admin/cv"
import CVStatCards       from "@/components/admin/cv/CVStatCards"
import CVCard            from "@/components/admin/cv/CVCard"
import CVFiltersBar      from "@/components/admin/cv/CVFiltersBar"
import CVDeleteModal     from "@/components/admin/cv/CVDeleteModal"
import CVAddWorkerModal  from "@/components/admin/cv/CVAddWorkerModal"
import CVChatPanel       from "@/components/admin/cv/CVChatPanel"
import CVPdfPreviewModal from "@/components/admin/cv/CVPdfPreviewModal"
import { useCVs }           from "@/hooks/admin/cv/useCVs"
import { useDeleteCV }      from "@/hooks/admin/cv/useDeleteCV"
import { useAddWorker }     from "@/hooks/admin/cv/useAddWorker"
import { useUpdateCVStatus } from "@/hooks/admin/cv/useUpdateCVStatus"
import { adminError, adminDestructive, adminSuccess, adminInfo, AdminToastContainer } from "@/toasts/AdminToasts"

// Statuses that trigger a candidate email on the backend
const EMAIL_TRIGGER_STATUSES: CVStatus[] = ["shortlisted", "rejected"]

export default function CVPage() {
  // ── Filters / UI state ────────────────────────────────────────────────────
  const [search,       setSearch]       = useState("")
  const [filterRole,   setFilterRole]   = useState<FilterRole>("all")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [sortKey,      setSortKey]      = useState<SortKey>("date")

  // ── Modal state ───────────────────────────────────────────────────────────
  const [deleteId,    setDeleteId]    = useState<string | null>(null)
  const [workerName,  setWorkerName]  = useState<string | null>(null)
  const [chatOpen,    setChatOpen]    = useState(false)
  const [preview,     setPreview]     = useState<{ cvLink: string; name: string } | null>(null)

  // ── Server data ───────────────────────────────────────────────────────────
  const { data: cvs = [], isLoading, isError, error } = useCVs()

  if (isError && error instanceof Error) {
    adminError(error.message || "Failed to load CVs.")
  }

  // ── Mutations ─────────────────────────────────────────────────────────────
  const deleteMutation      = useDeleteCV()
  const addWorkerMutation   = useAddWorker()
  const updateStatusMutation = useUpdateCVStatus()

  // ── Derived counts & filtered list ────────────────────────────────────────
  const counts = useMemo(() => ({
    new:         cvs.filter((c) => c.status === "new").length,
    reviewed:    cvs.filter((c) => c.status === "reviewed").length,
    shortlisted: cvs.filter((c) => c.status === "shortlisted").length,
    rejected:    cvs.filter((c) => c.status === "rejected").length,
  }), [cvs])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return [...cvs]
      .filter((c) => {
        const matchRole   = filterRole   === "all" || c.role   === filterRole
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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        adminDestructive("CV has been permanently deleted.")
        setDeleteId(null)
      },
      onError: (err) => {
        adminError(err instanceof Error ? err.message : "Failed to delete CV.")
        setDeleteId(null)
      },
    })
  }

  const handleStatusChange = (id: string, status: CVStatus) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          if (EMAIL_TRIGGER_STATUSES.includes(status)) {
            adminSuccess(
              `Status set to "${status}". An email notification has been sent to the candidate.`
            )
          } else {
            adminInfo(`Status updated to "${status}".`)
          }
        },
        onError: (err) => {
          adminError(err instanceof Error ? err.message : "Failed to update CV status.")
        },
      }
    )
  }

  const handleAddAsWorker = (cv: CV) => {
    addWorkerMutation.mutate(
      { name: cv.fullName, role: cv.role, personalEmail: cv.email },
      {
        onSuccess: (result) => {
          adminSuccess(`${cv.fullName} registered. Work credentials sent to ${result.email}.`)
          setWorkerName(cv.fullName)
          // CV is no longer needed — candidate is now a worker
          deleteMutation.mutate(cv.id)
        },
        onError: (err) => {
          adminError(err instanceof Error ? err.message : "Failed to register worker.")
        },
      },
    )
  }

  const handlePreview = (cvLink: string, name: string) => setPreview({ cvLink, name })

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen px-6 pb-6 space-y-6 bg-[var(--color-snow-white)] fade-in">

      {/* Header — matches WorkersPageHeader style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
        <div>
          <h1 className="text-3xl font-bold pb-1 text-soft-coral">
            CV Management
          </h1>

          {isLoading ? (
            <div className="h-5 w-48 rounded-md animate-pulse bg-gray-100 mt-1" />
          ) : (
            <span
              className="text-base font-semibold mt-0.5 block"
              style={{
                background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {cvs.length} Total CV{cvs.length !== 1 ? "s" : ""} Received
            </span>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <CVStatCards counts={counts} />

      {/* Filters */}
      <CVFiltersBar
        search={search}             onSearch={setSearch}
        filterRole={filterRole}     onFilterRole={setFilterRole}
        filterStatus={filterStatus} onFilterStatus={setFilterStatus}
        sortKey={sortKey}           onSort={setSortKey}
      />

      {/* CV grid */}
      {isLoading ? (
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
            <button
              onClick={() => setFilterStatus("all")}
              className="mt-3 text-xs font-medium underline"
              style={{ color: "var(--color-soft-blue)" }}
            >
              Clear status filter
            </button>
          )}
        </div>
      ) : (
        // FIX: removed items-start so all cards in a row stretch to equal height
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              isUpdatingStatus={updateStatusMutation.isPending}
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

      <AdminToastContainer />
    </div>
  )
}
