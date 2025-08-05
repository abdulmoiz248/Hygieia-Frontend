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

interface LabTestBookingModalProps {
  test: LabTest
}

export function LabTestBookingModal({ test }: LabTestBookingModalProps) {
  const dispatch = useAppDispatch()
  const { showBookingModal } = useAppSelector((state) => state.labTests)

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [location, setLocation] = useState("Main Lab - Floor 2")
  const [notes, setNotes] = useState("")

  const handleBookTest = () => {
    if (!selectedDate || !selectedTime) return

    dispatch(
      bookLabTest({
        testId: test.id,
        testName: test.name,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        status: "pending",
        location,
        instructions: test.preparationInstructions,
      }),
    )

    dispatch(setShowBookingModal(false))
    dispatch(setSelectedTest(null))
    setSelectedDate("")
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
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Lab Test</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Test Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{test.name}</h3>
              <p className="text-gray-600 mb-3">{test.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {test.duration}
                </span>
                <span className="font-semibold text-green-600">${test.price}</span>
              </div>
            </div>

            {/* Preparation Instructions */}
            {test.preparationInstructions && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800">Preparation Instructions</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                  {test.preparationInstructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lab location"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
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
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleBookTest}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Book Test - ${test.price}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
