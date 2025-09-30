import React from "react";
import Dialog from "./Dialog";
import DialogContent from "./DialogContent";
import DialogHeader from "./DialogHeader";
import DialogTitle from "./DialogTitle";
import Progress from "./Progress";
import Loader from '@/components/loader/loader'

interface AnalysisProgressModalProps {
  open: boolean;
  selectedType: "dental" | "acne" | null;
  analysisProgress: number;
}

const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({ open, selectedType, analysisProgress }) => (
  <Dialog open={open} onOpenChange={() => {}}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Loader/>
          Analyzing Your Image
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-6xl mb-4">{selectedType === "dental" ? "🦷" : "✨"}</div>
          <h3 className="text-lg font-medium text-dark-slate-gray mb-2">AI Analysis in Progress</h3>
          <p className="text-cool-gray mb-4">Our AI is examining your photo for insights...</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(analysisProgress)}%</span>
          </div>
          <Progress value={analysisProgress} className="h-3" />
        </div>
        <div className="text-center text-sm text-cool-gray">
          {analysisProgress < 30 && "Processing image..."}
          {analysisProgress >= 30 && analysisProgress < 60 && "Analyzing features..."}
          {analysisProgress >= 60 && analysisProgress < 90 && "Generating insights..."}
          {analysisProgress >= 90 && "Finalizing results..."}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default AnalysisProgressModal; 