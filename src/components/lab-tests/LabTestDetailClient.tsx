
"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { LabTest } from "@/types/patient/lab"
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DollarSign, Clock, Microscope, CheckCircle, AlertCircle,
  Calendar, FileText, Shield
} from "lucide-react"

export default function LabTestDetailClient({ id }: { id: string }) {
  const [test, setSelectedTest] = useState<LabTest | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("selectedLabTest")
    if (stored) {
      const parsed: LabTest = JSON.parse(stored)
      if (parsed.id === id) {
        setSelectedTest(parsed)
        return
      }
    }

    const getData = async () => {
      const res = await api.get("/lab-tests")
      if (!res.data) return
      const labTests = res.data as LabTest[]
      const found = labTests.find((t) => t.id === id)
      if (found) setSelectedTest(found)
    }
    getData()
  }, [id])

  if (!test) return <p>Loading test details...</p>

  return (
  <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green">
      <div className="relative pt-10 overflow-hidden border-b border-border/50 bg-gradient-to-r from-soft-blue/20 via-mint-green/10 to-soft-coral/20">
  {/* background texture */}
  <div className="absolute inset-0  opacity-10" />
  {/* subtle overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/20 backdrop-blur-sm" />

  <div className="relative container mx-auto px-4 py-16  items-center">
    {/* Left side - text */}
    <div className="space-y-6" >
     
      <div className="p-6 rounded-2xl w-full bg-white/70 shadow-lg backdrop-blur-sm border border-white/30 space-y-4">

        <h1 className="text-4xl md:text-5xl font-bold text-dark-slate-gray">
          {test.name}
        </h1>
        <p className="text-lg text-cool-gray leading-relaxed">
          {test.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-soft-blue/20 text-soft-blue">{test.category}</Badge>
          <Badge className="bg-soft-coral/20 text-soft-coral flex items-center gap-1">
            <Shield className="w-3 h-3" /> Certified Test
          </Badge>
        </div>
      </div>
    </div>

   
  </div>
</div>


      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Test Overview */}
            <Card className="border-border/50 bg-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-soft-blue">
                  <FileText className="w-5 h-5 " />
                  Test Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-cool-gray/10">
                    <DollarSign className="w-6 h-6 text-soft-coral mx-auto mb-2" />
                    <div className="font-semibold text-dark-slate-gray">Rs{test.price}</div>
                    <div className="text-sm text-cool-gray">Cost</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-cool-gray/10">
                    <Clock className="w-6 h-6 text-soft-coral mx-auto mb-2" />
                    <div className="font-semibold text-dark-slate-gray">{test.duration}</div>
                    <div className="text-sm text-cool-gray">Results Time</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-cool-gray/10">
                    <Microscope className="w-6 h-6 text-soft-coral mx-auto mb-2" />
                    <div className="font-semibold text-dark-slate-gray">{test.category}</div>
                    <div className="text-sm text-cool-gray">Category</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preparation Instructions */}
            {test.preparation_instructions && test.preparation_instructions.length > 0 && (
              <Card className="border-border/50 bg-white/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-soft-blue">
                    <AlertCircle className="w-5 h-5 " />
                    Preparation Instructions
                  </CardTitle>
                  <CardDescription>Please follow these instructions to ensure accurate test results.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {test.preparation_instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-soft-coral mt-0.5 flex-shrink-0" />
                        <span className="text-dark-slate-gray">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-soft-blue">
                  <Shield className="w-5 h-5 " />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-soft-coral mb-2">Sample Collection</h4>
                    <p className="text-cool-gray">
                      A trained phlebotomist will collect your blood sample using sterile equipment. The process is
                      quick and typically takes less than 5 minutes.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-soft-coral mb-2">Processing Time</h4>
                    <p className="text-cool-gray">
                      Your sample will be processed in our state-of-the-art laboratory. Results will be available within{" "}
                      {test.duration} and sent to your healthcare provider.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-soft-coral mb-2">Quality Assurance</h4>
                    <p className="text-cool-gray">
                      All tests are performed using advanced equipment and follow strict quality control protocols to
                      ensure accurate and reliable results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-cool-gray/10 sticky top-20">
              <CardHeader>
                <CardTitle className="text-center text-soft-blue">Book Your Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-soft-coral">Rs.{test.price}</div>
                  <div className="text-sm text-muted-foreground">One-time fee</div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-slate-gray">Results in:</span>
                    <span className="font-medium text-soft-blue">{test.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-slate-gray">Category:</span>
                    <span className="font-medium text-soft-blue">{test.category}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-soft-blue text-snow-white hover:bg-soft-blue/90 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Test
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Secure booking • HIPAA compliant • Insurance accepted
                </p>
              </CardContent>
            </Card>

           
          </div>
        </div>
      </div>
    </div>
  )
}
