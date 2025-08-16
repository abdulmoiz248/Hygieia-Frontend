import { Badge } from "@/components/ui/badge"
import { useLabStore } from "@/store/lab-tech/labTech"
export default function PendingHeader() {
  const { getPendingCount } = useLabStore()
    
  const currentPendingCount = getPendingCount()
  return (
    <div className="mb-8  bg-snow-white rounded-2xl ">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
    <div>
      <h1 className="text-3xl font-bold text-soft-coral mb-1 drop-shadow-sm">
        Pending Reports
      </h1>
      <p className="text-gray-600 text-sm sm:text-base">
        Manage and upload pending lab test reports
      </p>
    </div>
  {
    currentPendingCount>0 && 
      <Badge 
      variant="outline" 
      className="text-sm bg-soft-blue text-snow-white p-3 rounded-lg font-medium animate-pulse hover:scale-105 transition-transform duration-300 shadow-md"
    >
      {currentPendingCount} pending reports
    </Badge>
  }
  </div>
  <div className="mt-4">
    <div className="h-1 w-full bg-soft-coral rounded-full overflow-hidden">
      <div 
        className="h-full bg-soft-blue animate-pulse" 
        style={{ width: `${Math.min(currentPendingCount * 10, 100)}%` }}
      />
    </div>
  </div>
</div>
  )
}
