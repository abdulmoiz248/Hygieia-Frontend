"use client"

import { motion } from "framer-motion"
import TestimonialStack from "./testimonial-stack"
import { useRouter } from "next/navigation"

export default function Testimonials() {
  const router=useRouter()
  return (
    <section className="py-24 bg-gradient-to-b from-snow-white to-mint-green relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-dark-slate-gray mb-4">What Our Users Say</h2>
          <p className="text-lg text-cool-gray max-w-2xl mx-auto">
            Real stories from people who have transformed their health journey with our platform
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full max-w-md"
          >
            <TestimonialStack
              cardDimensions={{ width: 320, height: 280 }}
              randomRotation={true}
              sensitivity={150}
              testimonials={[
                {
                  id: 1,
                  quote:
                    "This health platform transformed my wellness journey. The personalized recommendations and easy tracking tools have helped me achieve my health goals faster than I expected.",
                  name: "Sarah Johnson",
                  role: "Fitness Enthusiast",
                  rating: 5,
                  accentColor: "soft-blue",
                },
                {
                  id: 2,
                  quote:
                    "As someone with chronic health issues, this platform has been a game-changer. The symptom tracker and doctor connection features have made managing my condition so much easier.",
                  name: "Michael Chen",
                  role: "Patient Advocate",
                  rating: 5,
                  accentColor: "mint-green",
                },
                {
                  id: 3,
                  quote:
                    "The climate health feature is brilliant! I never realized how weather changes were affecting my allergies until I started using this app. Now I can plan ahead and feel better.",
                  name: "Priya Sharma",
                  role: "Allergy Sufferer",
                  rating: 4,
                  accentColor: "soft-coral",
                },
                {
                  id: 4,
                  quote:
                    "As a healthcare professional, I recommend this platform to all my patients. The educational resources and interactive tools help them understand their health better.",
                  name: "Dr. James Wilson",
                  role: "Family Physician",
                  rating: 5,
                  accentColor: "soft-blue",
                },
              ]}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="w-full max-w-md"
          >
            <TestimonialStack
              cardDimensions={{ width: 320, height: 280 }}
              randomRotation={true}
              sensitivity={150}
              testimonials={[
                {
                  id: 5,
                  quote:
                    "The blood donation feature connected me with a donor when my father needed emergency surgery. I'm forever grateful for this life-saving service.",
                  name: "Elena Rodriguez",
                  role: "Grateful Family Member",
                  rating: 5,
                  accentColor: "soft-coral",
                },
                {
                  id: 6,
                  quote:
                    "I've tried many health apps, but this one stands out for its holistic approach. It doesn't just track symptoms but helps understand the root causes of health issues.",
                  name: "Thomas Wright",
                  role: "Health Enthusiast",
                  rating: 4,
                  accentColor: "mint-green",
                },
                {
                  id: 7,
                  quote:
                    "The doctor quiz feature is not just fun but educational. I've learned so much about common health conditions and when to seek medical help.",
                  name: "Aisha Patel",
                  role: "Medical Student",
                  rating: 5,
                  accentColor: "soft-blue",
                },
                {
                  id: 8,
                  quote:
                    "As someone living with diabetes, the health tracking tools have been invaluable. The insights and patterns it reveals have helped me maintain better control.",
                  name: "Robert Kim",
                  role: "Diabetes Patient",
                  rating: 5,
                  accentColor: "mint-green",
                },
              ]}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg font-medium text-soft-blue">Join thousands of satisfied users today</p>
          <button  onClick={()=> router.push('/login')}
          className="mt-4 bg-gradient-to-r from-soft-blue to-mint-green text-snow-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Start Your Health Journey
          </button>
        </motion.div>
      </div>

      {/* Background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-soft-blue/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-mint-green/10 rounded-full blur-3xl opacity-50" />
    </section>
  )
}
