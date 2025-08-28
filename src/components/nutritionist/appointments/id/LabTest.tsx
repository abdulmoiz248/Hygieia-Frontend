"use client"
import { motion } from "framer-motion"
import { Clock, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LabTest } from "@/types/patient/lab"
import React, { useEffect, useState } from "react"
import api from "@/lib/axios"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LabTests({ onReferTest }: { onReferTest: (t: LabTest) => void }) {
  const [availableTests, setAvailableTests] = useState<LabTest[]>([])

  const fetchLabTests = async () => {
    const response = await api.get<LabTest[]>("/lab-tests")
    return response.data
  }

  useEffect(() => {
    const getTest = async () => {
      setAvailableTests(await fetchLabTests())
    }
    getTest()
  }, [])

  return (
    availableTests.length > 0 && (
      <Card className="hover-lift overflow-hidden">
        <CardHeader className="flex items-center gap-3 border-b">
          <TestTube className="h-6 w-6 text-soft-coral" />
          <CardTitle className="text-2xl font-bold text-soft-coral">Refer Lab Tests</CardTitle>
        </CardHeader>

        <CardContent>
          <motion.div variants={itemVariants} className="bg-transparent border-0 shadow-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-transparent border-0">
              {availableTests.map((test) => (
                <Card
                  key={test.id}
                  className="group bg-cool-gray/10 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <CardContent className="px-4 py-3 flex flex-col flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-soft-blue text-base line-clamp-1">{test.name}</h4>
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 rounded-md bg-soft-coral text-snow-white"
                      >
                        {test.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600">{test.description}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-600 pt-1">
                      <Clock className="h-4 w-4 text-soft-coral" />
                      <span>{test.duration}</span>
                    </div>

                    <div className="mt-auto pt-3">
                      <Button
                        onClick={() => onReferTest(test)}
                        size="sm"
                        className="w-full bg-transparent border-soft-blue text-soft-blue border hover:bg-soft-blue hover:text-snow-white"
                      >
                        Refer Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    )
  )
}
