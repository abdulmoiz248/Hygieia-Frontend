import { DashboardLayout } from "@/components/patient dashboard/dashboard-layout";
import type { Metadata } from "next";

import { PatientProvider } from "@/Providers/PatientProvider";
import { PatientToastContainer } from "@/toasts/PatientToast";



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
  <PatientProvider>
    <PatientToastContainer/>
    <DashboardLayout>
     {children}
     </DashboardLayout>
   </PatientProvider>
   </>
  );
}
