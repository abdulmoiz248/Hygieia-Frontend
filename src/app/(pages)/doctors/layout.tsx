import type { Metadata } from "next";
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer";



export const metadata: Metadata = {
  title: "Doctors | Hygieia",
  description: "Complete list of all doctors available on Hygieia, with detailed profiles, patient reviews, and appointment booking options.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
  
     <Navbar/>
     {children}
     <Footer />
   
   </>
  );
}
