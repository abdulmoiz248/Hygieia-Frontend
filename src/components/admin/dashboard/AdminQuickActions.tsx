"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Mail, Zap, BookOpen } from "lucide-react"

export default function AdminQuickActions() {
  return (
    <Card className="bg-white/60 border-cool-gray/15">
      
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5" style={{ color: "var(--color-mint-green)" }} />
          Quick Actions
        </CardTitle>
        <CardDescription>Manage platform features</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        
        {/* Blogs */}
        <a
          href="/admin/blogs"
          className="block p-3 rounded-xl bg-gradient-to-br from-soft-blue/10 to-soft-blue/5 hover:from-soft-blue/20 hover:to-soft-blue/10 transition-all duration-200"
        >
          <p className="font-semibold text-soft-blue flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Manage Blogs
          </p>
          <p className="text-xs text-cool-gray mt-1">Review and approve content</p>
        </a>

        {/* Workers */}
        <a
          href="/admin/users"
          className="block p-3 rounded-xl bg-gradient-to-br from-mint-green/10 to-mint-green/5 hover:from-mint-green/20 hover:to-mint-green/10 transition-all duration-200"
        >
          <p className="font-semibold text-mint-green flex items-center gap-2">
            <Users className="w-4 h-4" />
            Manage Workers
          </p>
          <p className="text-xs text-cool-gray mt-1">View and manage workers</p>
        </a>

        {/* CVs */}
        <a
          href="/admin/cvs"
          className="block p-3 rounded-xl bg-gradient-to-br from-soft-coral/10 to-soft-coral/5 hover:from-soft-coral/20 hover:to-soft-coral/10 transition-all duration-200"
        >
          <p className="font-semibold text-soft-coral flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Review CVs
          </p>
          <p className="text-xs text-cool-gray mt-1">Check pending CV submissions</p>
        </a>

        {/* FAQs */}
        <a
          href="/admin/faq"
          className="block p-3 rounded-xl bg-gradient-to-br from-cool-gray/10 to-cool-gray/5 hover:from-cool-gray/20 hover:to-cool-gray/10 transition-all duration-200"
        >
          <p className="font-semibold text-cool-gray flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Manage FAQs
          </p>
          <p className="text-xs text-muted-foreground mt-1">Update help resources</p>
        </a>

      </CardContent>
    </Card>
  )
}