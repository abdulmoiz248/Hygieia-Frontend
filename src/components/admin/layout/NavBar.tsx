"use client"

import { Search, Menu, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { BellRing } from "@/components/ui/BellRing"
import { useState, useEffect } from "react"

interface TopNavProps {
  onMobileMenuToggle: () => void
}

export function TopNav({ onMobileMenuToggle }: TopNavProps) {
  const [userName, setUserName] = useState("Admin")
  const [userId, setUserId] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const id = localStorage.getItem("id")
    const role = localStorage.getItem("role")

    if (id) setUserId(id)
    if (role === "admin") setUserName("Admin")
  }, [])

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5 flex-shrink-0">
      <div className="flex items-center justify-between">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="md:hidden flex items-center gap-2">
            <Image src="/logo/logo.png" alt="Hygieia Logo" width={32} height={32} />
            <span className="font-semibold text-lg">Hygieia</span>
          </div>

          {/* Search (keep UI same, route can change later) */}
          <div className="hidden md:flex w-full max-w-md">
            <Button
              variant="outline"
              asChild
              className="flex w-full justify-start items-center gap-2 bg-gray-50 hover:bg-gray-100 border-0"
            >
              <Link href="#">
                <Search className="w-4 h-4 text-soft-blue" />
                <span className="hidden sm:inline text-soft-blue">
                  Search...
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* Notifications (UI only for now) */}
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

            <DropdownMenuContent align="end" className="w-80 bg-white overflow-hidden">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-soft-blue">Notifications</h3>
                <p className="text-sm text-cool-gray">
                  {unreadCount} unread notifications
                </p>
              </div>

              <div className="p-4 text-sm text-center text-cool-gray">
                No notifications yet
              </div>

              <div className="p-2 border-t">
                <Button size="sm" className="w-full bg-soft-blue text-snow-white">
                  Mark All As Read
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* USER DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="border p-2 bg-soft-blue text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block">{userName}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-white">
              
              {/* ONLY LOGOUT */}
              <DropdownMenuItem
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()

                  document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                      .replace(/^ +/, "")
                      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
                  })

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