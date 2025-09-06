import type { Metadata } from "next";
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer";
import  NutritionistProvider  from "@/Providers/NutritionistsProvider";



export const metadata: Metadata = {
  title: "Nutritionists | Hygieia",
  description: "Comprehensive patient dashboard for managing health records, appointments, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
   <NutritionistProvider>
     <Navbar/>
     {children}
     <Footer />
     </NutritionistProvider>
   </>
  );
}
