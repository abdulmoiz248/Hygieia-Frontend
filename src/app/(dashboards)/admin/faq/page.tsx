"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Pencil, Trash2, X, ChevronDown } from "lucide-react"

interface FaqItem {
  id?: string
  question: string
  answer: string
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)

  const [form, setForm] = useState<FaqItem>({ question: "", answer: "" })
  const [editingId, setEditingId] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const API = "http://localhost:4000/faqs"

  // FETCH FAQs
  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const res = await fetch(API)
      const data = await res.json()
      setFaqs(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  // FILTER FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    )
  }, [faqs, search])

  // CREATE / UPDATE
  const handleSubmit = async () => {
    if (!form.question || !form.answer) return

    if (editingId) {
      await fetch(`${API}/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }

    setForm({ question: "", answer: "" })
    setEditingId(null)
    setIsModalOpen(false)
    fetchFaqs()
  }

  // EDIT
  const handleEdit = (faq: FaqItem) => {
    setForm(faq)
    setEditingId(faq.id!)
    setIsModalOpen(true)
  }

  // DELETE
  const handleDelete = async () => {
    if (!deleteId) return

    await fetch(`${API}/${deleteId}`, {
      method: "DELETE",
    })

    setDeleteId(null)
    fetchFaqs()
  }

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)]">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-soft-blue)] via-[var(--color-mint-green)] to-[var(--color-soft-coral)] bg-clip-text pb-1 text-transparent">
          FAQ Management
        </h1>

        <button
          onClick={() => {
            setForm({ question: "", answer: "" })
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-md hover:scale-[1.02] transition"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="w-4 h-4" />
          Create FAQ
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--color-cool-gray)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search FAQs..."
          className="w-full pl-10 pr-3 py-2 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none bg-white shadow-sm"
        />
      </div>

      {/* ACCORDION LIST */}
      <div className="grid gap-4">
        {loading && (
          <p className="text-[var(--color-cool-gray)]">Loading...</p>
        )}

        {!loading &&
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-[var(--color-cool-gray)]/20 bg-white shadow-sm overflow-hidden"
              >
                {/* QUESTION ROW */}
                <div
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setOpenId(isOpen ? null : faq.id!)}
                >
                  <h3 className="font-semibold text-[var(--color-dark-slate-gray)]">
                    {faq.question}
                  </h3>

                  <div className="flex items-center gap-2">

                    {/* EDIT */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(faq)
                      }}
                      className="p-2 rounded-lg hover:bg-[var(--color-soft-blue)]/10"
                    >
                      <Pencil className="w-4 h-4 text-[var(--color-soft-blue)]" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(faq.id!)
                      }}
                      className="p-2 rounded-lg hover:bg-[var(--color-soft-coral)]/10"
                    >
                      <Trash2 className="w-4 h-4 text-[var(--color-soft-coral)]" />
                    </button>

                    {/* DROPDOWN ICON */}
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--color-cool-gray)] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* ANSWER */}
                {isOpen && (
                  <div className="px-4 pb-4 text-[var(--color-cool-gray)] border-t">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white w-full max-w-lg p-6 rounded-2xl space-y-4 shadow-xl">

            {/* CLOSE */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold text-[var(--color-dark-slate-gray)]">
              {editingId ? "Update FAQ" : "Create FAQ"}
            </h2>

            <input
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none"
              placeholder="Question"
              value={form.question}
              onChange={(e) =>
                setForm({ ...form, question: e.target.value })
              }
            />

            <textarea
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[var(--color-mint-green)] outline-none"
              placeholder="Answer"
              rows={4}
              value={form.answer}
              onChange={(e) =>
                setForm({ ...form, answer: e.target.value })
              }
            />

            <button
              onClick={handleSubmit}
              className="w-full py-2 rounded-xl text-white shadow-md"
              style={{ background: "var(--gradient-primary)" }}
            >
              {editingId ? "Update FAQ" : "Create FAQ"}
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl space-y-4">

            {/* CLOSE */}
            <button
              onClick={() => setDeleteId(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X />
            </button>

            {/* ICON */}
            <div className="w-12 h-12 rounded-full bg-[var(--color-soft-coral)]/10 flex items-center justify-center">
              <Trash2 className="text-[var(--color-soft-coral)]" />
            </div>

            <h2 className="text-lg font-semibold text-[var(--color-dark-slate-gray)]">
              Delete FAQ?
            </h2>

            <p className="text-sm text-[var(--color-cool-gray)]">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-white"
                style={{ background: "var(--color-soft-coral)" }}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}