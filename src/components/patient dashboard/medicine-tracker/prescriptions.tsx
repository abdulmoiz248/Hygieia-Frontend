"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pill, Calendar, CheckCircle, FileQuestion } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useSelector } from "react-redux"
import { RootState } from "@/store/patient/store"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function PrescriptionsPage() {
  const Prescriptions = useSelector((state: RootState) => state.medicine.Prescription)

  const [selectedPrescription, setSelectedPrescription] = useState<(typeof Prescriptions)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("active")

  const activePrescriptions = Prescriptions.filter((p) => p.status === "active")
  const completedPrescriptions = Prescriptions.filter((p) => p.status === "completed")

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center py-20 text-center text-cool-gray">
      <FileQuestion className="w-12 h-12 text-soft-coral mb-4" />
      <p className="text-lg font-semibold">{message}</p>
      <p className="text-sm mt-2">Once prescriptions are added, they’ll show up here.</p>
    </div>
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 mt-10">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-soft-coral">Prescriptions</h1>
        <p className="text-cool-gray">Manage your active and previous prescriptions</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="active" className="data-[state=active]:bg-soft-blue data-[state=active]:text-white hover:bg-soft-blue/20 transition-colors">
              Active ({activePrescriptions.length})
            </TabsTrigger>
            <TabsTrigger value="previous" className="data-[state=active]:bg-mint-green data-[state=active]:text-white hover:bg-mint-green/20 transition-colors">
              Previous ({completedPrescriptions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activePrescriptions.length === 0 ? (
              renderEmptyState("No active prescriptions found")
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePrescriptions.map((prescription) => (
                  <motion.div key={prescription.id} whileHover={{ scale: 1.02 }}>
                    <Card
                      className="h-full flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer bg-white/40"
                      onClick={() => setSelectedPrescription(prescription)}
                    >
                      <div>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg text-soft-coral">{prescription.doctorName}</CardTitle>
                              <p className="text-sm text-cool-gray">{prescription.doctorSpecialty}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-cool-gray">
                              <Calendar className="w-4 h-4 text-mint-green" />
                              Prescribed on {prescription.date}
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Medications <span className="text-soft-blue"> ({prescription.medications.length}) </span></p>
                              {prescription.medications.slice(0, 1).map((med) => (
                                <div key={med.id} className="flex justify-between items-center text-sm">
                                  <span className="font-medium">{med.name}</span>
                                  <span className="text-soft-coral">{med.dosage}</span>
                                </div>
                              ))}
                              {prescription.medications.length > 1 && (
                                <p className="text-xs text-cool-gray">+{prescription.medications.length - 1} more</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                      <div className="p-4 pt-2 mt-auto">
                        <Button variant="outline" size="sm" className="w-full bg-soft-blue text-snow-white">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="previous" className="mt-6">
            {completedPrescriptions.length === 0 ? (
              renderEmptyState("No previous prescriptions found")
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedPrescriptions.map((prescription) => (
                  <motion.div key={prescription.id} whileHover={{ scale: 1.02 }}>
                    <Card
                      className="h-full flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer opacity-75 bg-white"
                      onClick={() => setSelectedPrescription(prescription)}
                    >
                      <div>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg text-soft-coral">{prescription.doctorName}</CardTitle>
                              <p className="text-sm text-cool-gray">{prescription.doctorSpecialty}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-cool-gray">
                              <Calendar className="w-4 h-4 text-mint-green" />
                              Prescribed on {prescription.date}
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Medications <span className="text-soft-blue"> ({prescription.medications.length}) </span></p>
                              {prescription.medications.slice(0, 2).map((med) => (
                                <div key={med.id} className="flex justify-between items-center text-sm">
                                  <span className="font-medium">{med.name}</span>
                                  <span className="text-soft-coral">{med.dosage}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                      <div className="p-4 pt-2 mt-auto">
                        <Button variant="outline" size="sm" className="w-full bg-soft-blue text-snow-white">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
        <DialogContent className="w-full max-w-10xl max-h-[90vh] overflow-y-auto rounded-2xl bg-snow-white px-4 sm:px-6 lg:px-10 ">
          {selectedPrescription && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-12 h-12 bg-mint-green/20 rounded-full flex items-center justify-center">
                    <Pill className="w-6 h-6 text-soft-coral" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-soft-coral">Prescription Details</h2>
                    <p className="text-cool-gray font-normal">
                      {selectedPrescription.doctorName} • {selectedPrescription.doctorSpecialty}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-mint-green" />
                    <span className="text-sm text-soft-blue">
                      <strong className="text-cool-gray">Prescribed:</strong> {selectedPrescription.date}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-soft-blue">Medications</h3>
                  <div className="w-full border rounded-lg">
                    <div className="w-full overflow-x-auto">
                      <table className="table-auto w-full text-sm">
                        <thead className="bg-dark-slate-gray text-snow-white">
                          <tr>
                            <th className="w-[30%] px-3 py-2 text-left">Medicine Name</th>
                            <th className="w-[20%] px-3 py-2 text-left">When to Take</th>
                            <th className="w-[20%] px-3 py-2 text-left">Frequency</th>
                            <th className="w-[15%] px-3 py-2 text-left">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPrescription.medications.map((med) => (
                            <tr key={med.id} className="border-t">
                              <td className="px-3 py-2 break-words text-soft-coral">
                                {med.name} <span className="text-soft-blue">({med.dosage})</span>
                              </td>
                              <td className="px-3 py-2 break-words text-sm">{med.instructions}</td>
                              <td className="px-3 py-2 break-words text-sm">{med.frequency}</td>
                              <td className="px-3 py-2 break-words text-sm">{med.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-soft-blue">Instructions</h3>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((med) => (
                      <div key={med.id} className="p-3 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-mint-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Pill className="w-4 h-4 text-soft-coral" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{med.name}</h4>
                            <p className="text-sm text-cool-gray mt-1">{med.instructions}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPrescription.status === "active" && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
