import { DashboardLayout } from "@/components/nutritionist/layout/DashboardLayout";
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
