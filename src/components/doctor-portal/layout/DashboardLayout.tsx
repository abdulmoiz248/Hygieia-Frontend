"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { DoctorSidebar } from "./Sidebar"
import { DoctorTopNav } from "./Navbar"
import useDoctorStore from "@/store/doctor/doctor-store"
import { useDoctorAppointmentStore } from "@/store/doctor/doctor-appointment-store"
import { useDoctorPrescriptionStore } from "@/store/doctor/doctor-prescription-store"
import { useDoctorDashboardStore } from "@/store/doctor/doctor-dashboard-store"
import Loader from "@/components/loader/loader"
import { useDoctorProfile } from "@/hooks/doctor/useDoctorProfile"
import { useDoctorAppointment } from "@/hooks/doctor/useDoctorAppointment"
import { useDoctorPrescription } from "@/hooks/doctor/useDoctorPrescription"
import { useDoctorDashboard } from "@/hooks/doctor/useDoctorDashboard"
import { AppointmentStatus } from "@/store/doctor/doctor-appointment-store"

interface DoctorDashboardLayoutProps {
  children: React.ReactNode
}

export function DoctorDashboardLayout({ children }: DoctorDashboardLayoutProps) {
  const [id, setId] = useState<string>("")
  const [userRole, setUserRole] = useState<string>("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pathname = usePathname()
  const isChatPage = pathname?.startsWith("/doctor/chat")

  // Read from localStorage once on mount
  useEffect(() => {
    const storedId = localStorage.getItem("id")
    const storedRole = localStorage.getItem("role")
    if (storedId) setId(storedId)
    if (storedRole) setUserRole(storedRole)
  }, [])

  // ── Profile ──────────────────────────────────────────────────
  const { data: profile, isLoading: isLoadingProfile, isError: error1 } =
    useDoctorProfile(id, userRole)
  const { setProfileData } = useDoctorStore()

  useEffect(() => {
    if (profile && !isLoadingProfile) {
      setProfileData(profile)
    }
  }, [profile])

  // ── Appointments ─────────────────────────────────────────────
  const { setAppointments, setLoading: setAppointmentLoading } =
    useDoctorAppointmentStore()
  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    isError: error2,
  } = useDoctorAppointment(id, AppointmentStatus.Upcoming)

  useEffect(() => {
    if (appointments) {
      setAppointments(appointments)
      setAppointmentLoading(false)
    }
  }, [appointments])

  // ── Prescriptions ─────────────────────────────────────────────
  const { setPrescriptionsData, setLoading: setPrescriptionLoading } =
    useDoctorPrescriptionStore()
  const {
    data: prescriptions,
    isLoading: isLoadingPrescriptions,
    // Not a hard error — prescription API may not be ready yet
  } = useDoctorPrescription(id)

  useEffect(() => {
    if (prescriptions) {
      setPrescriptionsData(prescriptions)
      setPrescriptionLoading(false)
    }
  }, [prescriptions])

  // ── Dashboard analytics ───────────────────────────────────────
  const { setDashboardData } = useDoctorDashboardStore()
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    isError: error4,
  } = useDoctorDashboard(id)

  useEffect(() => {
    if (dashboardData) {
      setDashboardData(dashboardData.patientData, dashboardData.appointmentData)
    }
  }, [dashboardData])

  // ── Guards ────────────────────────────────────────────────────
  // Only block on errors we actually care about (prescriptions API may not exist yet)
  if (error1 || error2 || error4)
    throw new Error("Failed to load doctor data")

  // Block render until critical data is ready (prescriptions are optional)
  if (
    isLoadingProfile ||
    isLoadingAppointments ||
    isLoadingDashboard ||
    !profile ||
    !appointments
  )
    return <Loader />

  return (
    <div className="flex h-screen bg-snow-white">
      <DoctorSidebar
        collapsed={sidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <DoctorTopNav
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
            isChatPage ? "p-0" : "p-4 lg:p-6"
          }`}
        >
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}