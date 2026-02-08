"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Calendar,
  Flag,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useJournalEntries, useDeleteJournalEntry, useFlagJournalEntry } from "@/hooks/patient/usePatientJournal"
import { usePatientJournalStore } from "@/store/patient/journal-store"
import { JournalEntryForm } from "./JournalEntryForm"
import { patientSuccess, patientDestructive } from "@/toasts/PatientToast"
import { formatDateOnly } from "@/helpers/date"
import type { JournalEntry } from "@/types/patient/journal"

interface JournalListProps {
  patientId: string | undefined
}

function getAlertColor(level: string): string {
  switch (level) {
    case "low":
      return "bg-soft-blue text-snow-white"
    case "medium":
      return "bg-mint-green text-snow-white"
    case "high":
      return "bg-soft-coral text-snow-white"
    case "critical":
      return "bg-red-600 text-snow-white"
    default:
      return "bg-cool-gray text-snow-white"
  }
}

export function JournalList({ patientId }: JournalListProps) {
  const selectedCategory = usePatientJournalStore((s) => s.selectedCategory)
  const page = usePatientJournalStore((s) => s.page)
  const setPage = usePatientJournalStore((s) => s.setPage)
  const setViewingEntry = usePatientJournalStore((s) => s.setViewingEntry)
  const setShowEntryForm = usePatientJournalStore((s) => s.setShowEntryForm)

  const [deleteConfirm, setDeleteConfirm] = useState<JournalEntry | null>(null)

  const { data, isLoading, error } = useJournalEntries(patientId, {
    page,
    limit: 20,
    category: selectedCategory as "medication" | "symptom" | "food" | "mood" | "exercise" | null,
  })

  const deleteMutation = useDeleteJournalEntry()
  const flagMutation = useFlagJournalEntry()

  const entries = data?.entries ?? []
  const totalPages = data?.pages ?? 1

  const handleEdit = (entry: JournalEntry) => {
    setViewingEntry(entry)
    setShowEntryForm(true)
  }

  const handleDelete = (entry: JournalEntry) => {
    deleteMutation.mutate(entry._id, {
      onSuccess: () => {
        patientDestructive("Entry deleted successfully")
        setDeleteConfirm(null)
      },
      onError: () => {
        patientDestructive("Failed to delete entry")
      },
    })
  }

  const handleFlag = (entry: JournalEntry) => {
    if (entry.flaggedForDoctor) return
    flagMutation.mutate(entry._id, {
      onSuccess: () => {
        patientSuccess("Entry flagged for doctor review")
      },
      onError: () => {
        patientDestructive("Failed to flag entry")
      },
    })
  }

  if (isLoading) {
    return (
      <Card className="bg-white/40 border border-gray-100 rounded-xl shadow-sm">
        <CardContent className="p-12 text-center">
          <p className="text-cool-gray">Loading entries...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/40 border border-gray-100 rounded-xl shadow-sm">
        <CardContent className="p-12 text-center">
          <p className="text-soft-coral">Failed to load entries</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-white/40 border border-gray-100 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-soft-blue">
            <Calendar className="w-5 h-5" />
            Journal Entries ({data?.total ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-14 h-14 text-soft-coral mx-auto mb-4" />
              <p className="text-cool-gray">No entries found</p>
              <p className="text-sm text-cool-gray mt-1">
                Add your first journal entry to get started
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-cool-gray/10 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-sm font-medium text-soft-blue">
                            {formatDateOnly(entry.entryDate)}
                          </span>
                          <Badge
                            className={`text-xs ${getAlertColor(
                              entry.alertLevel
                            )}`}
                          >
                            {entry.alertLevel}
                          </Badge>
                        </div>
                        <p className="text-dark-slate-gray text-sm leading-relaxed">
                          {entry.message}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {entry.categories?.map((cat) => (
                            <Badge
                              key={cat}
                              variant="secondary"
                              className="text-xs bg-soft-blue/10 text-soft-blue"
                            >
                              {cat}
                            </Badge>
                          ))}
                          {entry.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {entry.flaggedForDoctor && entry.doctorComment && (
                          <div className="mt-3 p-3 bg-mint-green/10 rounded-lg border border-mint-green/30">
                            <p className="text-xs font-semibold text-mint-green mb-1">
                              Doctor&apos;s Note
                            </p>
                            <p className="text-sm text-dark-slate-gray">
                              {entry.doctorComment}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                      
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-soft-blue hover:bg-soft-blue/10"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-soft-coral hover:bg-soft-coral/10"
                          onClick={() => setDeleteConfirm(entry)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="border-soft-blue text-soft-blue hover:bg-soft-blue/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-cool-gray">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="border-soft-blue text-soft-blue hover:bg-soft-blue/10"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <JournalEntryForm patientId={patientId} />

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="bg-snow-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-soft-blue">
              Delete Journal Entry?
            </DialogTitle>
          </DialogHeader>
          <p className="text-cool-gray text-sm">
            Are you sure you want to delete this entry? This cannot be undone.
          </p>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              className="border-soft-blue text-soft-blue hover:bg-soft-blue/10"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-soft-coral hover:bg-soft-coral/90 text-white"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
