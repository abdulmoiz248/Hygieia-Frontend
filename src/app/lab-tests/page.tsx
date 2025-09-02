"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Beaker } from "lucide-react"
import { LabTestCard } from "@/components/lab-tests/labTestCards"

import { LabTest } from "@/types/patient/lab"
import { LabTestsFilters } from "@/components/lab-tests/LabTestFilters"

export const labTests: LabTest[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    description:
      "Comprehensive analysis of blood cells including red blood cells, white blood cells, and platelets to assess overall health.",
    price: 45,
    duration: "24 hours",
    category: "Hematology",
    preparation_instructions: [
      "No special preparation required",
      "Continue taking medications as prescribed",
      "Stay hydrated before the test",
    ],
  },
  {
    id: "2",
    name: "Lipid Profile",
    description: "Measures cholesterol levels and triglycerides to evaluate cardiovascular risk and heart health.",
    price: 65,
    duration: "12 hours",
    category: "Cardiology",
    preparation_instructions: [
      "Fast for 9-12 hours before the test",
      "Only water is allowed during fasting",
      "Take medications as usual unless advised otherwise",
    ],
  },
  {
    id: "3",
    name: "Thyroid Function Panel",
    description: "Comprehensive thyroid assessment including TSH, T3, and T4 to evaluate thyroid gland function.",
    price: 85,
    duration: "48 hours",
    category: "Endocrinology",
    preparation_instructions: ["No fasting required", "Inform about thyroid medications", "Best taken in the morning"],
  },
  {
    id: "4",
    name: "Comprehensive Metabolic Panel",
    description:
      "Evaluates kidney function, liver function, blood sugar, and electrolyte balance for overall metabolic health.",
    price: 75,
    duration: "24 hours",
    category: "General Health",
    preparation_instructions: ["Fast for 8-12 hours", "Water is allowed", "Continue essential medications"],
  },
  {
    id: "5",
    name: "Vitamin D Test",
    description: "Measures 25-hydroxyvitamin D levels to assess vitamin D status and bone health.",
    price: 55,
    duration: "24 hours",
    category: "Nutrition",
    preparation_instructions: [
      "No special preparation needed",
      "Can be taken any time of day",
      "Continue vitamin supplements",
    ],
  },
  {
    id: "6",
    name: "HbA1c (Diabetes Test)",
    description: "Measures average blood sugar levels over the past 2-3 months for diabetes monitoring and diagnosis.",
    price: 40,
    duration: "24 hours",
    category: "Endocrinology",
    preparation_instructions: ["No fasting required", "Can eat normally before test", "Continue diabetes medications"],
  },
]

export function getLabTestById(id: string): LabTest | undefined {
  return labTests.find((test) => test.id === id)
}

export function getLabTestsByCategory(category: string): LabTest[] {
  return labTests.filter((test) => test.category === category)
}

export function getAllCategories(): string[] {
  return [...new Set(labTests.map((test) => test.category))]
}




export default function LabTestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
//  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = getAllCategories()

const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

const filteredTests = labTests.filter((test) => {
  const matchesSearch = test.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  const matchesCategory =
    !selectedCategory || test.category === selectedCategory
  return matchesSearch && matchesCategory
})

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green  via-snow-white to-mint-green">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border/50">
        <div className="absolute inset-0  opacity-5" />
        <div className="relative container mx-auto px-4 pt-16 pb-5">
          <div className="text-center space-y-6">
           
            <h1 className="text-5xl font-bold text-dark-slate-gray mb-4 text-balance pt-7">
              Precision Lab Testing
              <span className="block text-soft-blue">For Your Health</span>
            </h1>
            <p className="text-xl text-cool-gray max-w-2xl mx-auto leading-relaxed">
              Discover our comprehensive range of laboratory tests designed with cutting-edge technology to provide
              accurate results for your health monitoring needs.
            </p>
              <LabTestsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />
          </div>
        </div>
         
      </div>

      <div className="container mx-auto px-4 py-12">

     


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTests.map((test) => (
            <LabTestCard key={test.id} test={test} />
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No tests found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
