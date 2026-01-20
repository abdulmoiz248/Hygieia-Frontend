"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Clock, MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { LabTest } from "@/types/patient/lab"
import { CalendarComponent } from "@/components/ui/calendar"
import TimeSelect from "./TimeSelect"
import { patientSuccess } from "@/toasts/PatientToast"
import { usePatientLabTestsStore } from "@/store/patient/lab-tests-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"

interface LabTestBookingModalProps {
  test: LabTest
}

export function LabTestBookingModal({ test }: LabTestBookingModalProps) {
  const {
    showBookingModal,
    setShowBookingModal,
    setSelectedTest,
    bookLabTest,
  } = usePatientLabTestsStore()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now() + 86400 * 1000))
  const [selectedTime, setSelectedTime] = useState("")
  const [location, setLocation] = useState("Main Lab - Floor 2")
  const [notes, setNotes] = useState("")
  const profile = usePatientProfileStore((state) => state.profile)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setSelectedDate(normalizedDate)
  }

  const handleBookTest = () => {
    if (!selectedDate || !selectedTime) return

    bookLabTest({
      testName: test.name,
      testId: test.id,
      patientId: profile.id,
      scheduledDate: selectedDate?.toLocaleDateString(),
      scheduledTime: selectedTime,
      location,
      instructions: test.preparation_instructions,
    })

    patientSuccess(`${test.name} Booked Successfully`)
    setShowBookingModal(false)
    setSelectedTest(null)
    setSelectedDate(new Date(Date.now() + 86400 * 1000))
    setSelectedTime("")
    setNotes("")
  }

  const handleClose = () => {
    setShowBookingModal(false)
    setSelectedTest(null)
  }

  if (!showBookingModal) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-snow-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-soft-blue">Book Lab Test</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-8">
            {/* Test Details */}
            <div className="bg-cool-gray/10 rounded-lg p-5">
              <h3 className="font-semibold text-soft-coral text-xl mb-2">{test.name}</h3>
              <p className="text-dark-slate-gray mb-3">{test.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-soft-coral" />
                  {test.duration}
                </span>
                <span className="font-semibold text-cool-gray">Rs.{test.price}</span>
              </div>
            </div>

            {/* Preparation Instructions */}
            {test.preparation_instructions && (
              <div className="bg-soft-blue text-snow-white rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-black" />
                  <h4 className="font-semibold text-black">Preparation Instructions</h4>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {test.preparation_instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking Form */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 w-full">
                <Label htmlFor="date" className="text-soft-blue text-xl text-center">
                  Preferred Date
                </Label>
                <div className="w-full flex justify-center">
                  <CalendarComponent
                    mode="single"
                    today={selectedDate}
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-lg border w-[450px]"
                    showOutsideDays={false}
                    disabled={(date: Date) => date < new Date()}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="time" className="text-soft-blue text-xl">
                  Preferred Time
                </Label>
                <TimeSelect selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
              </div>

              <div>
                <Label htmlFor="location" className="text-soft-blue text-xl">
                  Location
                </Label>
                <div className="flex items-center gap-2 mt-1">
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
                <Label htmlFor="notes" className="text-soft-blue text-xl">
                  Additional Notes (Optional)
                </Label>
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

            {/* Booking Summary */}
            <div className="bg-cool-gray/5 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-semibold text-soft-blue mb-4">Booking Summary</h3>
              <ul className="space-y-2 text-dark-slate-gray">
                <li>
                  <strong>Test:</strong> {test.name}
                </li>
                <li>
                  <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
                </li>
                <li>
                  <strong>Time:</strong> {selectedTime || "Not selected"}
                </li>
                <li>
                  <strong>Location:</strong> {location}
                </li>
                {notes && (
                  <li>
                    <strong>Notes:</strong> {notes}
                  </li>
                )}
                <li>
                  <strong>Price:</strong> Rs.{test.price}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <Button
              onClick={handleClose}
              className="flex-1 bg-soft-coral hover:bg-soft-coral/90 text-snow-white text-lg py-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookTest}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white text-lg py-3"
            >
              Confirm Booking - Rs.{test.price}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
