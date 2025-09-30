import { Badge } from "@/components/ui/badge"

export default function CompletedHeader({ completedCount }: { completedCount: number }) {

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-soft-coral drop-shadow-sm">
            Completed Reports
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            View and download all completed lab test reports
          </p>
        </div>

        {completedCount > 0 && (
          <Badge
            variant="outline"
            className="text-sm sm:text-base bg-soft-blue text-snow-white px-3 py-1 sm:py-2 font-medium animate-pulse hover:scale-105 transition-transform duration-300 self-start sm:self-center"
          >
            {completedCount} completed reports
          </Badge>
        )}
      </div>

      <div className="mt-3">
        <div className="h-2 sm:h-3 w-full bg-soft-coral rounded-full overflow-hidden">
          <div
            className="h-full bg-soft-blue animate-pulse"
            style={{ width: `${Math.min(completedCount * 10, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
