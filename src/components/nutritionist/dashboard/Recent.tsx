import { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { useDietPlanStore } from "@/store/nutritionist/diet-plan-store"


const RecentDietPlans = () => {
  const { dietPlans,  isLoading } = useDietPlanStore()


  return (
    <Card className="scale-in bg-white/60">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <TrendingUp className="h-5 w-5" style={{ color: "var(--color-mint-green)" }} />
          <span>Recent Diet Plans</span>
        </CardTitle>
        <CardDescription>Latest diet plans assigned to patients</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading diet plans...</p>
        ) : dietPlans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No diet plans found</p>
        ) : (
          dietPlans.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between p-3 rounded-lg bg-cool-gray/10 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      new Date(plan.endDate) < new Date() ? "var(--color-soft-coral)" : "var(--color-mint-green)",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate text-soft-coral">{plan.patientName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {plan.dailyCalories} kcal • {plan.protein}P / {plan.carbs}C / {plan.fat}F
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-medium">
                  {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                </p>
                <Badge className="text-xs mt-1 text-snow-white bg-soft-blue">
                  {new Date(plan.endDate) < new Date() ? (
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
          ))
        )}

        <Button variant="outline" className="w-full bg-transparent">
          View All Diet Plans
        </Button>
      </CardContent>
    </Card>
  )
}

export default RecentDietPlans
