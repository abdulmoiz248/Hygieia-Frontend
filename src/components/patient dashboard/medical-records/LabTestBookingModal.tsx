"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Clock, MapPin, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { LabTest } from "@/types/patient/lab"
import { CalendarComponent } from "@/components/ui/calendar"
import TimeSelect from "./TimeSelect"
import { usePatientLabTestsStore } from "@/store/patient/lab-tests-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { useRouter } from "next/navigation"
import { patientSuccess, patientDestructive } from "@/toasts/PatientToast"

interface LabTestBookingModalProps {
  test: LabTest
}

export function LabTestBookingModal({ test }: LabTestBookingModalProps) {
  const router = useRouter()

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
  const [showConfirmation, setShowConfirmation] = useState(false)

  const profile = usePatientProfileStore((state) => state.profile)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setSelectedDate(normalizedDate)
  }

  // FIX: format as ISO yyyy-mm-dd so the date is stable across locales
  // and parses correctly in LabBookingsSection / PDF generator.
  const toISODate = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  // Human-readable version used only for display inside this modal
  const displayDate = (date: Date): string =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })

  const handleBookTest = async () => {
    if (!selectedDate || !selectedTime) return
    const patientId =
      profile?.id ||
      (typeof window !== "undefined" ? localStorage.getItem("id") : null)

     console.log("[BookModal] profile:", profile)
     console.log("[BookModal] patientId:", patientId)
     console.log("[BookModal] selectedDate:", selectedDate)
     console.log("[BookModal] selectedTime:", selectedTime)

    if (!patientId) {
      patientDestructive("Patient ID not found. Please log in again.")
      return
    }

    const result = await bookLabTest({
      testName: test.name,
      testId: test.id,
      patientId,
      scheduledDate: toISODate(selectedDate),
      scheduledTime: selectedTime,
      location,
      instructions: test.preparation_instructions,
    })

    if (result) {
      patientSuccess(`${test.name} booked successfully!`)
      setShowConfirmation(true)
    } else {
      patientDestructive(`Failed to book ${test.name}. Please try again.`)
    }
  }

  const handleClose = () => {
    setShowBookingModal(false)
    setSelectedTest(null)
  }

  const handleGoToBookings = () => {
    setShowBookingModal(false)
    setSelectedTest(null)
    setShowConfirmation(false)
    setSelectedDate(new Date(Date.now() + 86400 * 1000))
    setSelectedTime("")
    setNotes("")
    router.push("/patient/medical-records")
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
        {/* ── Booking confirmation screen ── */}
        {showConfirmation ? (
          <div className="p-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-soft-blue">Booking Confirmed!</h2>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Themed success banner */}
            <div
              className="flex gap-3 p-4 rounded-xl border border-[var(--color-mint-green)]/20"
              style={{ background: "oklch(0.97 0.03 178)" }}
            >
              <CheckCircle2
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "var(--color-mint-green)" }}
              />
              <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed">
                <span className="font-semibold text-[var(--color-dark-slate-gray)]">{test.name}</span>{" "}
                has been booked successfully and is now pending confirmation. You can view your upcoming
                tests in the Lab Bookings section.
              </p>
            </div>

            {/* Summary card */}
            <div className="rounded-xl border border-cool-gray/20 bg-cool-gray/5 p-5 space-y-2.5 text-sm text-dark-slate-gray">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-mint-green shrink-0" />
                <span><strong>Test:</strong> {test.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-soft-coral shrink-0" />
                {/* FIX: use displayDate helper instead of toLocaleDateString() */}
                <span>
                  <strong>Date & Time:</strong>{" "}
                  {displayDate(selectedDate)} at {selectedTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-soft-coral shrink-0" />
                <span><strong>Location:</strong> {location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-soft-blue">Rs.{test.price}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-cool-gray/40 text-dark-slate-gray hover:bg-cool-gray/10"
              >
                Stay on Lab Tests
              </Button>
              <Button
                onClick={handleGoToBookings}
                className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
              >
                View My Bookings →
              </Button>
            </div>
          </div>
        ) : (
          /* ── Booking form ── */
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
              {Array.isArray(test.preparation_instructions) &&
                test.preparation_instructions.length > 0 && (
                <div className="bg-soft-blue text-snow-white rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-white" />
                    <h4 className="font-semibold text-white">Preparation Instructions</h4>
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
                      disabled={(date: Date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today
                      }}
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
                  <li><strong>Test:</strong> {test.name}</li>
                  {/* FIX: use displayDate helper */}
                  <li><strong>Date:</strong> {displayDate(selectedDate)}</li>
                  <li><strong>Time:</strong> {selectedTime || "Not selected"}</li>
                  <li><strong>Location:</strong> {location}</li>
                  {notes && <li><strong>Notes:</strong> {notes}</li>}
                  <li><strong>Price:</strong> Rs.{test.price}</li>
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
                Confirm Booking — Rs.{test.price}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}