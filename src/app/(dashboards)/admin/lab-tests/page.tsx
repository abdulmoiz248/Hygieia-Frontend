"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  TestTube,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Clock,
  FlaskConical,
  ScanLine,
  Banknote,
  BarChart3,
  ClipboardList,
  Eye,
} from "lucide-react"
import {
  useLabTests,
  useCreateLabTest,
  useUpdateLabTest,
  useDeleteLabTest,
} from "@/hooks/admin/labTests/useLabTests"
import { adminSuccess, adminError, adminDestructive, AdminToastContainer } from "@/toasts/AdminToasts"
import LabTestFormModal   from "@/components/admin/labTests/LabTestFormModal"
import LabTestDeleteModal from "@/components/admin/labTests/LabTestDeleteModal"
import { Card, CardContent } from "@/components/ui/card"
import CountUp from "@/blocks/TextAnimations/CountUp/CountUp"
import type { LabTest, LabTestFormData } from "@/types/admin/labTests"

// ─── Category colour map ──────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Hematology:    { color: "var(--color-soft-coral)",  bg: "oklch(0.96 0.06 10)"  },
  Biochemistry:  { color: "var(--color-soft-blue)",   bg: "oklch(0.95 0.05 210)" },
  Microbiology:  { color: "var(--color-mint-green)",  bg: "oklch(0.95 0.04 178)" },
  Immunology:    { color: "#8b5cf6",                  bg: "#f5f3ff"              },
  Endocrinology: { color: "#f59e0b",                  bg: "#fffbeb"              },
  Cardiology:    { color: "var(--color-soft-coral)",  bg: "oklch(0.96 0.06 10)"  },
  Urology:       { color: "var(--color-soft-blue)",   bg: "oklch(0.95 0.05 210)" },
  Serology:      { color: "var(--color-mint-green)",  bg: "oklch(0.95 0.04 178)" },
  Pathology:     { color: "#6366f1",                  bg: "#eef2ff"              },
  Radiology:     { color: "#0891b2",                  bg: "#ecfeff"              },
  Genetics:      { color: "#7c3aed",                  bg: "#f5f3ff"              },
  Toxicology:    { color: "#b45309",                  bg: "#fef3c7"              },
}

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { color: "var(--color-cool-gray)", bg: "oklch(0.96 0.01 0)" }
}

function normalizeRecordType(value?: string) {
  return value === "scan" ? "scan" : "report"
}

function getRecordTypeLabel(value?: string) {
  return normalizeRecordType(value) === "scan" ? "Scan" : "Report"
}

// ─── Stat Cards (BlogStatCards style) ────────────────────────────────────────

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
}

function StatCards({ tests }: { tests: LabTest[] }) {
  const total    = tests.length
  const reportCount = tests.filter((t) => normalizeRecordType(t.record_type) === "report").length
  const scanCount = tests.filter((t) => normalizeRecordType(t.record_type) === "scan").length

  const cards = [
    { id: "total", title: "Total Tests",  value: total,     icon: BarChart3,    color: "var(--color-soft-blue)",  colorClass: "soft-blue"  },
    {id: "report",   title: "Report Tests",    value: reportCount,  icon: FlaskConical, color: "var(--color-soft-coral)", colorClass: "soft-coral" },
    { id: "scan",  title: "Scan Tests",   value: scanCount, icon: ScanLine,     color: "var(--color-mint-green)", colorClass: "mint-green" },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div key={card.id} variants={itemVariants} className="h-full">
            <Card className={`h-full bg-gradient-to-br from-${card.colorClass}/10 to-${card.colorClass}/5 border-${card.colorClass}/20`}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-cool-gray)]">{card.title}</p>
                  <p className={`text-2xl font-bold text-${card.colorClass}`}>
                    <CountUp
                      from={0}
                      to={card.value}
                      separator=","
                      direction="up"
                      duration={1}
                      className={`text-${card.colorClass}`}
                    />
                  </p>
                </div>
                <Icon className={`w-8 h-8 text-${card.colorClass}`} />
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── Filters (BlogFilters style) ─────────────────────────────────────────────

type RecordTab = "all" | "report" | "scan"

const RECORD_TABS: { key: RecordTab; label: string }[] = [
  { key: "all",    label: "All"    },
  { key: "report", label: "Report" },
  { key: "scan",   label: "Scan"   },
]

interface FiltersProps {
  tests:       LabTest[]
  typeTab:     RecordTab
  onTypeTab:   (t: RecordTab) => void
  search:      string
  onSearch:    (v: string) => void
  catFilter:   string
  onCatFilter: (c: string) => void
}

function Filters({ tests, typeTab, onTypeTab, search, onSearch, catFilter, onCatFilter }: FiltersProps) {
  const tabCounts: Record<RecordTab, number> = {
    all:  tests.length,
    report: tests.filter((t) => normalizeRecordType(t.record_type) === "report").length,
    scan: tests.filter((t) => normalizeRecordType(t.record_type) === "scan").length,
  }

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(tests.map((t) => t.category))).sort()],
    [tests]
  )

  return (
    <div className="space-y-3">
      {/* Row 1: Search (left) + Tab switcher (right) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">

        {/* Search */}
        <div className="relative group/search">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)] transition-colors group-focus-within/search:text-[var(--color-soft-blue)]" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tests…"
            className="pl-9 pr-9 py-2 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] focus:border-[var(--color-soft-blue)] outline-none bg-white shadow-sm text-sm w-52 transition-all duration-200 hover:border-[var(--color-soft-blue)]/50 placeholder:text-[var(--color-cool-gray)]/60"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5 text-[var(--color-cool-gray)]" />
            </button>
          )}
        </div>

        {/* Record type tabs */}
        <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-2xl p-1 shadow-sm">
          {RECORD_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTypeTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95"
              style={typeTab === tab.key
                ? { background: "var(--gradient-primary)", color: "white" }
                : { color: "var(--color-cool-gray)" }}
              onMouseEnter={(e) => {
                if (typeTab !== tab.key) {
                  (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.96 0.02 210)"
                  ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-dark-slate-gray)"
                }
              }}
              onMouseLeave={(e) => {
                if (typeTab !== tab.key) {
                  (e.currentTarget as HTMLButtonElement).style.background = ""
                  ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-cool-gray)"
                }
              }}
            >
              {tab.label}
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none transition-all"
                style={typeTab === tab.key
                  ? { background: "rgba(255,255,255,0.25)", color: "white" }
                  : { background: "oklch(0.93 0.02 180)", color: "var(--color-cool-gray)" }}
              >
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Category pills */}
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm gap-1">
          {categories.map((cat) => {
            const isActive = catFilter === cat
            const { color, bg } = cat !== "all" ? getCategoryStyle(cat) : { color: "", bg: "" }
            return (
              <button
                key={cat}
                onClick={() => onCatFilter(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={
                  isActive
                    ? cat === "all"
                      ? { background: "var(--gradient-primary)", color: "white" }
                      : { background: bg, color, border: `1px solid ${color}30` }
                    : { color: "var(--color-cool-gray)" }
                }
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Lab Test Card (CVCard style) ─────────────────────────────────────────────

interface LabTestCardProps {
  test: LabTest
  onView: (t: LabTest) => void
  onEdit: (t: LabTest) => void
  onDelete: (t: LabTest) => void
}

function LabTestCard({ test, onView, onEdit, onDelete }: LabTestCardProps) {
  const { color, bg } = getCategoryStyle(test.category)
  const recordType = normalizeRecordType(test.record_type)
  const isScan = recordType === "scan"

  return (
    <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">

      {/* Color stripe */}
      <div
        className="h-1.5 w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${color}, oklch(0.72 0.11 178))` }}
      />

      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* ── Header: icon + name + record-type badge ── */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: bg }}
          >
            {isScan
              ? <ScanLine className="w-4.5 h-4.5" style={{ color }} />
              : <FlaskConical className="w-4.5 h-4.5" style={{ color }} />
            }
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-dark-slate-gray)] text-sm leading-snug line-clamp-2">
              {test.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-medium" style={{ color }}>{test.category}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold capitalize"
                style={{ color, background: bg }}
              >
                {getRecordTypeLabel(recordType)}
              </span>
            </div>
          </div>

          {/* Actions always visible, top-right */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              title="Edit"
              onClick={() => onEdit(test)}
              className="p-1.5 rounded-lg transition-all duration-200 text-[var(--color-soft-blue)] hover:bg-[oklch(0.95_0.05_210)] hover:scale-110 active:scale-95"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              title="Delete"
              onClick={() => onDelete(test)}
              className="p-1.5 rounded-lg transition-all duration-200 text-[var(--color-soft-coral)] hover:bg-[oklch(0.96_0.06_10)] hover:scale-110 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Description ── */}
        {/* ── Key info: price + duration side by side ── */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-mint-green/10 border border-mint-green/15">
            <Banknote className="w-3.5 h-3.5 text-[var(--color-mint-green)] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-[var(--color-cool-gray)] leading-none mb-0.5">Price</p>
              <p className="text-xs font-bold text-[var(--color-dark-slate-gray)] truncate">Rs. {test.price.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-soft-blue/10 border border-soft-blue/15">
            <Clock className="w-3.5 h-3.5 text-[var(--color-soft-blue)] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-[var(--color-cool-gray)] leading-none mb-0.5">Duration</p>
              <p className="text-xs font-bold text-[var(--color-dark-slate-gray)] truncate">{test.duration}</p>
            </div>
          </div>
        </div>

        {/* ── Unit + Range (only if present) ── */}
        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Prep instructions expandable ── */}
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => onView(test)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{ color }}
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function LabTestDetailsModal({
  test,
  onClose,
}: {
  test: LabTest | null
  onClose: () => void
}) {
  if (!test) return null

  const { color, bg } = getCategoryStyle(test.category)
  const recordType = normalizeRecordType(test.record_type)
  const prepInstructions = test.preparation_instructions?.filter((item) => item?.trim()) ?? []

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        <div className="h-1 w-full flex-shrink-0" style={{ background: "var(--gradient-primary)" }} />

        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "oklch(0.95 0.05 210)" }}
              >
                {recordType === "scan" ? (
                  <ScanLine className="h-4.5 w-4.5 text-[var(--color-soft-blue)]" />
                ) : (
                  <FlaskConical className="h-4.5 w-4.5 text-[var(--color-soft-blue)]" />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">{test.name}</h2>
              <p className="mt-0.5 text-xs text-[var(--color-cool-gray)]">
                {test.category} · {getRecordTypeLabel(recordType)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-gray-100">
            <X className="h-4 w-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-1.5 block text-xs font-semibold text-[var(--color-cool-gray)]">Price</p>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-[var(--color-dark-slate-gray)]">
                Rs. {test.price.toLocaleString()}
              </div>
            </div>
            <div>
              <p className="mb-1.5 block text-xs font-semibold text-[var(--color-cool-gray)]">Duration</p>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-[var(--color-dark-slate-gray)]">
                {test.duration}
              </div>
            </div>
            <div>
              <p className="mb-1.5 block text-xs font-semibold text-[var(--color-cool-gray)]">Record Type</p>
              <div
                className="rounded-xl border px-3.5 py-2.5 text-sm font-semibold capitalize"
                style={{ background: bg, borderColor: `${color}30`, color }}
              >
                {getRecordTypeLabel(recordType)}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-1.5 block text-xs font-semibold text-[var(--color-cool-gray)]">Description</p>
            <div className="min-h-24 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm leading-relaxed text-[var(--color-cool-gray)]">
              {test.description || "No description provided."}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 block text-xs font-semibold text-[var(--color-cool-gray)]">Unit</p>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-[var(--color-dark-slate-gray)]">
                {test.unit || "-"}
              </div>
            </div>
            <div>
              <p className="mb-1.5 block text-xs font-semibold text-[var(--color-cool-gray)]">Optimal Range</p>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-[var(--color-dark-slate-gray)]">
                {test.optimal_range || "-"}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-[var(--color-cool-gray)]">
              <ClipboardList className="h-3.5 w-3.5 text-[var(--color-soft-blue)]" />
              Preparation Instructions
            </p>
            {prepInstructions.length > 0 ? (
              <ul className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                {prepInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-cool-gray)]">
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: bg, color }}
                    >
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-[var(--color-cool-gray)]">
                No preparation instructions provided.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LabTestsPage() {
  const { data: tests = [], isLoading, isError, error } = useLabTests()

  const createMutation = useCreateLabTest()
  const updateMutation = useUpdateLabTest()
  const deleteMutation = useDeleteLabTest()

  // ── UI state
  const [search,       setSearch]       = useState("")
  const [typeTab,      setTypeTab]      = useState<RecordTab>("all")
  const [catFilter,    setCatFilter]    = useState("all")
  const [formOpen,     setFormOpen]     = useState(false)
  const [viewTarget,   setViewTarget]   = useState<LabTest | null>(null)
  const [editTarget,   setEditTarget]   = useState<LabTest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LabTest | null>(null)

  // ── Derived
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tests.filter((t) => {
      const matchType   = typeTab === "all" || normalizeRecordType(t.record_type) === typeTab
      const matchCat    = catFilter === "all" || t.category === catFilter
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      return matchType && matchCat && matchSearch
    })
  }, [tests, search, typeTab, catFilter])

  // ── Handlers
  const handleCreate = async (data: LabTestFormData) => {
    try {
      await createMutation.mutateAsync(data)
      adminSuccess("Lab test created successfully.")
      setFormOpen(false)
    } catch (e) {
      adminError(e instanceof Error ? e.message : "Failed to create lab test.")
    }
  }

  const handleUpdate = async (data: LabTestFormData) => {
    if (!editTarget) return
    try {
      await updateMutation.mutateAsync({ id: editTarget.id, data })
      adminSuccess("Lab test updated successfully.")
      setFormOpen(false)
      setEditTarget(null)
    } catch (e) {
      adminError(e instanceof Error ? e.message : "Failed to update lab test.")
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      adminDestructive("Lab test deleted.")
      setDeleteTarget(null)
    } catch (e) {
      adminError(e instanceof Error ? e.message : "Failed to delete lab test.")
    }
  }

  return (
    <>
      <div className="min-h-screen px-6 pb-6 space-y-6 bg-[var(--color-snow-white)] fade-in">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
          <div>
            <h1 className="text-3xl font-bold pb-1 text-soft-coral flex items-center gap-2.5">
              Lab Tests
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
                {tests.length} Test{tests.length !== 1 ? "s" : ""} Available
              </span>
            )}
          </div>

          <button
            onClick={() => { setEditTarget(null); setFormOpen(true) }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 self-start sm:self-auto"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus className="w-4 h-4" />
            Add Lab Test
          </button>
        </div>

        {/* ── Stat Cards ── */}
        {!isLoading && <StatCards tests={tests} />}

        {/* ── Filters ── */}
        <Filters
          tests={tests}
          typeTab={typeTab}
          onTypeTab={setTypeTab}
          search={search}
          onSearch={setSearch}
          catFilter={catFilter}
          onCatFilter={setCatFilter}
        />

        {/* ── Error ── */}
        {isError && (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-10 text-center">
            <TestTube className="w-9 h-9 mx-auto mb-3 text-red-300" />
            <p className="text-sm font-semibold text-red-600">
              {error instanceof Error ? error.message : "Failed to load lab tests."}
            </p>
          </div>
        )}

        {/* ── Loading Skeletons ── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 shadow-sm h-52 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-cool-gray)]/30 p-14 text-center">
            <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-20 text-[var(--color-cool-gray)]" />
            <p className="text-sm text-[var(--color-cool-gray)]">
              {search || catFilter !== "all" || typeTab !== "all"
                ? "No lab tests match your filters"
                : "No lab tests yet"}
            </p>
            {(search || catFilter !== "all" || typeTab !== "all") && (
              <button
                onClick={() => { setSearch(""); setCatFilter("all"); setTypeTab("all") }}
                className="mt-3 text-xs font-medium underline"
                style={{ color: "var(--color-soft-blue)" }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Grid ── */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((test) => (
              <LabTestCard
                key={test.id}
                test={test}
                onView={setViewTarget}
                onEdit={(t) => { setEditTarget(t); setFormOpen(true) }}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}

        <AdminToastContainer />
      </div>

      {/* ── Modals ── */}
      <LabTestDetailsModal
        test={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      {formOpen && (
        <LabTestFormModal
          initial={editTarget ?? undefined}
          onSubmit={editTarget ? handleUpdate : handleCreate}
          onClose={() => { setFormOpen(false); setEditTarget(null) }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {deleteTarget && (
        <LabTestDeleteModal
          testName={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </>
  )
}
