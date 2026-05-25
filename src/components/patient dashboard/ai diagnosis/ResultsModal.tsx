import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog'
import Progress from "./Progress";
import { CheckCircle, AlertTriangle, CalendarPlus, RotateCcw } from "lucide-react";

interface DiagnosisResult {
  type: "dental" | "acne";
  predictedClass: string;
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

const severityConfig = {
  mild: { color: "text-mint-green", bg: "bg-mint-green/10", border: "border-mint-green/20", bar: "bg-mint-green" },
  moderate: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-500" },
  severe: { color: "text-soft-coral", bg: "bg-soft-coral/8", border: "border-soft-coral/20", bar: "bg-soft-coral" },
};

const confidenceColor = (v: number) =>
  v >= 80 ? "text-mint-green" : v >= 60 ? "text-amber-600" : "text-soft-coral";

const ResultsModal: React.FC<ResultsModalProps> = ({ open, onOpenChange, result, resetDiagnosis }) => {
  const router = useRouter();

  const handleBookConsultation = () => {
    onOpenChange(false);
    router.push("/patient/appointments/new");
  };

  const handleNewAnalysis = () => {
    onOpenChange(false);
    resetDiagnosis();
  };

  if (!result) return null;

  const sev = severityConfig[result.severity];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full bg-snow-white max-w-[90vw] sm:max-w-[600px] md:max-w-[680px] max-h-[92vh] overflow-y-auto rounded-2xl p-0 border border-gray-100 shadow-2xl">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral rounded-t-2xl" />

        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint-green/12 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-mint-green" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-dark-slate-gray leading-tight">
                  Analysis Complete
                </DialogTitle>
                <p className="text-xs text-cool-gray mt-0.5">
                  {result.type === "dental" ? "Dental" : "Skin"} analysis results
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5">

            {/* Confidence + Disease — side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Confidence */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cool-gray/60 mb-2">Confidence</p>
                <p className={`text-4xl font-extrabold mb-1 ${confidenceColor(result.confidence)}`}>
                  {result.confidence}%
                </p>
                <Progress value={result.confidence} className="h-1.5 mt-2" />
              </div>

              {/* Detected */}
              <div className="bg-soft-blue/6 border border-soft-blue/15 rounded-xl p-4 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cool-gray/60 mb-2">Detected</p>
                <p className="text-xl font-bold text-dark-slate-gray leading-tight">{result.predictedClass}</p>
                <p className="text-xs text-cool-gray mt-1">{result.type === "dental" ? "Dental condition" : "Skin condition"}</p>
              </div>
            </div>

            {/* Severity */}
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${sev.bg} ${sev.border}`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 ${sev.color}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-dark-slate-gray">Severity</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sev.bg} ${sev.color} border ${sev.border}`}>
                    {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-cool-gray/60 mb-2">AI Recommendation</p>
              <p className="text-sm text-dark-slate-gray leading-relaxed">{result.recommendation}</p>
            </div>

            {/* Next steps */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-cool-gray/60 mb-3">Recommended Next Steps</p>
              <div className="space-y-2.5">
                {result.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-soft-blue/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-soft-blue">{i + 1}</span>
                    </div>
                    <p className="text-sm text-cool-gray leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleBookConsultation}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-soft-blue hover:bg-soft-blue/90 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
              >
                <CalendarPlus className="w-4 h-4" />
                Book Consultation
              </button>
              <button
                onClick={handleNewAnalysis}
                className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-dark-slate-gray font-semibold text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                New Analysis
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.
              </p>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;