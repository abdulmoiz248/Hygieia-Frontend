"use client"

import { useState } from "react"


import { Search } from "lucide-react"
import { LabTestCard } from "@/components/lab-tests/labTestCards"

import { LabTestsFilters } from "@/components/lab-tests/LabTestFilters"
import { useLabTests } from "@/hooks/useLabTests"





export default function LabTestsPage() {


   const { data:labTests, isLoading, isError } = useLabTests()



 function getAllCategories(): string[] {
  return [...new Set(labTests?.map((test) => test.category))]
}


  const [searchTerm, setSearchTerm] = useState("")
//  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = getAllCategories()

const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

const filteredTests = labTests?.filter((test) => {
  const matchesSearch = test.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  const matchesCategory =
    !selectedCategory || test.category === selectedCategory
  return matchesSearch && matchesCategory
})


  if (isLoading) return <p>Loading lab tests...</p>
  if (isError) return <p>Something went wrong.</p>


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
          {filteredTests?.map((test) => (
            <LabTestCard key={test.id} test={test} />
          ))}
        </div>

        {filteredTests?.length === 0 && (
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
