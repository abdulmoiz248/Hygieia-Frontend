import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/lab-tech/app-sidebar"
import { Header } from "@/components/lab-tech/header"
import "./globals.css"


export const metadata = {
  title: "Hygieia Lab Portal",
  description: "Laboratory Technician Portal for Hygieia",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-4 md:p-6 bg-gradient-to-br from-background to-muted/30">{children}</main>
            </div>
          </div>
        </SidebarProvider>
    
  )
}
