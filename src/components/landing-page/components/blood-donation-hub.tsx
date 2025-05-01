"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Droplet, Users, Clock } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInView } from "react-intersection-observer"

const BloodDrop = ({ delay = 0, size = 20, left = "50%" }) => {
  return (
    <motion.div
      className="absolute"
      style={{ left }}
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: [null, 100, 120],
        opacity: [0, 1, 0],
        scale: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <svg width={size} height={size * 1.5} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 0C50 0 0 70 0 100C0 128 22 150 50 150C78 150 100 128 100 100C100 70 50 0 50 0Z"
          fill="oklch(0.65 0.25 10 / 0.7)" // soft-coral with opacity
        />
      </svg>
    </motion.div>
  )
}




export function BloodDonationHub() {
  const [isClient, setIsClient] = useState(false)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    setIsClient(true)
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const cardHoverVariants = {
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <section className="w-full py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-mint-green to-snow-white z-0" />

      {isClient && (
        <>
          <BloodDrop delay={0} size={30} left="10%" />
          <BloodDrop delay={1.5} size={20} left="20%" />
          <BloodDrop delay={1} size={25} left="30%" />
          <BloodDrop delay={2.5} size={15} left="70%" />
          <BloodDrop delay={0.5} size={22} left="80%" />
          <BloodDrop delay={2} size={18} left="90%" />
        </>
      )}

      <motion.div
        ref={ref}
        className="container px-4 md:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div className="flex flex-col items-center text-center mb-10" variants={itemVariants}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-soft-coral/20 text-soft-coral hover:bg-soft-coral/30">Life-Saving Feature</Badge>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="text-soft-coral relative">
              Blood Donation
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-soft-coral"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>{" "}
            Network
          </motion.h2>

          <motion.p
            className="text-cool-gray max-w-[800px] mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Connect with donors or find blood when you need it most. Our platform bridges the gap between blood donors
            and recipients, making the process seamless and efficient.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
            {[
              {
                icon: <Droplet className="h-6 w-6 text-soft-coral" />,
                title: "Quick Matching",
                desc: "Find compatible donors in your area within minutes",
              },
              {
                icon: <Users className="h-6 w-6 text-soft-coral" />,
                title: "Verified Donors",
                desc: "All donors are verified and health-screened",
              },
              {
                icon: <Clock className="h-6 w-6 text-soft-coral" />,
                title: "24/7 Availability",
                desc: "Emergency requests processed around the clock",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants} whileHover="hover" custom={index}>
                <motion.div
                  className="border border-soft-coral/10 pb-4 rounded-xl bg-snow-white/80 backdrop-blur-sm overflow-hidden h-full"
                  variants={cardHoverVariants}
                >
                  <CardContent className="pt-6 relative">
                    <motion.div
                      className="absolute top-0 right-0 w-24 h-24 bg-soft-coral/10 rounded-full -mt-12 -mr-12 z-0"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.7, 0.5],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="flex flex-col items-center relative z-10">
                      <motion.div
                        className="p-3 rounded-full bg-soft-coral/20 mb-4 relative"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 0 0 8px rgba(254, 202, 202, 0.4)",
                        }}
                      >
                        {item.icon}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(220, 38, 38, 0.4)",
                              "0 0 0 10px rgba(220, 38, 38, 0)",
                              "0 0 0 0 rgba(220, 38, 38, 0)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                      <h3 className="font-semibold mb-1 text-dark-slate-gray">{item.title}</h3>
                      <p className="text-sm text-cool-gray text-center">{item.desc}</p>
                    </div>
                  </CardContent>
                </motion.div>
              </motion.div>
            ))}
          </div>

        
        </motion.div>

        {/* Floating blood cells animation */}
        {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {isClient &&
            Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-soft-coral opacity-20"
                style={{
                  width: Math.random() * 20 + 10,
                  height: Math.random() * 20 + 10,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  x: [0, Math.random() * 50 - 25],
                  opacity: [0.2, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                }}
              />
            ))}
        </div> */}
      </motion.div>
    </section>
  )
}
