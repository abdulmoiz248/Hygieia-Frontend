import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function NewAppointmentHeader() {
  return (
      <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Button  size="icon" className="text-white bg-soft-blue hover:bg-soft-blue/90 " asChild>
              <Link href="/patient/appointments">
                <ArrowLeft className="w-4 h-4  " />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-soft-coral">Book New Appointment</h1>
              <p className="text-cool-gray">Schedule your consultation with a healthcare professional</p>
            </div>
          </motion.div>
  )
}
