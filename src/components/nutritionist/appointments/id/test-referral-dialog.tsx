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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
        
          className="border-soft-coral w-full bg-soft-coral hover:bg-soft-coral/90 hover:text-white text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Refer Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-soft-blue">Test Referral</DialogTitle>
          <DialogDescription>Refer {patientName} for laboratory tests</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testType">Test Type</Label>
            <Select
              value={formData.testType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, testType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blood-work">Blood Work</SelectItem>
                <SelectItem value="lipid-panel">Lipid Panel</SelectItem>
                <SelectItem value="glucose-test">Glucose Test</SelectItem>
                <SelectItem value="thyroid-function">Thyroid Function</SelectItem>
                <SelectItem value="vitamin-levels">Vitamin Levels</SelectItem>
                <SelectItem value="metabolic-panel">Metabolic Panel</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="labName">Preferred Lab</Label>
            <Input
              id="labName"
              placeholder="Lab name or location"
              value={formData.labName}
              onChange={(e) => setFormData((prev) => ({ ...prev, labName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Test</Label>
            <Textarea
              id="reason"
              placeholder="Clinical indication for the test..."
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Fasting requirements, timing, or other instructions..."
              value={formData.instructions}
              onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-soft-coral hover:bg-soft-coral/90">
              Send Referral
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
