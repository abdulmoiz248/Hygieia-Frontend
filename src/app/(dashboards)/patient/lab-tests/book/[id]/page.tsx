"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, AlertCircle, FileText, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { bookLabTest, fetchLabTests } from "@/types/patient/labTestsSlice"
import { CalendarComponent } from "@/components/ui/calendar"
import TimeSelect from "@/components/patient dashboard/medical-records/TimeSelect"
import { patientSuccess } from "@/toasts/PatientToast"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function BookLabTestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = Array.isArray(params.id) ? params.id[0] : params.id || ""
  
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.profile)
  const { availableTests } = useAppSelector((state) => state.labTests)
  
  const test = availableTests.find((t) => t.id === testId)

  useEffect(() => {
    if (!availableTests || availableTests.length === 0) {
      dispatch(fetchLabTests())
    }
  }, [dispatch, availableTests])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now() + 86400 * 1000))
  const [selectedTime, setSelectedTime] = useState("")
  const [location, setLocation] = useState("Main Lab - Floor 2")
  const [notes, setNotes] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setSelectedDate(normalizedDate)
  }

  const handleBookTest = () => {
    if (!selectedDate || !selectedTime || !test) return

    dispatch(
      bookLabTest({
        testName: test.name,
        testId: test.id,
        patientId: profile.id,
        scheduledDate: selectedDate?.toLocaleDateString(),
        scheduledTime: selectedTime,
        location,
        instructions: [notes],
      }),
    )

    patientSuccess(`${test.name} Booked Successfully`)
    setShowConfirmation(true)
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-0 bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardContent className="p-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-soft-coral/20 text-soft-coral flex items-center justify-center text-3xl font-bold">
                !
              </div>
              <h2 className="text-3xl font-semibold text-soft-coral tracking-tight">Test Not Found</h2>
              <p className="text-cool-gray text-base leading-relaxed text-center">
                We couldn&apos;t find the lab test you&apos;re looking for
                <br />
              
              </p>
              <Button
                onClick={() => router.push("/patient/lab-tests")}
                className="mt-4 bg-soft-blue hover:bg-soft-blue/90 text-white"
              >
                View All Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold text-soft-coral">Book Lab Test</h1>
          <p className="text-cool-gray">Schedule your lab test appointment</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {/* Test Details Card */}
          <Card className="mb-3 bg-white/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-soft-coral" />
                Test Details
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                <div className="bg-soft-blue text-snow-white rounded-lg p-5 mt-4">
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
            </CardContent>
          </Card>

          {/* Calendar Card */}
          <Card className="mb-3 bg-white/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mint-green" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-5 border-0 w-full max-w-[450px] mx-auto"
                disabled={(date: Date) => date < new Date()}
                showOutsideDays={false}
                today={selectedDate}
              />
            </CardContent>
          </Card>

          {/* Booking Details Card */}
          <Card className="bg-white/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-soft-blue" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Time Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Select Time</label>
                <TimeSelect selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Location</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-soft-blue" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter Lab Location or Home Sampling"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Additional Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={4}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-soft-blue">Phone Number</label>
                  <Input placeholder="+1 (555) 123-4567" value={profile.phone} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-soft-blue">Email</label>
                  <Input placeholder="john.doe@example.com" value={profile.email} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Summary */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className={!selectedTime ? 'bg-cool-gray/10 sticky top-0' : 'bg-white/40 sticky top-0'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-soft-coral" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Test:</span>
                  <span className="text-sm font-medium text-soft-blue">{test.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Date:</span>
                  <span className="text-sm font-medium text-soft-blue">
                    {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Time:</span>
                  <span className="text-sm font-medium text-soft-blue">{selectedTime || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Location:</span>
                  <span className="text-sm font-medium text-soft-blue">{location}</span>
                </div>
                {notes && (
                  <div className="flex justify-between">
                    <span className="text-sm text-cool-gray">Notes:</span>
                    <span className="text-sm font-medium text-soft-blue">{notes}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Price:</span>
                  <span className="text-sm font-medium text-soft-blue">Rs.{test.price}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleBookTest}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-md p-6 space-y-5 border border-soft-blue/20 animate-fadeIn scale-100">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-soft-coral/10 text-soft-coral animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-dark-slate-gray tracking-wide">Booking Confirmed</h2>
              <span className="text-xs font-medium text-soft-blue bg-soft-blue/10 px-2 py-0.5 rounded-full">
                #LAB-{Math.floor(Math.random() * 10000)}
              </span>
            </div>

            <div className="space-y-3 text-sm text-dark-slate-gray">
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Test</span>
                <span>{test.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Date</span>
                <span>{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Time</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Location</span>
                <span>{location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Price</span>
                <span>Rs.{test.price}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  setShowConfirmation(false)
                  router.push("/patient/medical-records")
                }}
                className="w-full bg-soft-blue hover:bg-soft-blue/90 text-white py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
