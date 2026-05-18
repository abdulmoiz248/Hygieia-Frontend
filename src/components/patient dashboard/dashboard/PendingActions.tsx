"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useCallback } from "react"
import {
  FlaskConical,
  CalendarCheck,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { usePatientProfileStore } from "@/store/patient/profile-store"

// ─── Types ────────────────────────────────────────────────────────────────────

type ReferredTest = {
  id: string
  testId: string
  test: {
    id: string
    name: string
    description: string
    category: string
    price: number
    duration: string
    preparation_instructions: string[]
    record_type: string
  }
  referrer: { name: string; role: string }
  status: "pending" | "booked" | "completed" | "dismissed"
  dismissed: boolean
  createdAt: string
}

type FollowUp = {
  id: string
  requestId?: string
  reason?: string
  notes?: string
  requestedBy?: { name: string; role: string }
  referrer?: { name: string; role: string }
  scheduledDate?: string
  status?: string
  dismissed?: boolean
  createdAt: string
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

async function fetchReferredTests(patientId: string): Promise<ReferredTest[]> {
  const res = await fetch(`${BASE}/appointments/referred-tests/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
  })
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`referred-tests ${res.status}`)
  return res.json()
}

async function dismissReferredTest(referralId: string, patientId: string): Promise<void> {
  const res = await fetch(`${BASE}/appointments/reffered-tests/${referralId}/dismiss`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
    },
    body: JSON.stringify({ patientId }),
  })
  if (!res.ok) throw new Error(`dismiss-test ${res.status}`)
}

async function fetchFollowUps(patientId: string): Promise<FollowUp[]> {
  const res = await fetch(`${BASE}/appointments/follow-up/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
  })
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`follow-ups ${res.status}`)
  return res.json()
}

async function dismissFollowUp(requestId: string, patientId: string): Promise<void> {
  const res = await fetch(`${BASE}/appointments/follow-up/${requestId}/dismiss`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
    },
    body: JSON.stringify({ patientId }),
  })
  if (!res.ok) throw new Error(`dismiss-followup ${res.status}`)
}

// ─── Card animation (self-driven) ─────────────────────────────────────────────

const cardAnim = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, x: 40, transition: { duration: 0.25, ease: "easeIn" } },
}

// ─── ReferredTestCard ─────────────────────────────────────────────────────────

function ReferredTestCard({
  item,
  patientId,
  onDismiss,
}: {
  item: ReferredTest
  patientId: string
  onDismiss: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const { toast } = useToast()

  const handleDismiss = async () => {
    setDismissing(true)
    try {
      await dismissReferredTest(item.id, patientId)
      onDismiss(item.id)
      toast({ title: "Test referral dismissed" })
    } catch (err) {
      console.error(err)
      toast({ title: "Failed to dismiss", variant: "destructive" })
    } finally {
      setDismissing(false)
    }
  }

  return (
    <motion.div layout {...cardAnim} className="rounded-xl border border-white/20 bg-mint-green/5 hover:bg-mint-green/10 transition-colors duration-200">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-green/20">
            <FlaskConical className="h-4 w-4 text-mint-green" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-dark-slate-gray/90 truncate">{item.test.name}</p>
              <Badge className="bg-mint-green/20 text-mint-green border-mint-green/30 text-xs capitalize">
                {item.test.category}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-dark-slate-gray/60 mb-3">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.referrer.name}
                <span className="capitalize text-dark-slate-gray/40">· {item.referrer.role}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.test.duration}
              </span>
              <span className="font-medium text-dark-slate-gray/70">
                PKR {item.test.price.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="h-7 rounded-full bg-mint-green text-white hover:bg-mint-green/90 text-xs px-3">
                <CalendarCheck className="mr-1 h-3 w-3" /> Book
              </Button>
              <Button
                size="sm" variant="outline"
                onClick={() => setExpanded((p) => !p)}
                className="h-7 rounded-full border-white/30 bg-white/40 text-dark-slate-gray hover:bg-white/60 text-xs px-3"
              >
                {expanded ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                Details
              </Button>
              <Button
                size="sm" variant="ghost"
                onClick={handleDismiss} disabled={dismissing}
                className="h-7 rounded-full text-dark-slate-gray/50 hover:text-soft-coral hover:bg-soft-coral/10 text-xs px-2"
              >
                {dismissing ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                {item.test.description && (
                  <p className="text-xs text-dark-slate-gray/70">{item.test.description}</p>
                )}
                {item.test.preparation_instructions?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-dark-slate-gray/80 mb-1">Preparation</p>
                    <ul className="space-y-1">
                      {item.test.preparation_instructions.map((inst, i) => (
                        <li key={i} className="text-xs text-dark-slate-gray/60 flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-mint-green shrink-0 mt-0.5" />
                          {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-dark-slate-gray/40">
                  Referred {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── FollowUpCard ─────────────────────────────────────────────────────────────

function FollowUpCard({
  item,
  patientId,
  onDismiss,
}: {
  item: FollowUp
  patientId: string
  onDismiss: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const { toast } = useToast()

  const referrer  = item.requestedBy ?? item.referrer
  const requestId = item.requestId ?? item.id

  const handleDismiss = async () => {
    setDismissing(true)
    try {
      await dismissFollowUp(requestId, patientId)
      onDismiss(item.id)
      toast({ title: "Follow-up dismissed" })
    } catch (err) {
      console.error(err)
      toast({ title: "Failed to dismiss", variant: "destructive" })
    } finally {
      setDismissing(false)
    }
  }

  return (
    <motion.div layout {...cardAnim} className="rounded-xl border border-white/20 bg-soft-blue/5 hover:bg-soft-blue/10 transition-colors duration-200">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft-blue/20">
            <CalendarCheck className="h-4 w-4 text-soft-blue" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-dark-slate-gray/90">Follow-up Appointment</p>
              <Badge className="bg-soft-blue/20 text-soft-blue border-soft-blue/30 text-xs">Pending</Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-dark-slate-gray/60 mb-1">
              {referrer && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {referrer.name}
                  <span className="capitalize text-dark-slate-gray/40">· {referrer.role}</span>
                </span>
              )}
              {item.scheduledDate && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(item.scheduledDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              )}
            </div>
            {item.reason && (
              <p className="text-xs text-dark-slate-gray/70 mb-3 line-clamp-2">{item.reason}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <Button size="sm" className="h-7 rounded-full bg-soft-blue text-white hover:bg-soft-blue/90 text-xs px-3">
                <CalendarCheck className="mr-1 h-3 w-3" /> Accept & Book
              </Button>
              {item.notes && (
                <Button
                  size="sm" variant="outline"
                  onClick={() => setExpanded((p) => !p)}
                  className="h-7 rounded-full border-white/30 bg-white/40 text-dark-slate-gray hover:bg-white/60 text-xs px-3"
                >
                  {expanded ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                  Notes
                </Button>
              )}
              <Button
                size="sm" variant="ghost"
                onClick={handleDismiss} disabled={dismissing}
                className="h-7 rounded-full text-dark-slate-gray/50 hover:text-soft-coral hover:bg-soft-coral/10 text-xs px-2"
              >
                {dismissing ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && item.notes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs font-medium text-dark-slate-gray/80 mb-1">Doctor&apos;s notes</p>
                <p className="text-xs text-dark-slate-gray/70">{item.notes}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function AllClearState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 py-2 text-sm text-dark-slate-gray/60"
    >
      <CheckCircle2 className="h-4 w-4 text-mint-green shrink-0" />
      No pending actions — you&apos;re all caught up!
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type LoadState = "idle" | "loading" | "done" | "error"

export default function PendingActions() {
  const profileId = usePatientProfileStore((state) => state.profile.id)
  const patientId =
    profileId ||
    (typeof window !== "undefined" ? localStorage.getItem("id") ?? "" : "")

  const [tests, setTests]           = useState<ReferredTest[]>([])
  const [followUps, setFollowUps]   = useState<FollowUp[]>([])
  const [testsState, setTestsState] = useState<LoadState>("idle")
  const [fuState, setFuState]       = useState<LoadState>("idle")
  const [activeTab, setActiveTab]   = useState<"tests" | "followups">("tests")

  const load = useCallback(() => {
    if (!patientId) {
      setTestsState("done")
      setFuState("done")
      return
    }

    setTestsState("loading")
    setFuState("loading")

    fetchReferredTests(patientId)
      .then((data) => {
        setTests(data.filter((t) => !t.dismissed && t.status === "pending"))
        setTestsState("done")
      })
      .catch((err) => {
        console.error("[PendingActions] referred-tests error:", err)
        setTests([])
        setTestsState("error")
      })

    fetchFollowUps(patientId)
      .then((data) => {
        setFollowUps(data.filter((f) => !f.dismissed))
        setFuState("done")
      })
      .catch((err) => {
        console.error("[PendingActions] follow-ups error:", err)
        setFollowUps([])
        setFuState("error")
      })
  }, [patientId])

  useEffect(() => { load() }, [load])

  const loadingTests     = testsState === "idle" || testsState === "loading"
  const loadingFollowUps = fuState    === "idle" || fuState    === "loading"
  const bothDone         = !loadingTests && !loadingFollowUps
  const totalPending     = tests.length + followUps.length
  const allClear         = bothDone && totalPending === 0 && testsState !== "error" && fuState !== "error"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-soft-coral/10 to-soft-blue/10 border-b border-white/20 px-6 py-4">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className={`p-2 rounded-lg ${allClear ? "bg-mint-green/20" : "bg-soft-coral/20"}`}>
              {allClear
                ? <CheckCircle2 className="w-5 h-5 text-mint-green" />
                : <AlertCircle className="w-5 h-5 text-soft-coral" />
              }
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold leading-tight">Pending Actions</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">
                {allClear ? "Nothing needs your attention right now" : "Review requests from your care team"}
              </p>
            </div>
            {totalPending > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-soft-coral text-white text-xs font-bold">
                {totalPending}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* All-clear empty state — no tabs needed */}
          <AnimatePresence mode="wait">
            {(loadingTests && loadingFollowUps) ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-dark-slate-gray/60 py-8 justify-center"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading pending actions…
              </motion.div>
            ) : allClear ? (
              <AllClearState key="allclear" />
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Tab pills */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("tests")}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                      activeTab === "tests"
                        ? "bg-mint-green text-white shadow-sm"
                        : "bg-cool-gray/10 text-dark-slate-gray/70 hover:bg-cool-gray/20"
                    }`}
                  >
                    <FlaskConical className="h-3 w-3" />
                    Lab Tests
                    {tests.length > 0 && (
                      <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        activeTab === "tests" ? "bg-white/30 text-white" : "bg-mint-green/20 text-mint-green"
                      }`}>
                        {tests.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("followups")}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                      activeTab === "followups"
                        ? "bg-soft-blue text-white shadow-sm"
                        : "bg-cool-gray/10 text-dark-slate-gray/70 hover:bg-cool-gray/20"
                    }`}
                  >
                    <CalendarCheck className="h-3 w-3" />
                    Follow-ups
                    {followUps.length > 0 && (
                      <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        activeTab === "followups" ? "bg-white/30 text-white" : "bg-soft-blue/20 text-soft-blue"
                      }`}>
                        {followUps.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {activeTab === "tests" && (
                    <motion.div
                      key="tests"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {loadingTests ? (
                        <div className="flex items-center gap-2 text-sm text-dark-slate-gray/60 py-4">
                          <Loader2 className="h-4 w-4 animate-spin" /> Loading referred tests…
                        </div>
                      ) : testsState === "error" ? (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                          <AlertCircle className="h-8 w-8 text-soft-coral/60" />
                          <p className="text-sm text-dark-slate-gray/60">Could not load lab tests.</p>
                        </div>
                      ) : tests.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-6 text-center">
                          <CheckCircle2 className="h-7 w-7 text-mint-green/60" />
                          <p className="text-sm text-dark-slate-gray/60">No pending lab test referrals</p>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {tests.map((t) => (
                            <ReferredTestCard
                              key={t.id} item={t} patientId={patientId}
                              onDismiss={(id) => setTests((prev) => prev.filter((x) => x.id !== id))}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "followups" && (
                    <motion.div
                      key="followups"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {loadingFollowUps ? (
                        <div className="flex items-center gap-2 text-sm text-dark-slate-gray/60 py-4">
                          <Loader2 className="h-4 w-4 animate-spin" /> Loading follow-up requests…
                        </div>
                      ) : fuState === "error" ? (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                          <AlertCircle className="h-8 w-8 text-soft-coral/60" />
                          <p className="text-sm text-dark-slate-gray/60">Could not load follow-ups.</p>
                        </div>
                      ) : followUps.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-6 text-center">
                          <CheckCircle2 className="h-7 w-7 text-soft-blue/60" />
                          <p className="text-sm text-dark-slate-gray/60">No pending follow-up requests</p>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {followUps.map((f) => (
                            <FollowUpCard
                              key={f.id} item={f} patientId={patientId}
                              onDismiss={(id) => setFollowUps((prev) => prev.filter((x) => x.id !== id))}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}