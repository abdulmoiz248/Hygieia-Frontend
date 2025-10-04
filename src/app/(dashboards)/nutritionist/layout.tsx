import { DashboardLayout } from "@/components/nutritionist/layout/DashboardLayout";
import ReactQueryProvider from "@/Providers/BlogsQueryProvider";
import type { Metadata } from "next";




export const metadata: Metadata = {
  title: "Nutritionist | Hygieia",
  description: "Comprehensive nutritionist dashboard for managing diet plans, client progress, and consultations.",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>

<ReactQueryProvider>
    <DashboardLayout>
     {children}
     </DashboardLayout>

   </ReactQueryProvider>
    </>
  );
}
