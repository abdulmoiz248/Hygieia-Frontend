"use client"

import { useMemo, useState } from "react"
import { Worker, Role } from "@/types/admin/workers"
import { useDoctors } from "@/hooks/admin/workers/useDoctors"
import { useNutritionists } from "@/hooks/admin/workers/useNutritionists"
import { usePathologists } from "@/hooks/admin/workers/usePathologists"
import WorkersPageHeader from "@/components/admin/workers/WorkersPageHeader"
import WorkerStatCards   from "@/components/admin/workers/WorkerStatCards"
import WorkersSearchTabs from "@/components/admin/workers/WorkersSearchTabs"
import WorkersSection    from "@/components/admin/workers/WorkersSection"
import AddWorkerModal    from "@/components/admin/workers/AddWorkerModal"
import DeleteModal       from "@/components/admin/workers/DeleteModal"
import { AdminToastContainer } from "@/toasts/AdminToasts"

interface DeleteTarget {
  workerId: string
  email: string
  role: Role
}

function filterWorkers(list: Worker[], search: string): Worker[] {
  if (!search.trim()) return list
  const q = search.toLowerCase()
  return list.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.specialization?.toLowerCase().includes(q) ||
      w.personal_email?.toLowerCase().includes(q)
  )
}

export default function ManageWorkersPage() {
  const { data: doctors       = [], isLoading: loadingDoctors       } = useDoctors()
  const { data: nutritionists = [], isLoading: loadingNutritionists } = useNutritionists()
  const { data: pathologists  = [], isLoading: loadingPathologists  } = usePathologists()

  const [search,       setSearch]       = useState("")
  const [activeTab,    setActiveTab]    = useState<Role | "all">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  const counts = useMemo(() => ({
    doctor:       doctors.length,
    nutritionist: nutritionists.length,
    pathologist:  pathologists.length,
  }), [doctors, nutritionists, pathologists])

  const totalCount = counts.doctor + counts.nutritionist + counts.pathologist

  const filteredDoctors       = useMemo(() => filterWorkers(doctors,       search), [doctors,       search])
  const filteredNutritionists = useMemo(() => filterWorkers(nutritionists, search), [nutritionists, search])
  const filteredPathologists  = useMemo(() => filterWorkers(pathologists,  search), [pathologists,  search])

  const showAll           = activeTab === "all"
  const showDoctors       = showAll || activeTab === "doctor"
  const showNutritionists = showAll || activeTab === "nutritionist"
  const showPathologists  = showAll || activeTab === "pathologist"

  return (
    <div className="min-h-screen px-6 pt-2 pb-6 space-y-6 bg-[var(--color-snow-white)] fade-in">

      <WorkersPageHeader
        totalCount={totalCount}
        onAddClick={() => { setDeleteTarget(null); setShowAddModal(true) }}
      />

      <WorkerStatCards counts={counts} />

      <WorkersSearchTabs
        search={search}
        activeTab={activeTab}
        onSearchChange={setSearch}
        onTabChange={setActiveTab}
      />

      {showDoctors && (
        <WorkersSection
          role="doctor"
          workers={filteredDoctors}
          loading={loadingDoctors}
          showRoleHeading={showAll}
          onDelete={(target) => { setShowAddModal(false); setDeleteTarget(target) }}
        />
      )}

      {showNutritionists && (
        <WorkersSection
          role="nutritionist"
          workers={filteredNutritionists}
          loading={loadingNutritionists}
          showRoleHeading={showAll}
          onDelete={(target) => { setShowAddModal(false); setDeleteTarget(target) }}
        />
      )}

      {showPathologists && (
        <WorkersSection
          role="pathologist"
          workers={filteredPathologists}
          loading={loadingPathologists}
          showRoleHeading={showAll}
          onDelete={(target) => { setShowAddModal(false); setDeleteTarget(target) }}
        />
      )}

      {showAddModal && (
        <AddWorkerModal onClose={() => setShowAddModal(false)} />
      )}

      {deleteTarget && (
        <DeleteModal
          workerEmail={deleteTarget.email}
          workerId={deleteTarget.workerId}
          workerRole={deleteTarget.role}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <AdminToastContainer />
    </div>
  )
}
