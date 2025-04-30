"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Shield } from "lucide-react"

const faqs = [
  {
    question: "How accurate is Hygieia's AI diagnosis?",
    answer:
      "Hygieia's AI has been trained on millions of medical records and achieves a 95% accuracy rate for common conditions. However, it's designed to be a preliminary assessment tool, not a replacement for professional medical advice.",
  },
  {
    question: "Is my health data secure and private?",
    answer:
      "Absolutely. Hygieia is HIPAA-compliant and uses end-to-end encryption to protect your data. We never share your personal health information with third parties without your explicit consent.",
  },
  {
    question: "Can Hygieia prescribe medication?",
    answer:
      "Hygieia can suggest over-the-counter remedies for common conditions, but prescription medications require consultation with a licensed healthcare provider through our telehealth service.",
  },
  {
    question: "How does the Health Score Quiz work?",
    answer:
      "Our Health Score Quiz uses a proprietary algorithm that evaluates your lifestyle factors, symptoms, and health history to generate a personalized score. This score helps identify areas for improvement and tracks your progress over time.",
  },
  {
    question: "Is Hygieia available worldwide?",
    answer:
      "Hygieia is currently available in 120+ countries. Some features may vary by region due to local healthcare regulations. Check our regional availability page for specific details about your location.",
  },
]

export default function Faq() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <section className="py-20 px-4 md:px-10 bg-gradient-to-br from-[#f8fafc] to-[#e2f1ff]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0c2842] mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Find answers to common questions about Hygieia</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-100 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors duration-300 text-[#0c2842] font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 p-4 bg-[#2A5C82]/5 rounded-lg flex items-center justify-center"
          >
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-[#2A5C82] mr-3" />
              <span className="text-[#2A5C82] font-medium">HIPAA-Compliant & Secure</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
