"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Shield } from "lucide-react"
import { useFaqs } from "@/hooks/useFaqs"

export default function Faq() {
  const { data: faqs = [], isLoading, isError } = useFaqs()

  return (
    <section className="py-20 px-4 md:px-10 bg-gradient-to-b from-snow-white to-mint-green">
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

        <div className="bg-transparent rounded-2xl shadow-lg p-8">
          {isLoading ? (
            <p className="text-center text-gray-600">Loading FAQs...</p>
          ) : isError ? (
            <p className="text-center text-gray-600">Unable to load FAQs right now.</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id ?? index}
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
          )}

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
