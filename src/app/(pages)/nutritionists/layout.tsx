import type { Metadata } from "next";
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer";
import  NutritionistProvider  from "@/Providers/NutritionistsProvider";



export const metadata: Metadata = {
  title: "Nutritionists | Hygieia",
  description: "Complete list of all nutritionists available on Hygieia, with detailed profiles, patient reviews, and appointment booking options.",
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
