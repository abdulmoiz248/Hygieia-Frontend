import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React, { useState } from "react";

import { usePatientProfileStore } from "@/store/patient/profile-store";

const WeeklyProgressCard = () => {
  const user = usePatientProfileStore((state) => state.profile);
  const [showNote, setShowNote] = useState(false);

  const todayIndex = (new Date().getDay() + 6) % 7;
  const prevDayIndex = (todayIndex + 6) % 7;

  return (
    <Card className="bg-white/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-soft-coral" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-soft-coral mb-2">{user.adherence}%</div>
          <p className="text-sm text-cool-gray">Adherence Rate</p>
        </div>
        <Progress value={user.adherence as number} className="h-3 text-black" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Doses taken</span>
            <span className="font-medium">
              {user.doses_taken}/{(user.missed_doses as number) + (user.doses_taken as number)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Missed doses</span>
            <span className="font-medium text-soft-coral">{user.missed_doses}</span>
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">This Week</h4>
            <button
              onClick={() => setShowNote(!showNote)}
              className="text-xs text-cool-gray hover:underline transition-all"
            >
              {showNote ? "Hide note" : "Adherence Info"}
            </button>
          </div>
          {showNote && (
            <p className="text-xs text-muted-foreground mb-2">
              Adherence data is updated at midnight every day.
            </p>
          )}
          <div className="grid grid-cols-7 gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
              const baseStyle =
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium";
             
              const isPrevDay = index === prevDayIndex;
              const dayClass = isPrevDay
                ? "bg-soft-coral text-white"
                : index < 5
                ? "bg-mint-green text-white"
                : "bg-gray-200 text-cool-gray";
              return (
                <div key={`${day}-${index}`} className={`${baseStyle} ${dayClass}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressCard;
