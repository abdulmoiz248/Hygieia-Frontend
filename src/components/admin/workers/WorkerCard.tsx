"use client"

import { useState } from "react"
import { Star, FileText, Trash2, ShieldCheck, BadgeCheck, Briefcase } from "lucide-react"
import { Worker, Role, ROLE_CONFIG } from "@/types/admin/workers"
import WorkerInfoModal from "./WorkerInfoModal"
import { Button } from "@/components/ui/button"

interface WorkerCardProps {
  worker: Worker
  onDelete: (params: { workerId: string; email: string; role: Role }) => void
}

export default function WorkerCard({ worker, onDelete }: WorkerCardProps) {
  const [showInfoModal, setShowInfoModal] = useState(false)
  const cfg = ROLE_CONFIG[worker.role] || {
    label: worker.role,
    color: "#008396",
    gradient: "linear-gradient(to right, #008396, #00c6d9)",
    lightBg: "#e0f7fa",
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete({ workerId: worker._id, email: worker.email, role: worker.role })
  }

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`/admin/workers/${worker.id}/report`, "_blank")
  }

  const initials = worker.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <>
      <div
        onClick={() => setShowInfoModal(true)}
        className="group relative flex flex-col rounded-2xl bg-white border border-cool-gray/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
        style={{ minHeight: "340px" }}
      >
        {/* Gradient Header */}
        <div
          className="h-20 w-full relative overflow-hidden flex-shrink-0"
          style={{ background: cfg.gradient }}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:16px_16px]" />
        </div>

        {/* Avatar — overlapping header */}
        <div className="flex justify-center -mt-10 px-6 flex-shrink-0">
          <div className="relative">
            {worker.img ? (
              <img
                src={worker.img}
                alt={worker.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xl"
                style={{ background: cfg.gradient }}
              >
                {initials}
              </div>
            )}
            <div className="absolute bottom-0.5 right-0.5 bg-white rounded-full p-0.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-mint-green fill-mint-green/20" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-5 pt-3 pb-5">
          {/* Name & Role — fixed height zone */}
          <div className="text-center mb-3">
            <h3 className="font-bold text-base text-dark-slate-gray leading-tight group-hover:text-soft-blue transition-colors line-clamp-1">
              {worker.name}
            </h3>
            <p className="text-xs font-semibold mt-0.5" style={{ color: cfg.color }}>
              {worker.specialization || cfg.label}
            </p>
          </div>

          {/* Rating — always present, consistent height */}
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-dark-slate-gray">
              {worker.rating > 0 ? worker.rating.toFixed(1) : "New"}
            </span>
            <span className="text-xs text-muted-foreground">Rating</span>
          </div>

          {/* Tags — fixed min-height so cards stay aligned */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4 min-h-[28px]">
            {worker.experienceYears > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-cool-gray/10 text-dark-slate-gray border border-cool-gray/20">
                {worker.experienceYears} yrs exp
              </span>
            )}
            {worker.certifications.slice(0, 1).map((c) => (
              <span
                key={c}
                className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-mint-green/10 text-mint-green border border-mint-green/20 flex items-center gap-1 max-w-[130px]"
              >
                <BadgeCheck className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{c}</span>
              </span>
            ))}
          </div>

          {/* Spacer pushes footer to bottom */}
          <div className="flex-1" />

          {/* Divider + Actions — always at bottom */}
          <div className="border-t border-cool-gray/10 pt-4 flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleReportClick}
              className="flex-1 text-white text-xs font-semibold h-8 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: cfg.gradient }}
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Report
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="h-8 w-8 rounded-lg text-soft-coral hover:bg-soft-coral/10 hover:text-soft-coral border border-transparent hover:border-soft-coral/30 transition-all flex-shrink-0"
              title="Remove Worker"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {showInfoModal && (
        <WorkerInfoModal worker={worker} onClose={() => setShowInfoModal(false)} />
      )}
    </>
  )
}
