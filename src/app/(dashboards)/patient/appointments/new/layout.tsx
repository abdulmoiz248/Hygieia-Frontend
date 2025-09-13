import  NutritionistProvider  from "@/Providers/NutritionistsProvider";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
   <NutritionistProvider>
    
     {children}
   
     </NutritionistProvider>
   </>
  );
}
