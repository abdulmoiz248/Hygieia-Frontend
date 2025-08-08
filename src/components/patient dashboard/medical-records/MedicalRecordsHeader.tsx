import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MedicalRecord } from "@/types"
import { patientSuccess } from "@/toasts/PatientToast"

interface MedicalRecordsHeaderProps {
  showUpload: boolean
  setShowUpload: (open: boolean) => void
  onUploadRecord: (record: MedicalRecord) => void
}

export function MedicalRecordsHeader({ showUpload, setShowUpload, onUploadRecord }: MedicalRecordsHeaderProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<MedicalRecord["type"] | "">("")
  const [doctorName, setDoctorName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    if (selected && selected.type !== "application/pdf") {
      setError("Only PDF files are allowed.")
      setFile(null)
      return
    }
    setError("")
    setFile(selected)
  }

  const handleUpload = () => {
    if (!title || !type || !file) {
      setError("Please fill all fields and select a PDF file.")
      return
    }
    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      title,
      type: type as MedicalRecord["type"],
      date: new Date().toISOString().split("T")[0],
      doctorName,
      fileUrl: URL.createObjectURL(file),
    }
    onUploadRecord(newRecord)
    patientSuccess(`${title} Report Uploaded Succesfully`)
    setTitle("")
    setType("")
    setDoctorName("")
    setFile(null)
    setError("")
    setShowUpload(false)
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-soft-coral">Medical Records</h1>
        <p className="text-cool-gray">Manage and view your medical documents</p>
      </div>
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogTrigger asChild>
          <Button className="bg-mint-green hover:bg-mint-green/90 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Record
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-snow-white">
          <DialogHeader>
            <DialogTitle className="text-soft-blue">Upload Medical Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Record Title</label>
              <Input placeholder="e.g., Blood Test Results" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Record Type</label>
              <Select value={type} onValueChange={v => setType(v as MedicalRecord["type"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-snow-white">
                  <SelectItem value="lab-result" className="hover:text-white hover:bg-mint-green">Lab Result</SelectItem>
                  <SelectItem value="prescription" className="hover:text-white hover:bg-mint-green">Prescription</SelectItem>
                  <SelectItem value="scan" className="hover:text-white hover:bg-mint-green">Scan/X-Ray</SelectItem>
                  <SelectItem value="report" className="hover:text-white hover:bg-mint-green">Medical Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Doctor Name</label>
              <Input placeholder="e.g., Dr. Smith" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-12 h-12 text-cool-gray mx-auto mb-4" />
              <p className="text-cool-gray">Drag and drop your file here, or click to browse</p>
              <p className="text-xs text-cool-gray mt-2">Supports PDF only (Max 10MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {file && <p className="mt-2 text-green-600 text-sm">Selected: {file.name}</p>}
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button className="w-full bg-mint-green hover:bg-mint-green/90" onClick={handleUpload}>Upload Record</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 