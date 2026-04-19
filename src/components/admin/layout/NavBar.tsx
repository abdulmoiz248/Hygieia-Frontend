"use client"

import { Menu, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { useAdminProfile } from "@/hooks/admin/dashboard/useAdminProfile"
import { useAdminStore }   from "@/store/admin/useAdminStore"

interface TopNavProps {
  onMobileMenuToggle: () => void
}

/** Returns true if the string looks like an email address */
function looksLikeEmail(str: string): boolean {
  return str.includes("@")
}

/** Derive up-to-2-character initials from a display name */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function TopNav({ onMobileMenuToggle }: TopNavProps) {
  const { data: profile } = useAdminProfile()
  const clearAuth         = useAdminStore((s) => s.clearAuth)

  // Prefer profile.name; if the backend returned the email instead, fall back to "Admin"
  const rawName      = profile?.name?.trim() ?? ""
  const userName     = rawName && !looksLikeEmail(rawName) ? rawName : "Admin"
  const userInitials = getInitials(userName)

  const handleLogout = () => {
    clearAuth()                // clears cookies + zustand state
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = "/login"
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-[73px] flex items-center flex-shrink-0">
  <div className="flex items-center justify-between w-full">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-2">
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
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-3">
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
          <DropdownMenuItem
            onClick={handleLogout}
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
