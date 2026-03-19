import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React, { useState } from "react";

import { usePatientProfileStore } from "@/store/patient/profile-store";

const WeeklyProgressCard = () => {
  const user = usePatientProfileStore((state) => state.profile);
  
 
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
          <div className="text-3xl font-bold text-soft-coral mb-2">{user.adherence || 0}%</div>
          <p className="text-sm text-cool-gray">Adherence Rate</p>
        </div>
        <Progress value={user.adherence as number || 0} className="h-3 text-black" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Doses taken</span>
            <span className="font-medium">
              {user.doses_taken || 0}fix
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Missed doses</span>
            <span className="font-medium text-soft-coral">{user.missed_doses || 0}</span>
          </div>
        </div>
        <div className="pt-4 border-t">
         
            <p className="text-xs text-muted-foreground mb-2">
              Adherence data is updated at midnight every day.
          
         </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressCard;
