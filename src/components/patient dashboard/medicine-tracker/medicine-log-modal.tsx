
import {  Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface MedicinelogmodalProps{
showLogDose:boolean
setShowLogDose: (val:boolean)=>void
}

export default function MedicineLogModal({showLogDose,setShowLogDose}:MedicinelogmodalProps) {
 const [selectedMedicine, setSelectedMedicine] = useState("")
  const [doseTaken, setDoseTaken] = useState("")
    return (
      <Dialog open={showLogDose} onOpenChange={setShowLogDose}>
          <DialogTrigger asChild>
            <Button className="bg-mint-green hover:bg-mint-green/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Log Dose
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-snow-white">
            <DialogHeader>
              <DialogTitle>Log Today&apos;s Dose</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Medicine Name</label>
                <Input
                  placeholder="Search medicine..."
                  value={selectedMedicine}
                  onChange={(e) => setSelectedMedicine(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Dosage Taken</label>
                <Input
                  placeholder="e.g., 10mg, 1 tablet"
                  value={doseTaken}
                  onChange={(e) => setDoseTaken(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time Taken</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-snow-white">
                    <SelectItem value="morning" className="hover:bg-mint-green hover:text-snow-white">Morning (8:00 AM)</SelectItem>
                    <SelectItem value="afternoon" className="hover:bg-mint-green hover:text-snow-white">Afternoon (12:00 PM)</SelectItem>
                    <SelectItem value="evening" className="hover:bg-mint-green hover:text-snow-white">Evening (6:00 PM)</SelectItem>
                    <SelectItem value="night" className="hover:bg-mint-green hover:text-snow-white">Night (10:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-mint-green text-white hover:bg-mint-green/90">Log Dose</Button>
            </div>
          </DialogContent>
        </Dialog>
  )
}
