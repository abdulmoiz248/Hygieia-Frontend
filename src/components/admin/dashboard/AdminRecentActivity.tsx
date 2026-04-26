'use client'

import { useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button }   from "@/components/ui/button"
import { Badge }    from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Clock, FileText, Users, Mail, CheckCircle2,
  FileUser, UserPlus, HelpCircle, Megaphone, Loader2,
} from "lucide-react"
import { useRecentActivity, ActivityItem } from "@/hooks/admin/dashboard/useRecentActivity"

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ElementType> = {
  FileText,
  CheckCircle2,
  FileUser,
  Mail,
  UserPlus,
  HelpCircle,
  Megaphone,
  Users,
}

// ─── Single activity row ──────────────────────────────────────────────────────

function ActivityRow({ item, relativeTime }: { item: ActivityItem; relativeTime: (d: Date) => string }) {
  const Icon = ICONS[item.icon] ?? Clock
  return (
    <div className="flex items-center p-4 rounded-xl bg-cool-gray/10 hover:bg-cool-gray/20 transition-all duration-200">
      <div className="flex items-center gap-3 w-full min-w-0">
        <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{item.label}</p>
          {item.sub && (
            <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
          )}
        </div>
        <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
          {relativeTime(item.timestamp)}
        </span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminRecentActivity() {
  const [open, setOpen] = useState(false)
  const { isLoading, recent, activities, relativeTime } = useRecentActivity()

  return (
    <>
      <Card className="bg-white/60 border-cool-gray/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" style={{ color: "var(--color-soft-blue)" }} />
            <span>Recent Activity</span>
            {activities.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto text-xs font-medium"
              >
                {activities.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Latest platform activity</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading activity…</span>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && activities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No recent activity yet</p>
            </div>
          )}

          {/* Activity list — first 3 */}
          {!isLoading && activities.length > 0 && (
            <div className="space-y-3">
              {recent.map((item) => (
                <ActivityRow key={item.id} item={item} relativeTime={relativeTime} />
              ))}
            </div>
          )}

          {/* View All button — always visible */}
          {!isLoading && (
            <Button
              onClick={() => setOpen(true)}
              className="w-full mt-5 text-white rounded-xl transition-all duration-200"
              style={{ background: "var(--gradient-primary)" }}
            >
              View All Activity {activities.length > 0 && `(${activities.length})`}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ── View All Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-cool-gray/15">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" style={{ color: "var(--color-soft-blue)" }} />
              All Activity
              <Badge variant="secondary" className="ml-auto text-xs">
                {activities.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable list */}
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
            {activities.map((item) => (
              <ActivityRow key={item.id} item={item} relativeTime={relativeTime} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
