import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Download, Upload, Calendar, User } from "lucide-react"
import type { MedicalRecord } from "@/types"
import { patientSuccess } from "@/toasts/PatientToast"
import { formatDateOnly } from "@/helpers/date"

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

  const handleDownload = async (fileUrl:string,title:string) => {
  if (!fileUrl) return
  try {
    const response = await fetch(fileUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = title || "medical-record.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    patientSuccess(`${title} Report Downloaded Successfully`)
  } catch (error) {
    console.error("Download failed", error)
  }
}

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRecords.map((record) => (
          <article
            key={record.id}
            role="button"
            tabIndex={0}
            onClick={() => setViewingRecord(record)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                setViewingRecord(record)
              }
            }}
            className="group relative flex min-h-[168px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white/40 shadow-sm backdrop-blur-lg transition-all duration-200 hover:-translate-y-1 hover:border-soft-blue/25 hover:bg-white/55 hover:shadow-md"
          >
            <div className="h-1 w-full bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral" />

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-soft-blue/15 bg-white/75 text-soft-blue shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-dark-slate-gray">
                      {record.title}
                    </h3>
                    {record.record_type && (
                      <Badge className={`${getTypeColor(record.record_type)} mt-2 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize shadow-none`}>
                        {record.record_type.replace("-", " ")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 rounded-xl border border-gray-100/70 bg-snow-white/55 px-3 py-2.5 text-sm text-cool-gray">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="h-4 w-4 shrink-0 text-soft-blue" />
                  <span className="truncate">{formatDateOnly(record.date)}</span>
                </div>
                {record.doctorName && (
                  <div className="flex min-w-0 items-center gap-2">
                    <User className="h-4 w-4 shrink-0 text-soft-blue" />
                    <span className="truncate">{record.doctorName}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto flex items-center justify-end gap-2 pt-4">
                  <Button
                    size="sm"
                    className="border border-soft-blue bg-transparent px-3 text-soft-blue hover:bg-soft-blue hover:text-white"
                    onClick={(event) => {
                      event.stopPropagation()
                      setViewingRecord(record)
                    }}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Button>

                  <Button
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDownload(record.fileUrl || "", record.title)
                    }}
                    variant="default"
                    size="sm"
                    className="bg-soft-coral px-3 text-white hover:bg-soft-coral/90"
                    aria-label={`Download ${record.title}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
          </article>
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
