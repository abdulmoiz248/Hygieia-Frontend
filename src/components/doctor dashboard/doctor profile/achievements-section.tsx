"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Trophy, Medal, Star, Users, BookOpen } from "lucide-react"

const achievements = [
  {
    icon: Trophy,
    title: "Top Rated Doctor 2023",
    description: "Highest patient satisfaction scores",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Award,
    title: "Excellence in Cardiology",
    description: "American Heart Association",
    color: "text-soft-blue",
    bgColor: "bg-soft-blue/10",
  },
  {
    icon: Medal,
    title: "1000+ Successful Procedures",
    description: "Milestone achievement",
    color: "text-soft-coral",
    bgColor: "bg-soft-coral/10",
  },
  {
    icon: Star,
    title: "Patient Choice Award",
    description: "Voted by patients",
    color: "text-mint-green",
    bgColor: "bg-mint-green/10",
  },
  {
    icon: Users,
    title: "Community Service",
    description: "500+ hours of free consultations",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BookOpen,
    title: "Published Researcher",
    description: "25+ medical publications",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
]

export function AchievementsSection() {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-soft-blue/5 animate-slide-up">
      <CardHeader>
        <CardTitle className="text-dark-slate-gray flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Awards & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon
            return (
              <div
                key={index}
                className="group p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${achievement.bgColor} group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-5 h-5 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-dark-slate-gray group-hover:text-soft-blue transition-colors">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-cool-gray mt-1">{achievement.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
