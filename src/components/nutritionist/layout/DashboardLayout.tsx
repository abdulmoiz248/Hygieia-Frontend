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
import { useNutritionistAppointment } from "@/hooks/nutritionist/useNitritionistAppointment"
import { useNutritionistDietPlan } from "@/hooks/nutritionist/useNutritionistDietPlan"

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

  //tanstack hook profile
  const { setAppointments ,setLoading} = useAppointmentStore()
  const { data:appointments, isLoading, isError:error1 } = useNutritionistAppointment(id, AppointmentStatus.Upcoming)
  

    useEffect(() => {

      if(appointments) {  
        setAppointments(appointments)
        setLoading(false)
      }

  }, [appointments])


  //tanstack hook profile
  const { data:profile, isLoading:isLoadingProfile, isError:error2 } = useNutritionistProfile(id, userRole)
  const {   setProfileData  } = useNutritionistStore()  



  useEffect(() => {
   
      if(profile && !isLoadingProfile){
         setProfileData(profile)
      }
      
  }, [profile])
  

  
 useEffect(()=>{
    const storedId = localStorage.getItem('id');
    const storedRole = localStorage.getItem('role');
    if(storedId)setId(storedId);
    if(storedRole)setUserRole(storedRole);
  },[])

    
    

  const { data:dietPlans, isLoading:isLoadingDietPlan, isError:error3 } = useNutritionistDietPlan(id)


  const {
  setDietPlansData,
  setLoading:isLoadingDietPlanStore,
  } = useDietPlanStore()


  
  useEffect(() => {
    if (dietPlans) {
      setDietPlansData(dietPlans)
      isLoadingDietPlanStore(false)
    }
  }, [dietPlans])






     const {fetchAnalytics } = useDashboardStore() 

       useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (isLoadingProfile || isLoading || isLoadingDietPlan || !profile || !dietPlans || !appointments) return   <Loader />
  



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
