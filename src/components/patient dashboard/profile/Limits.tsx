"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target } from "lucide-react"

interface LimitsProps {
  profile: any
  setProfile: React.Dispatch<React.SetStateAction<any>>
  isEditing: boolean
}

export default function Limits({ profile, setProfile, isEditing }: LimitsProps) {
  return (
    <Card className="my-10">
      <CardHeader className="flex items-center justify-between ">
        <CardTitle className="flex items-center gap-2 text-mint-green">
          <Target className="w-5 h-5 text-mint-green" />
          Daily Limits / Goals
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {[
          { key: "sleep", label: "Sleep (hours)" },
          { key: "water", label: "Water (liters)" },
          { key: "steps", label: "Steps" },
          { key: "protein", label: "Protein (g)" },
          { key: "carbs", label: "Carbs (g)" },
          { key: "fats", label: "Fats (g)" },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col">
            <Label className="pb-1 text-mint-green">{label}</Label>
            <Input
              type="number"
              value={profile.limit?.[key] || ""}
              onChange={(e) =>
                setProfile((prev: any) => ({
                  ...prev,
                  limit: { ...prev.limit, [key]: e.target.value },
                }))
              }
              disabled={!isEditing}
              min="0"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
