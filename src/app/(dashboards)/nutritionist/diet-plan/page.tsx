"use client"

import { useEffect, useState } from "react"
import { DietPlanCard } from "@/components/nutritionist/diet-plan/diet-plan-card"
import { useDietPlanStore, DietPlan } from "@/store/nutritionist/diet-plan-store"
import useNutritionistStore from "@/store/nutritionist/userStore"
import { motion, Variants } from "framer-motion"
import PatientStats from "@/components/nutritionist/diet-plan/DietPlanStatsCard"
import { PatientPlansFilters } from "@/components/nutritionist/diet-plan/DietPlanFilters"

export default function DietPlanManager() {
  const nutritionistId = useNutritionistStore().profile.id!

  const {
    dietPlans,
    fetchDietPlans,
    updateDietPlanBackend,
    isLoading,
  } = useDietPlanStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

 const itemVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

  useEffect(() => {
    if(dietPlans.length==0) fetchDietPlans(nutritionistId)
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
    <div className="min-h-screen bg-gradient-to-br from-snow-white to-background ">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
     

          <motion.div variants={itemVariants} className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-soft-coral">   Diet Plan Manager</h1>
                  <p className="text-cool-gray">    Monitor and manage all assigned diet plans, track patient progress, and make adjustments as needed.
       </p>
                </div>
        
              
              </motion.div>
              

        {/* Stats Cards */}
       <PatientStats
  total={stats?.total ?? 0}
  active={stats?.active ?? 0}
  completed={stats?.completed ?? 0}
  
/>


        {/* Controls */}
        <PatientPlansFilters
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
        statusFilter={filterStatus}
        setStatusFilter={setFilterStatus}
      />

        {/* Diet Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <p>Loading diet plans...</p>
          ) : filteredPlans.length > 0 ? (
            filteredPlans.map((dietPlan) => (
              <DietPlanCard key={dietPlan.id} dietPlan={dietPlan} onUpdate={handleUpdateDietPlan} />
            ))
          ) : (
           <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 bg-muted/40 rounded-2xl shadow-sm border border-dashed border-muted-foreground/30">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 text-soft-coral mb-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6l4 2m6-4a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  <p className="text-xl font-medium text-soft-coral mb-2">
    No diet plans found
  </p>
  <p className="text-sm text-muted-foreground/70 mb-6 text-center max-w-sm">
    We couldn’t match any diet plans with your current criteria. Try adjusting your filters or exploring recommendations.
  </p>
</div>

          )}
        </div>
      </div>
    </div>
  )
}
