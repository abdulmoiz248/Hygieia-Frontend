"use client"

import { useEffect, useMemo, useState } from "react"
import { Worker, Role } from "@/types/admin/workers"
import { fetchDoctors, fetchNutritionists } from "@/lib/admin/workers.api"
import WorkersPageHeader  from "@/components/admin/workers/WorkersPageHeader"
import WorkerStatCards    from "@/components/admin/workers/WorkerStatCards"
import WorkersSearchTabs  from "@/components/admin/workers/WorkersSearchTabs"
import WorkersSection     from "@/components/admin/workers/WorkersSection"
import AddWorkerModal     from "@/components/admin/workers/AddWorkerModal"
import DeleteModal        from "@/components/admin/workers/DeleteModal"

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageWorkersPage() {
  // Per-role state
  const [doctors,       setDoctors]       = useState<Worker[]>([])
  const [nutritionists, setNutritionists] = useState<Worker[]>([])
  const [pathologists,  setPathologists]  = useState<Worker[]>([])

  const [loadingDoctors,       setLoadingDoctors]       = useState(true)
  const [loadingNutritionists, setLoadingNutritionists] = useState(true)
  // Pathologists not loading from API, we just show unavailable state
  const [loadingPathologists]  = useState(false)

  // UI state
  const [search,        setSearch]        = useState("")
  const [activeTab,     setActiveTab]     = useState<Role | "all">("all")
  const [showAddModal,  setShowAddModal]  = useState(false)
  const [deleteId,      setDeleteId]      = useState<string | null>(null)

  // ── Fetch on mount ──
  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .catch(console.error)
      .finally(() => setLoadingDoctors(false))

    fetchNutritionists()
      .then(setNutritionists)
      .catch(console.error)
      .finally(() => setLoadingNutritionists(false))
  }, [])

  // ── Derived counts ──
  const counts = useMemo(() => ({
    doctor:       doctors.length,
    nutritionist: nutritionists.length,
    pathologist:  pathologists.length,
  }), [doctors, nutritionists, pathologists])

  const totalCount = counts.doctor + counts.nutritionist + counts.pathologist

  // ── Filter helpers ──
  function filterWorkers(list: Worker[]) {
    if (!search) return list
    const q = search.toLowerCase()
    return list.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.specialization?.toLowerCase().includes(q) ||
        w.personal_email?.toLowerCase().includes(q)
    )
  }

  const filteredDoctors       = useMemo(() => filterWorkers(doctors),       [doctors, search])
  const filteredNutritionists = useMemo(() => filterWorkers(nutritionists), [nutritionists, search])
  const filteredPathologists  = useMemo(() => filterWorkers(pathologists),  [pathologists, search])

  // ── Delete handler ──
  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch("http://localhost:4000/auth/delete-worker", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      })
    } catch { /* optimistic */ }

    setDoctors((p) => p.filter((w) => w._id !== deleteId))
    setNutritionists((p) => p.filter((w) => w._id !== deleteId))
    setPathologists((p) => p.filter((w) => w._id !== deleteId))
    setDeleteId(null)
  }

  const triggerDelete = (id: string) => {
    setShowAddModal(false)
    setDeleteId(id)
  }
  const handleAdd = (worker: Worker) => {
    if (worker.role === "doctor")       setDoctors((p) => [...p, worker])
    if (worker.role === "nutritionist") setNutritionists((p) => [...p, worker])
    if (worker.role === "pathologist")  setPathologists((p) => [...p, worker])
  }

  // ── Determine which sections to show ──
  const showAll          = activeTab === "all"
  const showDoctors      = showAll || activeTab === "doctor"
  const showNutritionists = showAll || activeTab === "nutritionist"
  const showPathologists = showAll || activeTab === "pathologist"

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)] fade-in">

      {/* Header */}
      <WorkersPageHeader
        totalCount={totalCount}
        onAddClick={() => { setDeleteId(null); setShowAddModal(true) }}
      />

      {/* Stat Cards */}
      <WorkerStatCards counts={counts} />

      {/* Search + Tabs */}
      <WorkersSearchTabs
        search={search}
        activeTab={activeTab}
        onSearchChange={setSearch}
        onTabChange={setActiveTab}
      />

      {/* Worker Sections */}
      {showDoctors && (
        <WorkersSection
          role="doctor"
          workers={filteredDoctors}
          loading={loadingDoctors}
          showRoleHeading={showAll}
          onDelete={triggerDelete}
        />
      )}

      {showNutritionists && (
        <WorkersSection
          role="nutritionist"
          workers={filteredNutritionists}
          loading={loadingNutritionists}
          showRoleHeading={showAll}
          onDelete={triggerDelete}
        />
      )}

      {showPathologists && (
        <WorkersSection
          role="pathologist"
          workers={filteredPathologists}
          loading={loadingPathologists}
          unavailable={true}
          showRoleHeading={showAll}
          onDelete={triggerDelete}
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddWorkerModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
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
