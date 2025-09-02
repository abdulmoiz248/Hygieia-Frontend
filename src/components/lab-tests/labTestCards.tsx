
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Microscope } from "lucide-react"
import Link from "next/link"
import { LabTest } from "@/types/patient/lab"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
interface LabTestCardProps {
  test: LabTest
}



export function LabTestCard({ test }: LabTestCardProps) {
  const router=useRouter()
   const handleViewDetails = () => {
    // save the clicked test in localStorage
    localStorage.setItem("selectedLabTest", JSON.stringify(test))
    // navigate to details page
    router.push(`/lab-tests/${test.id}`)
  }
  return (
 
                 <Card
     key={test.id}
     className="group bg-white/40 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all py-3"
   >
     <CardContent className="px-4 space-y-2 py-2">
       <div className="flex justify-between items-center">
         <h4 className="font-semibold text-soft-blue text-base line-clamp-1">{test.name}</h4>
         <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-md bg-soft-coral text-snow-white">
           {test.category}
         </Badge>
       </div>
   
       <p className="text-sm text-gray-600 line-clamp-1">{test.description}</p>
   
       <div className="flex items-center justify-between text-sm text-gray-600 pt-1">
         <div className="flex items-center gap-2">
           <Clock className="h-4 w-4 text-soft-coral" />
           <span>{test.duration}</span>
         </div>
         <span className="font-semibold text-cool-gray">Rs.{test.price}</span>
       </div>
   
     
         <Button
           onClick={handleViewDetails}
           size="sm"
           className="w-full bg-transparent mb-1 border-soft-blue  text-soft-blue border-1 hover:bg-soft-blue hover:text-snow-white"
         >
           View Details
         </Button>
   
     </CardContent>
   </Card>
   
  
  )
}
