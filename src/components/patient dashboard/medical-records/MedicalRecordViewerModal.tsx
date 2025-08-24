import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {  Download, Eye, Trash2 } from "lucide-react"
import type { MedicalRecord } from "@/types"
import { patientDestructive,  patientSuccess } from "@/toasts/PatientToast"
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
  onDeleteRecord
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
      <DialogContent className="max-w-2xl bg-snow-white overflow-y-auto max-h-[90vh]">
        {viewingRecord && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="text-3xl">{getTypeIcon(viewingRecord.type)}</div>
                <div>
                  <h2 className="text-xl font-semibold text-soft-coral">{viewingRecord.title}</h2>
                  <p className="text-cool-gray font-normal">
                    {viewingRecord.doctorName} • {formatDateOnly( viewingRecord.date)}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="flex justify-center gap-4 flex-wrap">
                <Button onClick={handlePreview} className="bg-soft-blue hover:bg-soft-blue/90 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview File
                </Button>
                <Button onClick={handleDownload} className="bg-dark-slate-gray hover:bg-dark-slate-gray/90 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
                <Button onClick={handleDelete} className="bg-soft-coral hover:bg-red-700 text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete File
                </Button>
              </div>
              <div className="p-4 bg-mint-green rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {viewingRecord.type.replace("-", " ")}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {formatDateOnly( viewingRecord.date)}
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
