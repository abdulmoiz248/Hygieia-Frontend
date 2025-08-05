"use client"

import { motion } from "framer-motion"
import { Plus, Calendar, Clock, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setShowBookingModal, setSelectedTest, cancelLabTest } from "@/types/patient/labTestsSlice"
import { LabTestBookingModal } from "./LabTestBookingModal"
import type { LabTest } from "@/types/patient/labTestsSlice"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function LabTestsSection() {
  const dispatch = useAppDispatch()
  const { availableTests, bookedTests, selectedTest } = useAppSelector((state) => state.labTests)

  const pendingTests = bookedTests.filter((test) => test.status === "pending")

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
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Pending Tests */}
      {pendingTests.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Pending Lab Tests ({pendingTests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{test.testName}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(test.scheduledDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {test.scheduledTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {test.location}
                        </span>
                      </div>
                      {test.instructions && (
                        <div className="mt-2">
                          <p className="text-xs text-amber-600 font-medium">Preparation required</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelTest(test.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Available Tests */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Book Lab Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">{test.name}</h4>
                    <Badge variant="secondary">{test.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {test.duration}
                    </div>
                    <span className="font-semibold text-green-600">${test.price}</span>
                  </div>
                  <Button
                    onClick={() => handleBookTest(test)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Book Test
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Booking Modal */}
      {selectedTest && <LabTestBookingModal test={selectedTest} />}
    </div>
  )
}
