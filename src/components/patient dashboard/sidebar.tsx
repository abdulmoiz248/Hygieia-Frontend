"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Pill,
  Bot,
  Stethoscope,
  Activity,
  BookOpen,
  ChevronLeft,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed: boolean
  mobileMenuOpen: boolean
  onToggle: () => void
  onMobileToggle: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: FileText, label: "Medical Records", href: "/medical-records" },
  { icon: Pill, label: "Medicine Tracker", href: "/medicine-tracker" },
  { icon: BookOpen, label: "Health Journal", href: "/journal" },
  { icon: Bot, label: "Health Assistant", href: "/chatbot" },
  { icon: Stethoscope, label: "AI Diagnosis", href: "/ai-diagnosis" },
  { icon: Activity, label: "Fitness & Diet", href: "/fitness" },
]

export function Sidebar({ collapsed, mobileMenuOpen, onToggle, onMobileToggle }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[73px]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-transparent from-soft-blue to-mint-green rounded-xl flex items-center justify-center shadow-lg">
                <img src='/logo/logo.png' alt="logo" className="text-white font-bold text-lg"></img>
              </div>
              <div>
                <span className="font-bold text-xl text-soft-blue">Hygieia</span>
                <p className="text-xs text-cool-gray">Healthcare Platform</p>
              </div>
            </motion.div>
          )}
         
        </AnimatePresence>

        {/* Toggle button - always visible on desktop */}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg  transition-colors md:block hidden bg-soft-blue/10 hover:bg-soft-blue/20 flex-shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronLeft className="w-4 h-4 text-soft-blue" />
          </motion.div>
        </button>

        {/* Close button for mobile */}
        <button onClick={onMobileToggle} className="p-1 rounded-lg hover:bg-gray-100 transition-colors md:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
        const isActive = pathname === `/patient${item.href}`;
          const Icon = item.icon

          return (
            <Link key={`${item.href}-${index}`} href={`/patient/${item.href}`} onClick={() => mobileMenuOpen && onMobileToggle()}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group cursor-pointer",
                  isActive ? "bg-soft-blue/20 border-l-4 border-mint-green" : "hover:bg-gray-50",
                )}
                whileHover={{ x: collapsed ? 0 : 2 }}
                title={collapsed ? item.label : undefined}
              >
                <motion.div whileHover={{ rotate: 10 }} transition={{ duration: 0.2 }}>
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors flex-shrink-0",
                      isActive ? "text-soft-blue" : "text-cool-gray",
                    )}
                  />
                </motion.div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={cn("font-medium transition-colors", isActive ? "text-soft-blue" : "text-cool-gray")}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:block h-full flex-shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={onMobileToggle}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full w-80 z-50 md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
