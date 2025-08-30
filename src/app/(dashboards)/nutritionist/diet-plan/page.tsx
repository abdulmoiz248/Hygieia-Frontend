"use client"

import { useEffect, useState } from "react"
import { DietPlanCard } from "@/components/nutritionist/diet-plan/diet-plan-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Users, TrendingUp, Calendar, Plus } from "lucide-react"
import { useDietPlanStore, DietPlan } from "@/store/nutritionist/diet-plan-store"
import useNutritionistStore from "@/store/nutritionist/userStore"

export default function DietPlanManager() {
  const nutritionistId = useNutritionistStore().profile.id!

  const {
    dietPlans,
    fetchDietPlans,
    updateDietPlanBackend,
    setSelectedDietPlan,
    isLoading,
  } = useDietPlanStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Fetch assigned diet plans on mount
  useEffect(() => {
    fetchDietPlans(nutritionistId)
  }, [nutritionistId, fetchDietPlans])

  const handleUpdateDietPlan = (updatedPlan: DietPlan) => {
   
    updateDietPlanBackend(updatedPlan.id!, updatedPlan, nutritionistId)
  }

const filteredPlans = dietPlans.filter((plan) => {
  const matchesSearch = searchTerm
    ? plan.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
    : true

  if (filterStatus === "all") return matchesSearch

  const now = new Date()
  const planEnd = plan.endDate ? new Date(plan.endDate) : null
  const isActive = planEnd ? planEnd > now : false
  const isCompleted = planEnd ? planEnd <= now : false

  if (filterStatus === "active") return matchesSearch && isActive
  if (filterStatus === "completed") return matchesSearch && isCompleted

  return matchesSearch
})

  const getStats = () => {
    const total = dietPlans.length
    const active = dietPlans.filter((plan) => plan.endDate && new Date(plan.endDate) > new Date()).length
    const completed = total - active
    const avgCalories =
      total === 0
        ? 0
        : Math.round(dietPlans.reduce((sum, plan) => sum + Number(plan.dailyCalories || 0), 0) / total)

    return { total, active, completed, avgCalories }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-snow-white to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance" style={{ color: "var(--color-dark-slate-gray)" }}>
            Diet Plan Manager
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Monitor and manage all assigned diet plans, track patient progress, and make adjustments as needed.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6 border-l-4" style={{ borderLeftColor: "var(--color-soft-blue)" }}>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8" style={{ color: "var(--color-soft-blue)" }} />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border-l-4" style={{ borderLeftColor: "var(--color-mint-green)" }}>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8" style={{ color: "var(--color-mint-green)" }} />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Plans</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border-l-4" style={{ borderLeftColor: "var(--color-soft-coral)" }}>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8" style={{ color: "var(--color-soft-coral)" }} />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border-l-4" style={{ borderLeftColor: "var(--color-cool-gray)" }}>
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-cool-gray)", color: "white" }}
              >
                <span className="text-sm font-bold">Avg</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgCalories}</p>
                <p className="text-sm text-muted-foreground">Avg Calories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="active">Active Plans</SelectItem>
                <SelectItem value="completed">Completed Plans</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full sm:w-auto"
            style={{ backgroundColor: "var(--color-soft-blue)", color: "white" }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Diet Plan
          </Button>
        </div>

        {/* Diet Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <p>Loading diet plans...</p>
          ) : filteredPlans.length > 0 ? (
            filteredPlans.map((dietPlan) => (
              <DietPlanCard key={dietPlan.id} dietPlan={dietPlan} onUpdate={handleUpdateDietPlan} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No diet plans found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
