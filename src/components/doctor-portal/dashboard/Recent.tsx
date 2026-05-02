import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { useDoctorPrescriptionStore } from "@/store/doctor/doctor-prescription-store"
import Loader from "@/components/loader/loader"

const RecentPrescriptions = () => {
  const { prescriptions, isLoading } = useDoctorPrescriptionStore()

  return (
    <Card className="scale-in bg-white/60">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <TrendingUp
            className="h-5 w-5"
            style={{ color: "var(--color-mint-green)" }}
          />
          <span>Recent Prescriptions</span>
        </CardTitle>
        <CardDescription>
          Latest prescriptions assigned to patients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader />
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No prescriptions found
          </p>
        ) : (
          prescriptions.slice(0, 3).map((prescription) => {
            const followUpDate = prescription.followUpDate
              ? new Date(prescription.followUpDate)
              : null
            const isExpired = followUpDate ? followUpDate < new Date() : false

            return (
              <div
                key={prescription.id}
                className="flex items-center justify-between p-3 rounded-lg bg-cool-gray/10 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: isExpired
                        ? "var(--color-soft-coral)"
                        : "var(--color-mint-green)",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate text-soft-coral">
                      {prescription.patientName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {prescription.diagnosis} •{" "}
                      {prescription.dosage && `${prescription.dosage} `}
                      {prescription.frequency}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-sm font-medium">
                    {prescription.startDate
                      ? new Date(prescription.startDate).toLocaleDateString()
                      : "—"}
                    {followUpDate
                      ? ` - ${followUpDate.toLocaleDateString()}`
                      : ""}
                  </p>
                  <Badge className="text-xs mt-1 text-snow-white bg-soft-blue">
                    {isExpired ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Active
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            )
          })
        )}

        <Button variant="outline" className="w-full bg-mint-green text-white">
          View All Prescriptions
        </Button>
      </CardContent>
    </Card>
  )
}

export default RecentPrescriptions
