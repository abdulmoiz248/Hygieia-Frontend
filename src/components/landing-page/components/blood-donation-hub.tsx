"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Heart, Droplet, Users, Clock, ChevronRight, Search, AlertCircle, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useInView } from "react-intersection-observer"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

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
          fill="rgba(220, 38, 38, 0.7)"
        />
      </svg>
    </motion.div>
  )
}

const PulsingCircle = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="absolute rounded-full bg-red-500 opacity-20"
        initial={{ scale: 0.5, opacity: 0.2 }}
        animate={{
          scale: [0.5, 1.5, 0.5],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width: "80%", height: "80%" }}
      />
      <motion.div
        className="absolute rounded-full bg-red-500 opacity-20"
        initial={{ scale: 0.7, opacity: 0.2 }}
        animate={{
          scale: [0.7, 1.7, 0.7],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 3,
          delay: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width: "80%", height: "80%" }}
      />
    </div>
  )
}

const HeartbeatLine = () => {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-white"
        animate={{
          x: ["0%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

export function BloodDonationHub() {
  const [activeTab, setActiveTab] = useState("donate")
  const [hoveredType, setHoveredType] = useState<string | null>(null)
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
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50 z-0" />

      {/* Animated background elements */}
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
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-200">Life-Saving Feature</Badge>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="text-red-600 relative">
              Blood Donation
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-red-600"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>{" "}
            Network
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-[800px] mb-8 text-lg"
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
                icon: <Droplet className="h-6 w-6 text-red-600" />,
                title: "Quick Matching",
                desc: "Find compatible donors in your area within minutes",
              },
              {
                icon: <Users className="h-6 w-6 text-red-600" />,
                title: "Verified Donors",
                desc: "All donors are verified and health-screened",
              },
              {
                icon: <Clock className="h-6 w-6 text-red-600" />,
                title: "24/7 Availability",
                desc: "Emergency requests processed around the clock",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants} whileHover="hover" custom={index}>
                <motion.div
                  className="border border-red-100 rounded-xl bg-white/80 backdrop-blur-sm overflow-hidden h-full"
                  variants={cardHoverVariants}
                >
                  <CardContent className="pt-6 relative">
                    <motion.div
                      className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mt-12 -mr-12 z-0"
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
                        className="p-3 rounded-full bg-red-100 mb-4 relative"
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
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 text-center">{item.desc}</p>
                    </div>
                  </CardContent>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div className="w-full max-w-3xl" variants={itemVariants}>
            <Tabs defaultValue="donate" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-8 relative">
                <motion.div
                  className="absolute h-full bg-red-600 rounded-md z-0"
                  initial={false}
                  animate={{
                    x: activeTab === "donate" ? 0 : "100%",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ width: "50%" }}
                />
                <TabsTrigger
                  value="donate"
                  className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:text-white"
                >
                  I Want to Donate
                </TabsTrigger>
                <TabsTrigger
                  value="receive"
                  className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:text-white"
                >
                  I Need Blood
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="donate" className="mt-0">
                    <Card className="border-red-100 overflow-hidden">
                      <CardContent className="pt-6 relative">
                        <motion.div
                          className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full -mt-20 -mr-20 z-0"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                        <div className="space-y-4 relative z-10">
                          <motion.h3
                            className="text-xl font-semibold text-center mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            Become a Lifesaver
                          </motion.h3>
                          <motion.p
                            className="text-gray-600 text-center mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                          >
                            Your donation can save up to 3 lives. Join our network of heroes making a difference.
                          </motion.p>

                          <motion.div
                            className="flex flex-wrap justify-center gap-3 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            {bloodTypes.map((type, index) => (
                              <motion.div
                                key={type}
                                className={`relative cursor-pointer p-3 rounded-full border ${
                                  hoveredType === type ? "border-red-600 bg-red-50" : "border-gray-200"
                                }`}
                                onMouseEnter={() => setHoveredType(type)}
                                onMouseLeave={() => setHoveredType(null)}
                                whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(220, 38, 38, 0.15)" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  transition: { delay: 0.1 + index * 0.05, duration: 0.3 },
                                }}
                              >
                                <span
                                  className={`font-bold ${hoveredType === type ? "text-red-600" : "text-gray-700"}`}
                                >
                                  {type}
                                </span>
                                <AnimatePresence>
                                  {hoveredType === type && (
                                    <motion.div
                                      className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 5 }}
                                    >
                                      {type === "O-"
                                        ? "Universal donor"
                                        : type === "AB+"
                                          ? "Universal recipient"
                                          : `Compatible with ${type.includes("+") ? "+" : ""} types`}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))}
                          </motion.div>

                          <motion.div
                            className="flex flex-col sm:flex-row gap-3 justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          >
                            <Button className="bg-red-600 hover:bg-red-700 relative overflow-hidden group">
                              <motion.span
                                className="absolute inset-0 bg-red-700"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.5 }}
                              />
                              <span className="relative z-10">
                                Register as Donor
                                <ChevronRight className="ml-2 h-4 w-4 inline" />
                              </span>
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 relative overflow-hidden"
                            >
                              <motion.span
                                className="absolute inset-0 bg-red-50"
                                initial={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{ borderRadius: "inherit", originX: 0.5, originY: 0.5 }}
                              />
                              <span className="relative z-10">Learn About Eligibility</span>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="receive" className="mt-0">
                    <Card className="border-red-100 overflow-hidden">
                      <CardContent className="pt-6 relative">
                        <motion.div
                          className="absolute top-0 left-0 w-40 h-40 bg-red-50 rounded-full -mt-20 -ml-20 z-0"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                        <div className="space-y-4 relative z-10">
                          <motion.h3
                            className="text-xl font-semibold text-center mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            Find Blood Quickly
                          </motion.h3>
                          <motion.p
                            className="text-gray-600 text-center mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                          >
                            Our network connects you with compatible donors in your area for urgent needs.
                          </motion.p>

                          <motion.div
                            className="relative mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <motion.input
                              type="text"
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                              placeholder="Enter your location to find nearby donors"
                              whileFocus={{ boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.2)" }}
                            />
                          </motion.div>

                          <motion.div
                            className="flex flex-col sm:flex-row gap-3 justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <Button className="bg-red-600 hover:bg-red-700 relative overflow-hidden group">
                              <motion.span
                                className="absolute inset-0 bg-red-700"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.5 }}
                              />
                              <span className="relative z-10 flex items-center">
                                Request Blood Now
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                                  className="ml-2"
                                >
                                  <AlertCircle className="h-4 w-4 inline" />
                                </motion.div>
                              </span>
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 relative overflow-hidden"
                            >
                              <motion.span
                                className="absolute inset-0 bg-red-50"
                                initial={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{ borderRadius: "inherit", originX: 0.5, originY: 0.5 }}
                              />
                              <span className="relative z-10">Schedule for Later</span>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </motion.div>

        <motion.div className="mt-16 relative" variants={itemVariants}>
          <motion.div
            className="absolute -top-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="bg-white shadow-lg rounded-full p-3 border border-red-100">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
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

          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-8 rounded-xl shadow-lg border border-red-100 relative overflow-hidden"
            whileHover={{
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ duration: 0.3 }}
          >
            <HeartbeatLine />

            <div className="flex-1 relative z-10">
              <motion.div
                className="flex items-center mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="h-6 w-6 text-red-600 mr-2" />
                </motion.div>
                <h3 className="text-xl font-semibold">Blood Donation Impact</h3>
              </motion.div>

              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Every 2 seconds, someone in the world needs blood. A single donation can save up to 3 lives.
              </motion.p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "10,000+", label: "Registered Donors" },
                  { value: "5,000+", label: "Lives Saved" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.p
                      className="text-3xl font-bold text-red-600"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: index * 1.5,
                      }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="flex-1 relative h-[250px] w-full md:h-[280px] rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg overflow-hidden flex items-center justify-center">
                <PulsingCircle />

                <div className="relative z-10 text-white text-center p-6">
                  <motion.h3
                    className="text-2xl font-bold mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Donate Today
                  </motion.h3>

                  <motion.p
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    Be someone's hero. No cape required.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-red-600 relative overflow-hidden"
                    >
                      <motion.span
                        className="absolute inset-0 bg-white"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ borderRadius: "inherit", originX: 0.5, originY: 0.5 }}
                      />
                      <span className="relative z-10">Join Our Community</span>
                    </Button>
                  </motion.div>
                </div>

                <div className="absolute inset-0 opacity-20">
                  <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="5" cy="5" r="2" fill="white" />
                      </pattern>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                      </linearGradient>
                    </defs>
                    <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#dots)" />
                    <path d="M0,50 Q25,30 50,50 T100,50" stroke="url(#grad)" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating blood cells animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {isClient &&
            Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-red-500 opacity-20"
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
        </div>
      </motion.div>
    </section>
  )
}
