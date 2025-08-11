"use client"

import { MessageCircle, Users, Shield, Clock } from "lucide-react"

export function EmptyChat() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[var(--color-snow-white)]">
      <div className="text-center max-w-md px-6">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-[var(--color-soft-blue)]/10 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-[var(--color-soft-blue)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-dark-slate-gray)] mb-2">
            Welcome to Patient Care Chat
          </h2>
          <p className="text-[var(--color-cool-gray)] mb-6 text-sm leading-relaxed">
            Connect with your healthcare team securely and conveniently. Select a conversation to get started.
          </p>
        </div>

        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-[var(--color-mint-green)]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-[var(--color-mint-green)]" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-dark-slate-gray)] text-sm">Secure & Private</h3>
              <p className="text-xs text-[var(--color-cool-gray)] leading-relaxed">
                All conversations are encrypted and HIPAA compliant
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-[var(--color-soft-blue)]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-[var(--color-soft-blue)]" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-dark-slate-gray)] text-sm">Healthcare Team</h3>
              <p className="text-xs text-[var(--color-cool-gray)] leading-relaxed">
                Connect with doctors, nurses, and specialists
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-[var(--color-soft-coral)]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-[var(--color-soft-coral)]" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-dark-slate-gray)] text-sm">24/7 Access</h3>
              <p className="text-xs text-[var(--color-cool-gray)] leading-relaxed">Get support whenever you need it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
