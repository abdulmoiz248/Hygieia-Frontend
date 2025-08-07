"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Clock, MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { bookLabTest, setShowBookingModal, setSelectedTest } from "@/types/patient/labTestsSlice"
import type { LabTest } from "@/types/patient/labTestsSlice"
import { CalendarComponent } from "@/components/ui/calendar"
import TimeSelect from "./TimeSelect"

interface LabTestBookingModalProps {
  test: LabTest
}

export function LabTestBookingModal({ test }: LabTestBookingModalProps) {
  const dispatch = useAppDispatch()
  const { showBookingModal } = useAppSelector((state) => state.labTests)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now() + 86400 * 1000))
  const [selectedTime, setSelectedTime] = useState("")
  const [location, setLocation] = useState("Main Lab - Floor 2")
  const [notes, setNotes] = useState("")

  const handleBookTest = () => {
    if (!selectedDate || !selectedTime) return

    dispatch(
      bookLabTest({
        testId: test.id,
        testName: test.name,
        scheduledDate:new Date( selectedDate),
        scheduledTime: selectedTime,
        status: "pending",
        location,
        instructions: test.preparationInstructions,
      }),
    )

    dispatch(setShowBookingModal(false))
    dispatch(setSelectedTest(null))
    setSelectedDate(new Date(Date.now() + 86400 * 1000))
    setSelectedTime("")
    setNotes("")
  }

  const handleClose = () => {
    dispatch(setShowBookingModal(false))
    dispatch(setSelectedTest(null))
  }

  if (!showBookingModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-snow-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-soft-blue">Book Lab Test</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Test Details */}
            <div className="bg-cool-gray/10 rounded-lg p-4">
              <h3 className="font-semibold text-soft-coral text-lg mb-2">{test.name}</h3>
              <p className="text-dark-slate-gray mb-3">{test.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-soft-coral" />
                  {test.duration}
                </span>
                <span className="font-semibold text-cool-gray">${test.price}</span>
              </div>
            </div>

            {/* Preparation Instructions */}
            {test.preparationInstructions && (
              <div className="bg-soft-blue text-snow-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-black  " />
                  <h4 className="font-semibold text-black ">Preparation Instructions</h4>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {test.preparationInstructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking Form */}


<div className="flex flex-col items-center gap-2 w-full">
  <Label htmlFor="date" className="text-soft-blue text-xl  text-center">Preferred Date</Label>
  <div className="w-full flex justify-center">
    <CalendarComponent
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      className="rounded-md border w-[350px]" // or whatever width you want
      showOutsideDays={false}
      required
    />
  </div>
</div>



  <div>
                <Label htmlFor="time" className="text-soft-blue text-xl">Preferred Time</Label>
                <TimeSelect selectedTime={selectedTime} setSelectedTime={setSelectedTime}/>
              </div>
            <div>
              <Label htmlFor="location" className="text-soft-blue text-xl">Location</Label>
              <div className="flex items-center gap-2 mt-1 ">
                <MapPin className="h-4 w-4 text-soft-blue" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter Lab Location or Home Sampling"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-soft-blue text-xl">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or notes..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-soft-coral text-snow-white">
              Cancel
            </Button>
            <Button
              onClick={handleBookTest}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 bg-soft-blue text-snow-white"
            >
              Book Test - ${test.price}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
