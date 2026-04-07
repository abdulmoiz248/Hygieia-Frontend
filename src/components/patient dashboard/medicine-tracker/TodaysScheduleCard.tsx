import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Pill, CheckCircle } from "lucide-react"
import React from "react"
import { patientError, patientSuccess } from "@/toasts/PatientToast"

interface Medicine {
  id: string
  name: string
  dosage: string
  time: string
  taken: boolean
  frequency: string
  instructions?: string
}

interface TodaysScheduleCardProps {
  todaysMeds: Medicine[]
  toggleMedicineTaken: (medicineId: string) => Promise<boolean>
  syncingMedicineIds?: string[]
}

const TodaysScheduleCard: React.FC<TodaysScheduleCardProps> = ({
  todaysMeds,
  toggleMedicineTaken,
  syncingMedicineIds = []
}) => {
  const pendingMeds = todaysMeds.filter((med) => !med.taken)

  return (
  <Card className="shadow-md rounded-2xl bg-white/40">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <Clock className="w-5 h-5 text-soft-blue" />
        Today&apos;s Schedule
      </CardTitle>
    </CardHeader>
    <CardContent>
      {pendingMeds.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center justify-center text-cool-gray gap-2">
          <CheckCircle className="w-10 h-10 text-mint-green" />
          <p className="text-base font-medium">No medicines to take today</p>
          <p className="text-sm text-black">You’re all set 🎉</p>
        </div>
      ) : (
        <div className={`space-y-4 ${pendingMeds.length > 3 ? "max-h-[500px] overflow-y-auto pr-2" : ""}`}>
          {pendingMeds.map((med) => {
            const isSyncing = syncingMedicineIds.includes(med.id)

            return (
            <div
              key={med.id}
              className={`p-4 rounded-xl  transition-all duration-300 ${
                med.taken
                  ? "border-mint-green/40 bg-mint-green/10"
                  : "bg-cool-gray/10 border-0 hover:border-soft-blue/30"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Checkbox
                    id={med.id}
                    checked={med.taken}
                    disabled={isSyncing}
                    onCheckedChange={() => toggleMedicineTaken(med.id)}
                  />
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      med.taken ? "bg-mint-green/20" : "bg-gray-100"
                    }`}
                  >
                    {med.taken ? (
                      <CheckCircle className="w-6 h-6 text-mint-green" />
                    ) : (
                      <Pill className="w-6 h-6 text-cool-gray" />
                    )}
                  </div>
                  <div className="truncate">
                    <h3 className="font-semibold text-dark-slate-gray truncate">{med.name}</h3>
                    <p className="text-sm text-cool-gray truncate">
                      {med.dosage} • {med.time}
                    </p>
                    <p className="text-xs text-cool-gray">{med.frequency}</p>
                    {med.instructions && (
                      <p className="text-xs text-blue-600 mt-1">{med.instructions}</p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    disabled={isSyncing}
                    className="bg-mint-green text-snow-white hover:bg-mint-green/90 transition-all duration-200"
                    onClick={async () => {
                      const saved = await toggleMedicineTaken(med.id)
                      if (saved) {
                        patientSuccess(`Medicine ${med.name} marked as taken`)
                      } else {
                        patientError(`Unable to mark ${med.name} as taken`)
                      }
                    }}
                  >
                    {isSyncing ? "Syncing..." : "Mark Taken"}
                  </Button>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}
    </CardContent>
  </Card>
  )
}

export default TodaysScheduleCard
