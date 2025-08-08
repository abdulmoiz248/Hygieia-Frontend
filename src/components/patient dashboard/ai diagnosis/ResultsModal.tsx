import React from "react";
import {Dialog,DialogContent,DialogTitle,DialogHeader} from '@/components/ui/dialog'
import Progress from "./Progress";
import Badge from "./Badge";
import Button from "./Button";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface DiagnosisResult {
  type: "dental" | "acne";
  confidence: number;
  recommendation: string;
  severity: "mild" | "moderate" | "severe";
  nextSteps: string[];
}

interface ResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: DiagnosisResult | null;
  resetDiagnosis: () => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "mild":
      return "text-mint-green";
    case "moderate":
      return "text-yellow-600";
    case "severe":
      return "text-soft-coral";
    default:
      return "text-cool-gray";
  }
};

const ResultsModal: React.FC<ResultsModalProps> = ({ open, onOpenChange, result, resetDiagnosis }) => (
  <Dialog open={open} onOpenChange={onOpenChange}  > 
<DialogContent className="w-full bg-snow-white max-w-[80vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[850px] xl:max-w-[1000px] 2xl:max-w-[1100px] max-h-[90vh] overflow-y-auto">

  <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-mint-green" />
          Analysis Complete
        </DialogTitle>
      </DialogHeader>
      {result && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-soft-blue mb-2">{result.confidence}%</div>
            <p className="text-cool-gray">Confidence Level</p>
            <Progress value={result.confidence} className="w-full max-w-sm mx-auto mt-2" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${getSeverityColor(result.severity)}`} />
            <span className="font-medium">Severity: </span>
            <Badge className={getSeverityColor(result.severity)}>
              {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
            </Badge>
          </div>
          <div className="bg-cool-gray/10 p-5 rounded-lg">
            <h3 className="font-semibold text-dark-slate-gray mb-2">AI Recommendation</h3>
            <p className="text-cool-gray">{result.recommendation}</p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-slate-gray mb-3">Recommended Next Steps</h3>
            <div className="space-y-2">
              {result.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-soft-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-soft-blue">{index + 1}</span>
                  </div>
                  <p className="text-cool-gray">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-soft-blue hover:bg-soft-blue/90">Book Consultation</Button>
            <Button variant="outline" onClick={resetDiagnosis}>
              New Analysis
            </Button>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not
              replace professional medical advice. Please consult with a qualified healthcare provider for proper
              diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default ResultsModal;
