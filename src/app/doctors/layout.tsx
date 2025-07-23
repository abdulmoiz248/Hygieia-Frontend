
import Footer from "@/components/layouts/landing-page/Footer";
import Navbar from "@/components/layouts/landing-page/navbar";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Doctors | Hygieia",
  description: "Explore and connect with verified doctors. Filter by specialization, location, availability, and more to find the right healthcare provider.",
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
     <Footer/>
   </>
  );
}
