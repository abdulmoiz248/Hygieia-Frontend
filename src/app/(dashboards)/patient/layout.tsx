import { DashboardLayout } from "@/components/patient dashboard/dashboard-layout";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Patient | Hygieia",
  description: "Comprehensive patient dashboard for managing health records, appointments, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
    <DashboardLayout>
     {children}
     </DashboardLayout>
   </>
  );
}
