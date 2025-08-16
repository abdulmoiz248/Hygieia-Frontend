import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchCardProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
}

export function PendingReportFilter({ searchQuery, setSearchQuery }: SearchCardProps) {
  return (
    <Card className="border-0 shadow-md rounded-2xl bg-[--color-snow-white] hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[--color-dark-slate-gray] w-5 h-5" />
            <Input
              placeholder="Search medical records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[--color-cool-gray] focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
