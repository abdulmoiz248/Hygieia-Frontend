'use client'
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Microscope,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { getLabTestById } from "../page"

interface LabTestDetailPageProps {
  params: Promise<{ id: string }>
}


export default async function LabTestDetailPage({ params }: LabTestDetailPageProps) {
  const { id } = await params
  const test = getLabTestById(id)

  if (!test) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border/50">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=300&width=1200')] opacity-5" />
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Tests
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Microscope className="w-3 h-3 mr-1" />
              {test.category}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-4">
              <h1 className="text-4xl font-bold text-foreground text-balance">{test.name}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{test.description}</p>
            </div>

            <div className="space-y-4">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">${test.price}</div>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Results in {test.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book This Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Test Overview */}
            <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Test Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-semibold text-foreground">${test.price}</div>
                    <div className="text-sm text-muted-foreground">Cost</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                    <div className="font-semibold text-foreground">{test.duration}</div>
                    <div className="text-sm text-muted-foreground">Results Time</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <Microscope className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-semibold text-foreground">{test.category}</div>
                    <div className="text-sm text-muted-foreground">Category</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preparation Instructions */}
            {test.preparation_instructions && test.preparation_instructions.length > 0 && (
              <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    Preparation Instructions
                  </CardTitle>
                  <CardDescription>Please follow these instructions to ensure accurate test results.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {test.preparation_instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <Card className="border-border/50 bg-gradient-to-br from-card via-card to-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Sample Collection</h4>
                    <p className="text-muted-foreground">
                      A trained phlebotomist will collect your blood sample using sterile equipment. The process is
                      quick and typically takes less than 5 minutes.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Processing Time</h4>
                    <p className="text-muted-foreground">
                      Your sample will be processed in our state-of-the-art laboratory. Results will be available within{" "}
                      {test.duration} and sent to your healthcare provider.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Quality Assurance</h4>
                    <p className="text-muted-foreground">
                      All tests are performed using advanced equipment and follow strict quality control protocols to
                      ensure accurate and reliable results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 sticky top-6">
              <CardHeader>
                <CardTitle className="text-center text-foreground">Book Your Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">${test.price}</div>
                  <div className="text-sm text-muted-foreground">One-time fee</div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Results in:</span>
                    <span className="font-medium text-foreground">{test.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium text-foreground">{test.category}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Test
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Secure booking • HIPAA compliant • Insurance accepted
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Have questions about this test? Our medical team is here to help.
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
