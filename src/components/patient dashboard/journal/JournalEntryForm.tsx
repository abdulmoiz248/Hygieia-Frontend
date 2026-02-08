"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { usePatientJournalStore } from "@/store/patient/journal-store"
import { useCreateJournalEntry, useUpdateJournalEntry } from "@/hooks/patient/usePatientJournal"
import { patientSuccess, patientError } from "@/toasts/PatientToast"
import type { JournalCategory, AlertLevel, JournalEntry } from "@/types/patient/journal"

const CATEGORIES: JournalCategory[] = [
  "medication",
  "symptom",
  "food",
  "mood",
  "exercise",
  "vitals",
  "general",
  "alert",
]

const ALERT_LEVELS: AlertLevel[] = ["low", "medium", "high", "critical"]

interface JournalEntryFormProps {
  patientId: string | undefined
  onSuccess?: () => void
}

export function JournalEntryForm({ patientId, onSuccess }: JournalEntryFormProps) {
  const showEntryForm = usePatientJournalStore((s) => s.showEntryForm)
  const viewingEntry = usePatientJournalStore((s) => s.viewingEntry)
  const setShowEntryForm = usePatientJournalStore((s) => s.setShowEntryForm)
  const setViewingEntry = usePatientJournalStore((s) => s.setViewingEntry)

  const [message, setMessage] = useState("")
  const [categories, setCategories] = useState<JournalCategory[]>([])
  const [alertLevel, setAlertLevel] = useState<AlertLevel>("low")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const createMutation = useCreateJournalEntry()
  const updateMutation = useUpdateJournalEntry()

  const editingEntry = viewingEntry
  const isEditing = !!editingEntry

  const resetForm = useCallback(() => {
    setMessage("")
    setCategories([])
    setAlertLevel("low")
    setTags([])
    setTagInput("")
    setViewingEntry(null)
  }, [setViewingEntry])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
      setShowEntryForm(false)
      setViewingEntry(null)
    }
    setShowEntryForm(open)
  }

  const handleCategoryToggle = (cat: JournalCategory) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const tag = tagInput.trim()
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag])
        setTagInput("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId) {
      patientError("Patient ID is required")
      return
    }
    if (!message.trim()) {
      patientError("Please enter a message")
      return
    }
    if (categories.length === 0) {
      patientError("Please select at least one category")
      return
    }

    if (isEditing && editingEntry) {
      updateMutation.mutate(
        {
          id: editingEntry._id,
          payload: {
            message: message.trim(),
            categories,
            tags,
            alertLevel,
          },
        },
        {
          onSuccess: () => {
            patientSuccess("Entry updated successfully")
            handleOpenChange(false)
            onSuccess?.()
          },
          onError: (err: Error) => {
            patientError(err?.message || "Failed to update entry")
          },
        }
      )
    } else {
      createMutation.mutate(
        {
          patientId,
          message: message.trim(),
          categories,
          tags,
          alertLevel,
          entryDate: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            patientSuccess("Entry created successfully")
            handleOpenChange(false)
            onSuccess?.()
          },
          onError: (err: Error) => {
            patientError(err?.message || "Failed to create entry")
          },
        }
      )
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (showEntryForm && editingEntry) {
      setMessage(editingEntry.message)
      setCategories(editingEntry.categories)
      setAlertLevel(editingEntry.alertLevel)
      setTags(editingEntry.tags || [])
    } else if (showEntryForm && !editingEntry) {
      resetForm()
    }
  }, [showEntryForm, editingEntry])

  return (
    <Dialog open={showEntryForm} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-snow-white max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-soft-blue">
            {isEditing ? "Edit Entry" : "New Journal Entry"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">What&apos;s on your mind?</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I took my morning medication and experienced mild nausea..."
              required
              rows={5}
              className="border-cool-gray focus:ring-mint-green"
            />
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={categories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="rounded border-cool-gray text-mint-green focus:ring-mint-green"
                  />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alert Level</Label>
            <Select
              value={alertLevel}
              onValueChange={(v) => setAlertLevel(v as AlertLevel)}
            >
              <SelectTrigger className="border-cool-gray focus:ring-mint-green">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-snow-white">
                {ALERT_LEVELS.map((level) => (
                  <SelectItem
                    key={level}
                    value={level}
                    className="hover:bg-mint-green hover:text-snow-white"
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags (press Enter to add)</Label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              placeholder="e.g. nausea, morning-meds"
              className="border-cool-gray focus:ring-mint-green"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-soft-blue/10 text-soft-blue text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((t) => t !== tag))
                      }
                      className="hover:text-soft-coral"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-soft-blue text-soft-blue hover:bg-soft-blue/10"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-mint-green hover:bg-mint-green/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Entry"
              ) : (
                "Save Entry"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
