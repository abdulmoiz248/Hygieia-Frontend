"use client"


import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import {
  getMissingPatientFields,
  isPatientProfileComplete,
} from "@/lib/patient/ProfileCompleteness"

type ShareDataCheckboxProps = {
  checked: boolean
  onChange: (value: boolean) => void
}

export default function ShareDataCheckbox({ checked, onChange }: ShareDataCheckboxProps) {
  const profile = usePatientProfileStore((s) => s.profile)

  const complete      = isPatientProfileComplete(profile)
  const missingFields = getMissingPatientFields(profile)

  /** Intercept the toggle: block and notify if profile is incomplete */
  const handleCheckedChange = (val: boolean) => {
    if (val && !complete) {
      // Don't allow — the UI feedback below explains why
      return
    }
    onChange(!!val)
  }

  return (
    <div className="space-y-2">
      {/* ── Checkbox row ── */}
      <div className="flex items-center gap-2 py-1">
        <Checkbox
          id="share"
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={!complete}
          className="w-4 h-4 border-gray-400 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="share"
          className={`text-sm cursor-pointer select-none transition-colors ${
            complete
              ? "text-gray-700 hover:text-soft-blue"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          Share my health data with the doctor
        </label>

        {/* Green tick when enabled and checked */}
        {complete && checked && (
          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
        )}
      </div>

      {/* ── Incomplete-profile warning ── */}
      {!complete && (
        <div className="rounded-xl border border-soft-coral/30 bg-soft-coral/5 px-4 py-3 flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-soft-coral shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-soft-coral leading-snug">
              Profile incomplete — data sharing unavailable
            </p>
          </div>

          {/* Missing fields list */}
          {missingFields.length > 0 && (
            <div className="ml-6 space-y-0.5">
              <p className="text-xs text-cool-gray mb-1">
                The following required fields are missing:
              </p>
              <ul className="space-y-0.5">
                {missingFields.map((f) => (
                  <li
                    key={f.key}
                    className="flex items-center gap-1.5 text-xs text-dark-slate-gray/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-soft-coral/60 shrink-0" />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <Link
            href="/patient/profile"
            className="ml-6 mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-soft-blue hover:text-soft-blue/80 underline underline-offset-2 transition-colors"
          >
            Complete your profile
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* ── Optional: hint when profile IS complete but checkbox unchecked ── */}
      {complete && !checked && (
        <p className="text-xs text-cool-gray ml-6">
          Sharing your health data helps the doctor give you more personalised care.
        </p>
      )}
    </div>
  )
}