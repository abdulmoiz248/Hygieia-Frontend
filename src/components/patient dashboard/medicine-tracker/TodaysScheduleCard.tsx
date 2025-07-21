import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Pill, CheckCircle } from "lucide-react"
import React from "react"

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
  toggleMedicineTaken: (medicineId: string) => void
}

const TodaysScheduleCard: React.FC<TodaysScheduleCardProps> = ({ todaysMeds, toggleMedicineTaken }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-soft-blue" />
        Today&apos;s Schedule
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`space-y-4 ${todaysMeds.length > 3 ? "max-h-[500px] overflow-y-auto pr-2" : ""}`}>
        {todaysMeds.map((med) => (
          <div
            key={med.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              med.taken ? "border-mint-green/30 bg-mint-green/5" : "border-gray-200 hover:border-soft-blue/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id={med.id} checked={med.taken} onCheckedChange={() => toggleMedicineTaken(med.id)} />
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    med.taken ? "bg-mint-green/20" : "bg-gray-100"
                  }`}
                >
                  {med.taken ? (
                    <CheckCircle className="w-6 h-6 text-mint-green" />
                  ) : (
                    <Pill className="w-6 h-6 text-cool-gray" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-dark-slate-gray">{med.name}</h3>
                  <p className="text-sm text-cool-gray">
                    {med.dosage} • {med.time}
                  </p>
                  <p className="text-xs text-cool-gray">{med.frequency}</p>
                  {med.instructions && <p className="text-xs text-blue-600 mt-1">{med.instructions}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {med.taken ? (
                  <Badge className="bg-mint-green text-white">Taken</Badge>
                ) : (
                  <Button
                    size="sm"
                    className="bg-mint-green hover:bg-mint-green/90"
                    onClick={() => toggleMedicineTaken(med.id)}
                  >
                    Mark Taken
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export default TodaysScheduleCard
