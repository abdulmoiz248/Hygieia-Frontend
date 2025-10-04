"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "./SideBar"
import { TopNav } from "./NavBar"
import useNutritionistStore from "@/store/nutritionist/userStore"
import { AppointmentStatus } from "@/types/patient/appointment"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { useDietPlanStore } from "@/store/nutritionist/diet-plan-store"
import { useDashboardStore } from "@/store/nutritionist/dashboard-store"
import Loader from "@/components/loader/loader"
import { useNutritionistProfile } from "@/hooks/nutritionist/useNutritionistProfile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
//id,role
  const [id,setId]=useState<string>('')
  const [userRole,setUserRole]=useState<string>('')

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isChatPage = pathname?.startsWith("/nutritionist/chat")

  const { appointments,fetchAppointments,isLoading } = useAppointmentStore()

  //tanstack hook
  const { data:profile, isLoading:isLoadingProfile, isError:error } = useNutritionistProfile(id, userRole)
  const {   setProfileData ,profile:p2 } = useNutritionistStore()  

  useEffect(() => {
   
      if(!profile || !isLoadingProfile){
         setProfileData(profile)
      }
      
  }, [profile])
  
  useEffect(() => {
       if(appointments.length==0)
          fetchAppointments(AppointmentStatus.Upcoming)  
        
  }, [fetchAppointments])
  
 useEffect(()=>{
    const storedId = localStorage.getItem('id');
    const storedRole = localStorage.getItem('role');
    if(storedId)setId(storedId);
    if(storedRole)setUserRole(storedRole);
  },[])

    
    





const {
    dietPlans,
    fetchDietPlans,
  
    isLoading:isLoadingDietPlan,
  } = useDietPlanStore()


  
  useEffect(() => {
      if(dietPlans.length==0 && profile?.id) fetchDietPlans(profile?.id)
    }, [profile, fetchDietPlans])


     const {fetchAnalytics } = useDashboardStore() 

       useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (isLoadingProfile || isLoading || isLoadingDietPlan || !profile) return   <Loader />
  



  return (
    <div className="flex h-screen bg-snow-white">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <TopNav onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
            isChatPage ? "p-0 " : "p-4 lg:p-6"
          }`}
        >
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
