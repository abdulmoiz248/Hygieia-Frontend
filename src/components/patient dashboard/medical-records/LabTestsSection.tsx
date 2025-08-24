"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogDescription } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {  Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setShowBookingModal, setSelectedTest, cancelLabTest } from "@/types/patient/labTestsSlice"
import { LabTestBookingModal } from "./LabTestBookingModal"
import type { LabTest,BookedLabTest } from "@/types/patient/lab"
import { useEffect, useState } from "react"
import { patientDestructive } from "@/toasts/PatientToast"

import { fetchLabTests, fetchBookedTests } from '@/types/patient/labTestsSlice'
import { formatDateOnly } from "@/helpers/date"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function LabTestsSection() {
  const dispatch = useAppDispatch()
  
  const { availableTests, bookedTests, selectedTest } = useAppSelector((state) => state.labTests)

  const [selectTestModal,setSelectedTestModal]=useState<BookedLabTest | null>()
  const pendingTests = bookedTests.filter((test) => test.status === "pending")
 


  useEffect(() => {
  if (!availableTests || availableTests.length === 0) {
    dispatch(fetchLabTests())
  }
  if (!bookedTests || bookedTests.length === 0) {
    dispatch(fetchBookedTests())
  }
}, [dispatch, availableTests, bookedTests])


  const handleBookTest = (test: LabTest) => {
    dispatch(setSelectedTest(test))
    dispatch(setShowBookingModal(true))
  }

  const handleCancelTest = (testId: string) => {
    dispatch(cancelLabTest(testId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-soft-blue text-snow-white"
      
      case "cancelled":
        return "bg-soft-coral text-black"
    
    }
  }

  return (
    <div className="space-y-6">
      {/* Pending Tests */}
      {pendingTests.length > 0 && (
        <>
          <div>
        <h1 className="text-3xl font-bold text-soft-coral">Lab Bookings</h1>
        <p className="text-cool-gray">Book and view your Lab Reports here</p>
      </div>
      
  <motion.div variants={itemVariants}>
    <Card className="bg-white/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-soft-coral" />
          Pending Lab Tests ({pendingTests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingTests.map((test) => (
            <div
              key={test.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-cool-gray/10 rounded-lg border border-blue-200"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-soft-blue">{test.testName}</h4>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1 text-dark-slate-gray">
                    <Calendar className="h-4 w-4 text-soft-coral" />
                    {formatDateOnly(test.scheduledDate)}
                  </span>
                  <span className="flex items-center gap-1 text-dark-slate-gray">
                    <Clock className="h-4 w-4 text-soft-coral" />
                    {test.scheduledTime}
                  </span>
                  <span className="flex items-center gap-1 text-dark-slate-gray">
                    <MapPin className="h-4 w-4 text-soft-coral" />
                    {test.location}
                  </span>
                </div>
                {test.instructions && (
                  <div className="mt-2">
                    <p className="text-s text-mint-green outline-soft-blue font-medium">
                      Preparation required
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                <Badge className={`text-sm px-3 py-1.5 rounded-2 ${getStatusColor(test.status)}`}>
                  {test.status}
                </Badge>
                <Button
                
                  size="sm"
                  onClick={() => setSelectedTestModal(test)}
                  className="text-snow-white rounded-2 bg-soft-coral hover:bg-soft-coral/90"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
  </>
)}

{selectTestModal && (
  <Dialog open onOpenChange={() => setSelectedTestModal(null)}>
    <DialogContent className="backdrop-blur-md bg-snow-white border rounded-2xl p-6">
      <DialogHeader>
        <DialogTitle className="text-lg text-soft-blue font-bold">
          Cancel Test: {selectTestModal.testName}
        </DialogTitle>
        <DialogDescription className="text-gray-700 mt-1">
          Are you sure you want to cancel this test scheduled on{" "}
          <strong>{new Date(selectTestModal.scheduledDate).toLocaleDateString()}</strong> at{" "}
          <strong>{selectTestModal.scheduledTime}</strong>?
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="ghost"
          className="bg-soft-blue text-snow-white hover:bg-soft-blue/90"
          onClick={() => setSelectedTestModal(null)}
        >
          No, Go Back
        </Button>
        <Button
          
          className="bg-soft-coral text-snow-white hover:bg-soft-coral/90"
          onClick={() => {
            const testName=selectTestModal?.testName
            handleCancelTest(selectTestModal.id)
            patientDestructive(`${testName}  Cancelled Successfully`)
            setSelectedTestModal(null)
          }}
        >
          Yes, Cancel It
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)}

  <div>
        <h1 className="text-3xl mt-10 font-bold text-soft-coral"> Book Lab Tests</h1>
        <p className="text-cool-gray">Book and view your Lab Reports here</p>
      </div>

      {/* Available Tests */}
      <motion.div variants={itemVariants} className="bg-transparent border-0 shadow-0"> 
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-transparent border-0">
              {availableTests.map((test) => (
              <Card
  key={test.id}
  className="group bg-white/40 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all"
>
  <CardContent className="px-4 space-y-2 py-2">
    <div className="flex justify-between items-center">
      <h4 className="font-semibold text-soft-blue text-base line-clamp-1">{test.name}</h4>
      <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-md bg-soft-coral text-snow-white">
        {test.category}
      </Badge>
    </div>

    <p className="text-sm text-gray-600 line-clamp-1">{test.description}</p>

    <div className="flex items-center justify-between text-sm text-gray-600 pt-1">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-soft-coral" />
        <span>{test.duration}</span>
      </div>
      <span className="font-semibold text-cool-gray">Rs.{test.price}</span>
    </div>

  
      <Button
        onClick={() => handleBookTest(test)}
        size="sm"
        className="w-full bg-transparent mb-1 border-soft-blue  text-soft-blue border-1 hover:bg-soft-blue hover:text-snow-white"
      >
        Book Test
      </Button>

  </CardContent>
</Card>

              ))}
            </div>
       
      </motion.div>

      {/* Booking Modal */}
      {selectedTest && <LabTestBookingModal test={selectedTest} />}
    </div>
  )
}
