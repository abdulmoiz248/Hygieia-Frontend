import type { Metadata } from "next";
import Navbar from "@/components/layouts/landing-page/navbar";
import Footer from "@/components/layouts/landing-page/Footer";



export const metadata: Metadata = {
  title: "Hygieia | Login & Signup",
  description: "Access your Hygieia account or create a new one to experience personalized healthcare, AI diagnosis, and more.",
};


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
