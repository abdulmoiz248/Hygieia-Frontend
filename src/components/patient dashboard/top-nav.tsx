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
import {  useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/patient/store"
import {
 // addNotification,
//  markAsRead,
  markAllAsRead,
} from "@/types/patient/notificationSlice"
import { BellRing } from "./BellRing"

interface TopNavProps {
  onMobileMenuToggle: () => void
}


//when realtime use this to add  dispatch(addNotification(newNotificationPayload))



export function TopNav({ onMobileMenuToggle }: TopNavProps) {
  const notifications = useSelector((state: RootState) => state.notifications.notifications)
  const unreadCount = notifications.filter(n => n.unread).length
  const user = useSelector((state: RootState) => state.profile)
  const dispatch=useDispatch()

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
              <Button  variant="ghost" size="icon" className="relative">
               <BellRing className="w-5 h-5 "/>
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-soft-coral text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-soft-blue">Notifications</h3>
                <p className="text-sm text-cool-gray">{unreadCount} unread notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-4 cursor-pointer">
                    <div className="flex gap-3 w-full">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.unread ? "bg-soft-coral" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-cool-gray line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-cool-gray mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full bg-soft-blue text-snow-white" onClick={() => dispatch(markAllAsRead())}>
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
              <DropdownMenuItem className="text-soft-coral hover:text-snow-white hover:bg-soft-coral">
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
