"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Clock, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Folder from "@/blocks/Components/Folder/Folder"
import { useEffect, useState } from "react"
import { formatDateOnly } from "@/helpers/date"
import { usePatientAppointmentsStore } from "@/store/patient/appointments-store"
import { usePatientMedicalRecordsStore } from "@/store/patient/medical-records-store"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function FolderApp() {
  const appointments = usePatientAppointmentsStore((state) => state.appointments)
  const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming").slice(0, 3)
  const { records, fetchMedicalRecords } = usePatientMedicalRecordsStore()
  const recentRecords = records.slice(0, 3)


  const [isAppointmentsOpen, setAppointmentsOpen] = useState(false)
  const [isRecordsOpen, setRecordsOpen] = useState(false)
  useEffect(() => {
    fetchMedicalRecords()
  }, [fetchMedicalRecords])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-13">
      {/* Appointments Folder */}
      <motion.div variants={itemVariants}>
        <Card
          className="p-6 bg-white/40 flex flex-col items-center justify-center gap-3 text-center hover:shadow-lg transition-all cursor-pointer"
          onClick={() => setAppointmentsOpen((prev) => !prev)}
        >
          <Folder size={2} color="#ff1c6c" className="custom-folder" />
          <p className="text-lg font-semibold text-soft-coral mt-10">Appointments</p>

          <AnimatePresence>
            {isAppointmentsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <CardContent className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-cool-gray/10 rounded rounded-5  transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-soft-blue/20 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-soft-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.doctor.name}</p>
                          <p className="text-sm text-cool-gray">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-soft-blue/20 text-soft-blue px-2 py-1 rounded-full">
                        {appointment.type}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Medical Records Folder */}
      <motion.div variants={itemVariants}>
        <Card
          className="p-6 flex bg-white/40 flex-col items-center justify-center gap-3 text-center hover:shadow-lg transition-all cursor-pointer"
          onClick={() => setRecordsOpen((prev) => !prev)}
        >
          <Folder size={2} color="#008396" className="custom-folder" />
          <p className="text-lg font-semibold text-soft-blue mt-10">Medical Records</p>

          <AnimatePresence>
            {isRecordsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <CardContent className="space-y-4">
                  {recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 bg-cool-gray/10 rounded-5  transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-mint-green/20 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-mint-green" />
                        </div>
                        <div>
                          <p className="font-medium">{record.title}</p>
                          <p className="text-sm text-cool-gray">
                            {formatDateOnly( record.date)} 
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-mint-green/20 text-mint-green px-2 py-1 rounded-full">
                        {record.type}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
