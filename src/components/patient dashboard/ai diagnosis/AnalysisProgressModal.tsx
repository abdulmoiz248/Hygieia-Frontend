import React from "react"
import Dialog from "./Dialog"
import DialogContent from "./DialogContent"
import DialogHeader from "./DialogHeader"
import DialogTitle from "./DialogTitle"
import Progress from "./Progress"
import { Loader2, Sparkles, Stethoscope } from "lucide-react"

interface AnalysisProgressModalProps {
  open: boolean
  selectedType: "dental" | "acne" | null
  analysisProgress: number
}

const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({
  open,
  selectedType,
  analysisProgress,
}) => {
  const Icon = selectedType === "dental" ? Stethoscope : Sparkles
  const iconColor = selectedType === "dental" ? "text-soft-blue" : "text-mint-green"

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md rounded-2xl border border-gray-100 bg-snow-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-dark-slate-gray">
            <Loader2 className="h-5 w-5 animate-spin text-soft-blue" />
            Analyzing Your Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-soft-blue/15 bg-soft-blue/8">
              <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-dark-slate-gray">AI Analysis in Progress</h3>
            <p className="mt-2 text-sm text-cool-gray">Reviewing image quality and visible health patterns.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-dark-slate-gray">
              <span>Progress</span>
              <span className="font-semibold">{Math.round(analysisProgress)}%</span>
            </div>
            <Progress value={analysisProgress} className="h-3" />
          </div>

          <div className="rounded-xl bg-soft-blue/6 px-4 py-3 text-center text-sm text-cool-gray">
            {analysisProgress < 30 && "Processing image..."}
            {analysisProgress >= 30 && analysisProgress < 60 && "Analyzing visual features..."}
            {analysisProgress >= 60 && analysisProgress < 90 && "Generating health guidance..."}
            {analysisProgress >= 90 && "Finalizing results..."}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AnalysisProgressModal
