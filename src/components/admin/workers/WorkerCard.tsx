"use client"

import { useState } from "react"
import {
  Star, Mail, Phone, FileText, Trash2,
  BadgeCheck, MapPin, ExternalLink, ShieldCheck
} from "lucide-react"
import { Worker, Role, ROLE_CONFIG } from "@/types/admin/workers"
import WorkerInfoModal from "./WorkerInfoModal"
import { Button } from "@/components/ui/button"

interface WorkerCardProps {
  worker: Worker
  onDelete: (params: { workerId: string; email: string; role: Role }) => void
}

export default function WorkerCard({ worker, onDelete }: WorkerCardProps) {
  const [showInfoModal, setShowInfoModal] = useState(false)
  const cfg = ROLE_CONFIG[worker.role] || { label: worker.role, color: "#008396", gradient: "linear-gradient(to right, #008396, #00c6d9)", lightBg: "#e0f7fa" }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete({ workerId: worker._id, email: worker.email, role: worker.role })
  }

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`/admin/workers/${worker.id}/report`, '_blank')
  }

  // Get Avatar Initials
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
        className="group relative flex flex-col h-full rounded-2xl bg-white border border-cool-gray/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
      >
        {/* Dynamic Gradient Header Background */}
        <div 
          className="h-24 w-full relative overflow-hidden flex-shrink-0"
          style={{ background: cfg.gradient }}
        >
          {/* Decorative Pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:16px_16px]"></div>
        </div>

        {/* Avatar Profile Picture - Overlapping */}
        <div className="relative px-6 flex justify-center -mt-12 mb-3">
          <div className="relative">
            {worker.img ? (
              <img
                src={worker.img}
                alt={worker.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-2xl"
                style={{ background: cfg.gradient }}
              >
                {initials}
              </div>
            )}
            
            {/* Status / Verified Badge */}
            <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-mint-green fill-mint-green/20" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 px-6 pb-6 text-center">
          
          <h3 className="font-bold text-lg text-dark-slate-gray leading-tight group-hover:text-soft-blue transition-colors">
            {worker.name}
          </h3>
          
          <p className="text-sm font-medium mt-1 mb-3" style={{ color: cfg.color }}>
            {worker.specialization || cfg.label}
          </p>

          <div className="flex items-center justify-center gap-1.5 mb-4">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-dark-slate-gray">
              {worker.rating > 0 ? worker.rating.toFixed(1) : "New"}
            </span>
            <span className="text-xs text-muted-foreground ml-1">Rating</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {worker.experienceYears > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-cool-gray/10 text-dark-slate-gray border border-cool-gray/20">
                {worker.experienceYears} Yrs Exp
              </span>
            )}
            {worker.certifications.slice(0, 1).map((c) => (
              <span key={c} className="text-xs px-2.5 py-1 rounded-md font-semibold bg-mint-green/10 text-mint-green border border-mint-green/20 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{c}</span>
              </span>
            ))}
          </div>

          {/* Flexible Space */}
          <div className="flex-1" />

          {/* Divider */}
          <div className="w-full h-px bg-cool-gray/10 my-4" />

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between gap-3">
            <Button
            
              size="sm"
              onClick={handleReportClick}
              className="flex-1 bg-soft-blue text-snow-white "
            >
              <FileText className="w-4 h-4 mr-2" />
              Report
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="text-soft-coral hover:bg-soft-coral/10 hover:text-soft-coral shrink-0 h-9 w-9 border border-transparent hover:border-soft-coral/30"
              title="Remove Worker"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
        </div>
        
        {/* Subtle hover overlay hint */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-dark-slate-gray shadow-sm flex items-center gap-1">
            View Profile <ExternalLink className="w-3 h-3" />
          </div>
        </div>

      </div>

      {showInfoModal && (
        <WorkerInfoModal
          worker={worker}
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </>
  )
}
