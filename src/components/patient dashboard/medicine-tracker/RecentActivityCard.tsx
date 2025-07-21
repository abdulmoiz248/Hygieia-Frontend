import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Pill, CheckCircle, AlertCircle } from "lucide-react"
import React from "react"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  medicine: string
  time: string
  status: "taken" | "missed"
  date: string
}

interface RecentActivityCardProps {
  recentActivity: ActivityItem[]
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ recentActivity }) => {
  const takenCount = recentActivity.filter(item => item.status === "taken").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-soft-coral" />
            Recent Activity
          </div>
          <span className="text-sm font-semibold text-dark-slate-gray">
            Taken in last 30 days: <span className="text-mint-green">{takenCount}</span>
          </span>
        </CardTitle>
      </CardHeader>
     <CardContent>
  <div className="overflow-x-auto">
    <div className="max-h-72 overflow-y-auto rounded-md border border-gray-200 min-w-[500px]">
      <table className="min-w-full text-left text-sm text-dark-slate-gray">
        <thead className="bg-dark-slate-gray sticky top-0 z-10">
          <tr className="text-snow-white">
            <th className="px-4 py-2 whitespace-nowrap">Medicine</th>
            <th className="px-4 py-2 whitespace-nowrap">Time</th>
            <th className="px-4 py-2 whitespace-nowrap">Date</th>
            <th className="px-4 py-2 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentActivity.map((item, index) => (
            <tr key={index} className="border-b last:border-none">
              <td className="px-4 py-3 font-medium">{item.medicine}</td>
              <td className="px-4 py-3">{item.time}</td>
              <td className="px-4 py-3">{item.date}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.status === "taken" ? "bg-mint-green/20" : "bg-soft-coral/20"
                    }`}
                  >
                    {item.status === "taken" ? (
                      <CheckCircle className="w-4 h-4 text-mint-green" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-soft-coral" />
                    )}
                  </div>
                  <Badge
                    className={
                      item.status === "taken"
                        ? "bg-mint-green text-white"
                        : "bg-soft-coral text-white"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</CardContent>

    </Card>
  )
}

export default RecentActivityCard
