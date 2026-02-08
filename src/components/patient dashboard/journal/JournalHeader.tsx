"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePatientJournalStore } from "@/store/patient/journal-store"

export function JournalHeader() {
  const setShowEntryForm = usePatientJournalStore((s) => s.setShowEntryForm)
  const setViewingEntry = usePatientJournalStore((s) => s.setViewingEntry)

  const handleNewEntry = () => {
    setViewingEntry(null)
    setShowEntryForm(true)
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-soft-coral">My Health Journal</h1>
        <p className="text-cool-gray">
          Document your health journey with notes, symptoms, and more
        </p>
      </div>
      <Button
        className="bg-mint-green hover:bg-mint-green/90 text-white"
        onClick={handleNewEntry}
      >
        <Plus className="w-4 h-4 mr-2" />
        New Entry
      </Button>
    </div>
  )
}
