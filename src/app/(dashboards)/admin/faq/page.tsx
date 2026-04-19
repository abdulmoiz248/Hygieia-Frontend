"use client"

import { useMemo, useState } from "react"
import { useAdminStore }       from "@/store/admin/useAdminStore"
import { useFetchFaqs }        from "@/hooks/admin/faq/useFetchFaqs"
import { useCreateFaq }        from "@/hooks/admin/faq/useCreateFaq"
import { useUpdateFaq }        from "@/hooks/admin/faq/useUpdateFaq"
import { useDeleteFaq }        from "@/hooks/admin/faq/useDeleteFaq"
import {
  adminSuccess,
  adminError,
  adminDestructive,
  AdminToastContainer,
}                              from "@/toasts/AdminToasts"
import type { FaqItem }        from "@/types/admin/faq"
import FaqHeader               from "@/components/admin/faq/FaqHeader"
import FaqSearch               from "@/components/admin/faq/FaqSearch"
import FaqList                 from "@/components/admin/faq/FaqList"
import FaqFormModal            from "@/components/admin/faq/FaqFormModal"
import FaqDeleteModal          from "@/components/admin/faq/FaqDeleteModal"

export default function AdminFAQPage() {
  const { adminId } = useAdminStore()

  // ── Server state ───────────────────────────────────────────────────────────
  const { data: faqs = [], isLoading: loading } = useFetchFaqs()
  const createFaqMutation = useCreateFaq()
  const updateFaqMutation = useUpdateFaq()
  const deleteFaqMutation = useDeleteFaq()

  // ── UI state ───────────────────────────────────────────────────────────────
  const [search,          setSearch]          = useState("")
  const [isFormOpen,      setIsFormOpen]      = useState(false)
  const [deleteId,        setDeleteId]        = useState<string | null>(null)
  const [form,            setForm]            = useState<Omit<FaqItem, "id">>({ question: "", answer: "" })
  const [editingId,       setEditingId]       = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredFaqs = useMemo(() =>
    faqs.filter(f =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    ), [faqs, search])

  // ── Handlers ───────────────────────────────────────────────────────────────
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
    if (!form.question || !form.answer || !adminId) return

    if (editingId) {
      try {
        await updateFaqMutation.mutateAsync({ id: editingId, faq: form, userId: adminId })
        adminSuccess("FAQ updated successfully.")
      } catch {
        adminError("Failed to update FAQ. Please try again.")
        return
      }
    } else {
      try {
        await createFaqMutation.mutateAsync({ faq: form, userId: adminId })
        adminSuccess("FAQ created successfully.")
      } catch {
        adminError("Failed to create FAQ. Please try again.")
        return
      }
    }

    setIsFormOpen(false)
    setEditingId(null)
    setSubmitAttempted(false)
    setForm({ question: "", answer: "" })
  }

  const handleDelete = async () => {
    if (!deleteId || !adminId) return
    try {
      await deleteFaqMutation.mutateAsync({ id: deleteId, userId: adminId })
      adminDestructive("FAQ deleted successfully.")
    } catch {
      adminError("Failed to delete FAQ. Please try again.")
    }
    setDeleteId(null)
  }

  return (
    <>
      <div className="min-h-screen px-6 pb-6 space-y-6 bg-[var(--color-snow-white)] fade-in">
        <FaqHeader totalCount={faqs.length} onCreateClick={handleOpenCreate} />

        <FaqSearch value={search} onChange={setSearch} />

        <FaqList
          faqs={filteredFaqs}
          loading={loading}
          onEdit={handleOpenEdit}
          onDeleteRequest={setDeleteId}
        />

        <AdminToastContainer />
      </div>

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
    </>
  )
}
