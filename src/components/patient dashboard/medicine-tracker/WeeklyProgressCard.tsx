import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";

interface WeeklyProgressCardProps {
  weeklyProgress: number;
}

const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({ weeklyProgress }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-soft-coral" />
        Weekly Progress
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-soft-coral mb-2">{weeklyProgress}%</div>
        <p className="text-sm text-cool-gray">Adherence Rate</p>
      </div>
      <Progress value={weeklyProgress} className="h-3" />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Doses taken</span>
          <span className="font-medium">17/20</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Missed doses</span>
          <span className="font-medium text-soft-coral">3</span>
        </div>
      </div>
      <div className="pt-4 border-t">
        <h4 className="font-medium mb-2">This Week</h4>
        <div className="grid grid-cols-7 gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div
              key={`${day}-${index}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                index < 5
                  ? "bg-mint-green text-white"
                  : index === 5
                  ? "bg-soft-coral text-white"
                  : "bg-gray-200 text-cool-gray"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default WeeklyProgressCard; 