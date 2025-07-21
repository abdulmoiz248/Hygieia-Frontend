import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Download, Upload, Calendar, User } from "lucide-react"
import type { MedicalRecord } from "@/types"

interface MedicalRecordsGridProps {
  filteredRecords: MedicalRecord[]
  setViewingRecord: (record: MedicalRecord) => void
  getTypeIcon: (type: string) => React.ReactNode
  getTypeColor: (type: string) => string
  onShowUpload: () => void
}

export function MedicalRecordsGrid({
  filteredRecords,
  setViewingRecord,
  getTypeColor,
  onShowUpload
}: MedicalRecordsGridProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecords.map((record) => (
          <Card
            key={record.id}
            className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Badge className={`${getTypeColor(record.type)} text-xs px-2 py-0.5 rounded-md`}>
                  {record.type.replace("-", " ")}
                </Badge>
              </div>

              <h3 className="font-semibold text-gray-800 text-base line-clamp-2">{record.title}</h3>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-soft-blue" />
                  <span>{record.date}</span>
                </div>
                {record.doctorName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-soft-blue" />
                    <span>{record.doctorName}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 border border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white"
                  onClick={() => setViewingRecord(record)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <a href={record.fileUrl} download>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-soft-coral hover:bg-soft-coral/90 text-white px-3"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-16 px-6 rounded-lg bg-white border border-gray-200 mt-10 shadow-sm">
          <FileText className="w-14 h-14 text-soft-coral mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No records found</h3>
          <p className="text-gray-500 mb-5">Upload your first medical record to get started</p>
          <Button
            onClick={onShowUpload}
            className="bg-mint-green hover:bg-mint-green/90 text-white px-5 py-2.5 text-sm rounded-md"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Record
          </Button>
        </div>
      )}
    </div>
  )
}
