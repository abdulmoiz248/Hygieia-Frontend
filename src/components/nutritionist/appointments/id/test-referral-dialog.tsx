"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"

interface TestReferralDialogProps {
  patientName: string
  onRefer: (referral: any) => void
}

export function TestReferralDialog({ patientName, onRefer }: TestReferralDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    testType: "",
    labName: "",
    priority: "",
    instructions: "",
    reason: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const referral = {
      ...formData,
      patientName,
      date: new Date().toISOString(),
    }
    onRefer(referral)
    setOpen(false)
    setFormData({
      testType: "",
      labName: "",
      priority: "",
      instructions: "",
      reason: "",
    })
  }

  return (
       <Button
        
          className="border-soft-coral w-full bg-soft-coral hover:bg-soft-coral/90 hover:text-white text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Refer Test
        </Button>
  )
}
