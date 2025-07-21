import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bell } from "lucide-react";
import React from "react";

interface NextMedicine {
  name: string;
  dosage: string;
  time: string;
}

interface TodaysProgressCardProps {
  takenCount: number;
  totalCount: number;
  todayProgress: number;
  nextMedicine: NextMedicine | null;
}

const TodaysProgressCard: React.FC<TodaysProgressCardProps> = ({ takenCount, totalCount, todayProgress, nextMedicine }) => (
  <Card className="bg-soft-blue">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-snow-white">Today&apos;s Progress</h3>
          <p className="text-snow-white">
            {takenCount} of {totalCount} medications taken
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-mint-green">{Math.round(todayProgress)}%</div>
          <p className="text-sm text-snow-white">Complete</p>
        </div>
      </div>
      <Progress value={todayProgress} className="h-3 mb-4" />
      {nextMedicine && (
        <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Bell className="w-5 h-5 text-dark-slate-gray" />
          <div>
            <p className="font-medium text-soft-coral">Next: {nextMedicine.name}</p>
            <p className="text-sm text-cool-gray">
              {nextMedicine.dosage} at {nextMedicine.time}
            </p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export default TodaysProgressCard; 