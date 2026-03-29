"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchFaqs, createFaq, updateFaq, deleteFaq } from "@/lib/admin/faq.api"
import type { FaqItem } from "@/types/admin/faq"
import FaqHeader from "@/components/admin/faq/FaqHeader"
import FaqSearch from "@/components/admin/faq/FaqSearch"
import FaqList from "@/components/admin/faq/FaqList"
import FaqFormModal from "@/components/admin/faq/FaqFormModal"
import FaqDeleteModal from "@/components/admin/faq/FaqDeleteModal"

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState<Omit<FaqItem, "id">>({ question: "", answer: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const loadFaqs = async () => {
    setLoading(true)
    try {
      setFaqs(await fetchFaqs())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadFaqs() }, [])

  const filteredFaqs = useMemo(() =>
    faqs.filter(f =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    ), [faqs, search])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setForm({ question: "", answer: "" })
    setEditingId(null)
    setSubmitAttempted(false)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (faq: FaqItem) => {
    setForm({ question: faq.question, answer: faq.answer })
    setEditingId(faq.id!)
    setSubmitAttempted(false)
    setIsFormOpen(true)
  }

  const handleSubmit = async () => {
    setSubmitAttempted(true)
    if (!form.question || !form.answer) return

    if (editingId) {
      await updateFaq(editingId, form)
    } else {
      await createFaq(form)
    }

    setIsFormOpen(false)
    setEditingId(null)
    setSubmitAttempted(false)
    setForm({ question: "", answer: "" })
    loadFaqs()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteFaq(deleteId)
    setDeleteId(null)
    loadFaqs()
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)] fade-in">
      <FaqHeader totalCount={faqs.length} onCreateClick={handleOpenCreate} />

      <FaqSearch value={search} onChange={setSearch} />

      <FaqList
        faqs={filteredFaqs}
        loading={loading}
        onEdit={handleOpenEdit}
        onDeleteRequest={setDeleteId}
      />

      {isFormOpen && (
        <FaqFormModal
          form={form}
          isEditing={!!editingId}
          submitAttempted={submitAttempted}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {deleteId && (
        <FaqDeleteModal
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
