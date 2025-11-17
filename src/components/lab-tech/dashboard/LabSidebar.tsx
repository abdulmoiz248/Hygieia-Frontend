"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, LayoutDashboard, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useLabStore } from "@/store/lab-tech/labTech"

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  activeTab: string
  onTabChange: (tab: string) => void
    onMobileClose?: () => void
}

const sidebarItems = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "pending", label: "Pending Reports", icon: Clock },
  { id: "completed", label: "Completed Reports", icon: CheckCircle },
]

export default function LabSidebar({
  collapsed,
  setCollapsed,
  activeTab,
  onTabChange,
  onMobileClose,
}: SidebarProps) {

  const setactiveTab = useLabStore((state) => state.setActiveTab)
    const pathname = usePathname()
const router = useRouter()

const handleTabChange = (tab: string) => {
  if(pathname.includes('dashboard')){
     onTabChange(tab)
  }else{
  router.push(`/lab-technician/dashboard`)
  setactiveTab(tab)
  }

  if (onMobileClose) onMobileClose?.()
}
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen fixed left-0 top-0 flex-shrink-0 bg-white border-r border-gray-200 z-40"
    >
      <div className="flex flex-col h-full">
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
                <span className="font-bold text-xl text-soft-blue">Hygieia Lab</span>
                <p className="text-xs text-cool-gray">Healthcare Platform</p>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse button */}
          <button
            onClick={() => {
              setCollapsed(!collapsed)
             if (window.innerWidth < 768 && onMobileClose) {
      onMobileClose()
    }
            }

            }
            className="p-2 rounded-lg transition-colors bg-blue-50 hover:bg-blue-100 flex-shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronLeft className="w-4 h-4 text-soft-blue" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <motion.div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-blue-50 border-l-4 border-soft-blue"
                    : "hover:bg-gray-50",
                )}
                whileHover={{ x: collapsed ? 0 : 2 }}
                title={collapsed ? item.label : undefined}
                onClick={() => handleTabChange(item.id)}
              >
                <motion.div whileHover={{ rotate: 10 }} transition={{ duration: 0.2 }}>
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors flex-shrink-0",
                      isActive ? "text-soft-blue" : "text-gray-500",
                    )}
                  />
                </motion.div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={cn(
                        "font-medium transition-colors",
                        isActive ? "text-soft-blue" : "text-gray-500",
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </nav>

      </div>
    </motion.aside>
  )
}
