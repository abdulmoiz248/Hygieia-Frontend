import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Eye, Trash2 } from "lucide-react"
import type { MedicalRecord } from "@/types"
import { patientDestructive, patientSuccess } from "@/toasts/PatientToast"
import { formatDateOnly } from "@/helpers/date"

interface MedicalRecordViewerModalProps {
  viewingRecord: MedicalRecord | null
  setViewingRecord: (record: MedicalRecord | null) => void
  getTypeIcon: (type: string) => React.ReactNode
  onDeleteRecord?: (recordId: string) => void
}

export function MedicalRecordViewerModal({
  viewingRecord,
  setViewingRecord,
  getTypeIcon,
  onDeleteRecord,
}: MedicalRecordViewerModalProps) {
  const handleDownload = async () => {
    if (!viewingRecord?.fileUrl) return
    try {
      const response = await fetch(viewingRecord.fileUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = viewingRecord.title || "medical-record.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      patientSuccess(`${viewingRecord.title} Report Downloaded Successfully`)
    } catch (error) {
      console.error("Download failed", error)
    }
  }

  const handlePreview = () => {
    if (!viewingRecord?.fileUrl) return
    window.open(viewingRecord.fileUrl, "_blank", "noopener,noreferrer")
  }

  const handleDelete = () => {
    if (!viewingRecord?.id || !onDeleteRecord) return
    onDeleteRecord(viewingRecord.id)
    patientDestructive(`${viewingRecord.title} Report Deleted Successfully`)
    setViewingRecord(null)
  }

  return (
    <Dialog open={!!viewingRecord} onOpenChange={() => setViewingRecord(null)}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-snow-white">
        {viewingRecord && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="text-3xl">{getTypeIcon(viewingRecord.record_type || "")}</div>
                <div>
                  <h2 className="text-xl font-semibold text-soft-coral">{viewingRecord.title}</h2>
                  {viewingRecord.doctorName && (
                    <p className="text-cool-gray font-normal">{viewingRecord.doctorName}</p>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handlePreview} className="bg-soft-blue text-white hover:bg-soft-blue/90">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview File
                </Button>
                <Button onClick={handleDownload} className="bg-mint-green text-white hover:bg-mint-green/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
                <Button onClick={handleDelete} className="bg-soft-coral text-white hover:bg-soft-coral/90">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete File
                </Button>
              </div>

              <div className="rounded-xl border border-white/60 bg-white/60 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {viewingRecord.type?.replace("-", " ") || ""}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {formatDateOnly(viewingRecord.date)}
                  </div>
                  {viewingRecord.doctorName && (
                    <div>
                      <span className="font-medium">Doctor:</span> {viewingRecord.doctorName}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">File Size:</span> 2.4 MB
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
