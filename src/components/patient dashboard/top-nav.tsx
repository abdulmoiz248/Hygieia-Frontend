"use client"
import { Search, Menu,  User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { BellRing } from "../ui/BellRing"
import { useRouter } from "next/navigation"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { useNotifications } from "@/hooks/patient/useNotifications"
import { timeAgo } from "@/helpers/formatTimeAgo"
import api from "@/lib/axios"
import { useEffect, useState } from "react"

interface TopNavProps {
  onMobileMenuToggle: () => void
}


//when realtime use this to add  dispatch(addNotification(newNotificationPayload))



export function TopNav({ onMobileMenuToggle }: TopNavProps) {

  
  const router = useRouter()
  const user = usePatientProfileStore((state) => state.profile)
  const { notifications, markAsRead } = useNotifications(user.id)
  const [unreadCount, setUnreadCount] = useState(notifications ? notifications.filter(n => !n.is_read).length : 0)

  const parseAction = (action: string | null) => {
    if (!action) return null

    try {
      const parsed = JSON.parse(action)
      return parsed && typeof parsed === "object" ? parsed : null
    } catch {
      const normalized = action.toLowerCase().replace(/[\s_-]+/g, "")
      if (normalized.includes("labtest")) return { type: "lab-test" }
      if (normalized.includes("followup")) return { type: "follow-up" }
      return { type: action }
    }
  }

  const extractQuotedText = (text: string) => text.match(/"([^"]+)"/)?.[1] ?? ""

  const handleNotificationClick = (notification: (typeof notifications)[number]) => {
    markAsRead(notification.id)

    const action = parseAction(notification.action)
    const combinedText = `${notification.title} ${notification.notification_msg}`.toLowerCase()

    const isLabTest =
      action?.type === "lab-test" ||
      action?.type === "lab_test" ||
      combinedText.includes("lab test") ||
      combinedText.includes("test referred")

    if (isLabTest) {
      const testName =
        action?.testName ||
        action?.test_name ||
        action?.name ||
        extractQuotedText(notification.notification_msg) ||
        extractQuotedText(notification.title)

      const testId = action?.testId || action?.test_id || action?.id || "notification"

      if (testName) localStorage.setItem("notification_lab_test_name", String(testName))
      localStorage.setItem("notification_booking_source", "lab-test-notification")

      const params = new URLSearchParams()
      if (testName) params.set("testName", String(testName))
      params.set("source", "notification")
      router.push(`/patient/lab-tests/book/${encodeURIComponent(String(testId))}?${params.toString()}`)
      return
    }

    const isFollowUp =
      action?.type === "follow-up" ||
      action?.type === "follow_up" ||
      combinedText.includes("follow-up") ||
      combinedText.includes("follow up")

    if (isFollowUp) {
      const params = new URLSearchParams()
      const doctorId = action?.doctorId || action?.doctor_id || action?.providerId || action?.provider_id || ""
      let doctorName = action?.doctorName || action?.doctor_name || action?.providerName || action?.provider_name || ""

      // If backend didn't provide a name, try to extract it from the notification message/title
      if (!doctorId && !doctorName) {
        const msg = notification.notification_msg || ""
        const title = notification.title || ""
        const nameMatch = msg.match(/(?:doctor|nutritionist)\s+(.+?)\s+(?:has|has requested|requested|wants|would)/i)
        if (nameMatch && nameMatch[1]) {
          doctorName = nameMatch[1].replace(/[".]/g, "").trim()
        } else {
          const quoted = extractQuotedText(msg) || extractQuotedText(title)
          if (quoted) doctorName = quoted
        }
      }

      if (doctorId) params.set("doctorId", String(doctorId))
      if (doctorName) params.set("doctorName", String(doctorName))
      params.set("type", "follow-up")
      params.set("reason", action?.reason || "Follow-up requested")

      localStorage.setItem("appointment_prefill_type", "follow-up")
      localStorage.setItem("appointment_prefill_reason", action?.reason || "Follow-up requested")
      if (doctorId) localStorage.setItem("appointment_prefill_doctor_id", String(doctorId))
      if (doctorName) localStorage.setItem("appointment_prefill_doctor_name", String(doctorName))

      try {
        // eslint-disable-next-line no-console
        console.debug("[notification] follow-up prefill", {
          parsedAction: action,
          doctorId: doctorId,
          doctorName: doctorName,
          params: params.toString(),
          title: notification.title,
          message: notification.notification_msg,
          stored_doctor_id: typeof window !== 'undefined' ? localStorage.getItem('appointment_prefill_doctor_id') : null,
          stored_doctor_name: typeof window !== 'undefined' ? localStorage.getItem('appointment_prefill_doctor_name') : null,
        })
      } catch  {}

      router.push(`/patient/appointments/new?${params.toString()}`)
    }
  }


    const markAllAsRead = async () => {
    if (!user?.id || unreadCount === 0) return
    api.patch(`/notifications/mark-read/${user.id}`)
    notifications?.forEach((notification) => {
          notification.is_read = true
        })
        setUnreadCount(0) 
  }


  
   useEffect(() => {
    setUnreadCount(notifications ? notifications.filter(n => !n.is_read).length : 0)
  }, [notifications])
  

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full">
          <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>

          <div className="md:hidden flex items-center gap-2">
            <Image src="/logo/logo.png" alt="Hygieia Logo" width={32} height={32} />
            <span className="font-semibold text-lg">Hygieia</span>
          </div>

          <div className="hidden md:flex w-full max-w-md">
            <Button
              variant="outline"
              asChild
              className="flex w-full justify-start items-center gap-2 bg-gray-50 hover:bg-gray-100 border-0"
            >
              <Link href="/doctors">
                <Search className="w-4 h-4 text-soft-blue" />
                <span className="hidden sm:inline text-soft-blue">Search Doctors</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/patient/search">
                <Search className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className=" rounded-5" asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellRing className="w-5 h-5 " />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-soft-coral text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[22rem] max-w-[calc(100vw-1rem)] bg-white p-0 flex flex-col overflow-hidden shadow-lg rounded-2xl"
              style={{ maxHeight: "min(70vh, calc(100vh - 80px))" }}
            >
              <div className="p-3 border-b flex-shrink-0">
                <h3 className="font-semibold text-soft-blue">Notifications</h3>
                <p className="text-sm text-cool-gray">{unreadCount} unread notifications</p>
              </div>
              <div className="overflow-y-auto flex-1 min-h-0">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="p-4 cursor-pointer focus:bg-gray-50 whitespace-normal h-auto items-start text-left"
                    onSelect={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3 w-full">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          !notification.is_read ? "bg-soft-coral" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-cool-gray whitespace-normal break-words">
                          {notification.notification_msg}
                        </p>
                        <p className="text-xs text-cool-gray mt-1">{timeAgo(notification.created_at)}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t flex-shrink-0">
                <Button
                  size="sm"
                  className="w-full bg-soft-blue text-snow-white hover:bg-soft-blue/90"
                  onClick={() => markAllAsRead()}
                >
                  Mark All As Read
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu >
            <DropdownMenuTrigger  asChild>
              <Button variant="ghost" className="flex items-center gap-2 ">
                <Avatar className="w-8 h-8">
                  {user.avatar?.trim() ? (
                    <AvatarImage src={user.avatar} />
                  ) : (
                    <AvatarFallback className=" border p-2 bg-soft-blue text-white">{userInitials}</AvatarFallback>

                  )}
                </Avatar>
                <span className="hidden sm:block">{user.name}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white ">
              <DropdownMenuItem asChild className="hover:bg-mint-green hover:text-snow-white">
                <Link href="/patient/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-mint-green hover:text-snow-white">
                <Link href="/patient/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
             <DropdownMenuItem
  onClick={() => {
    // clear localStorage + sessionStorage
    localStorage.clear()
    sessionStorage.clear()

    // clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })

    // optional: redirect to login
    window.location.href = "/login"
  }}
  className="text-soft-coral hover:text-snow-white hover:bg-soft-coral"
>
  <LogOut className="w-4 h-4 mr-2" />
  Logout
</DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}