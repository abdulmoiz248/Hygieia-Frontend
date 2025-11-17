"use client"

import { Menu, User, Settings, LogOut, ChevronDown } from "lucide-react"
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
import Image from "next/image"
import Link from "next/link"
import useLabTechnicianStore from "@/store/lab-tech/userStore"
import { BellRing } from "@/components/ui/BellRing"
import { UseQueryResult } from "@tanstack/react-query"
import { Notification } from "@/hooks/lab-tech/useLabTechNotifications"
import useLabTechNotifications from "@/hooks/lab-tech/useLabTechNotifications"
import { timeAgo } from "@/helpers/formatTimeAgo"
import api from "@/lib/axios"

export function LabHeader({ onMobileMenuClick }: { onMobileMenuClick?: () => void }) {
  const { profile } = useLabTechnicianStore()



    const {
      data: notifications,
    }: UseQueryResult<Notification[]> = useLabTechNotifications(profile?.id || "")


    const markAllAsRead = async () => {
        if (!profile?.id || unreadCount === 0) return
        await api.patch(`/notifications/mark-read/${profile.id}`)
        notifications?.forEach((notification) => {
          notification.is_read = true
        })
      }


    const unreadCount = notifications
    ? notifications.filter((n) => !n.is_read).length
    : 0

const safeProfile = profile ?? { name: "user" }

const userInitials = (safeProfile.name || "user")
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()


  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5 flex-shrink-0 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuClick}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="md:hidden flex items-center gap-2">
            <Image src="/logo/logo.png" alt="Hygieia Logo" width={32} height={32} />
            <span className="font-semibold text-lg">Hygieia</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellRing className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-soft-coral text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
        
          <DropdownMenuContent
            align="end"
            className="w-80 bg-white p-0 overflow-hidden shadow-lg rounded-2xl"
            sideOffset={8}
          >
            <div className="sticky top-0 z-10 bg-white p-3 border-b">
              <h3 className="font-semibold text-soft-blue">Notifications</h3>
              <p className="text-sm text-cool-gray">{unreadCount} unread notifications</p>
            </div>
        
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications?.length ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="p-4 cursor-pointer focus:bg-mint-green/10"
                  >
                    <div className="flex gap-3 w-full">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          !notification.is_read ? "bg-soft-coral" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-cool-gray line-clamp-2">
                          {notification.notification_msg}
                        </p>
                        <p className="text-xs text-cool-gray mt-1">
                          {timeAgo(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-sm text-center text-cool-gray">
                  no notifications
                </div>
              )}
            </div>
        
            <div className="sticky bottom-0  p-2 border-t">
              <Button
             
                size="sm"
                className="w-full bg-soft-blue text-snow-white hover:bg-soft-coral"
                onClick={() => markAllAsRead()}
              >
                Mark All As Read
              </Button>
            </div>
          </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.img || "/default-avatar.png"} />
                  <AvatarFallback className="border p-2 bg-soft-blue text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block">{profile?.name || 'user'}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem asChild className="hover:bg-mint-green hover:text-snow-white">
                <Link href="/lab-technician/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-mint-green hover:text-snow-white">
                <Link href="/lab-technician/settings">
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
