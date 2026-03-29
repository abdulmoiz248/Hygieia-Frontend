'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, FileText, Mail } from "lucide-react"

export default function AdminRecentActivity() {
  return (
    <Card className="bg-white/60 border-cool-gray/15">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" style={{ color: "var(--color-soft-blue)" }} />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription>Latest platform activity</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          
          {/* Blog Activity */}
          <div className="flex items-center p-4 rounded-xl bg-cool-gray/10 hover:bg-cool-gray/20 transition-all duration-200">
            <div className="flex items-center gap-3 w-full">
              <FileText className="w-4 h-4 text-soft-coral flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">New blog post submitted</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="flex items-center p-4 rounded-xl bg-cool-gray/10 hover:bg-cool-gray/20 transition-all duration-200">
            <div className="flex items-center gap-3 w-full">
              <Users className="w-4 h-4 text-mint-green flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
          </div>

          {/* CV Activity (updated) */}
          <div className="flex items-center p-4 rounded-xl bg-cool-gray/10 hover:bg-cool-gray/20 transition-all duration-200">
            <div className="flex items-center gap-3 w-full">
              <Mail className="w-4 h-4 text-soft-blue flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">New CV submitted for review</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>

        </div>

        {/* Themed Button */}
        <Button
          className="w-full mt-5 text-white rounded-xl hover:from-soft-blue/20 hover:to-soft-blue/10 transition-all duration-200"
          style={{
            background: "var(--gradient-primary)"
          }}
        >
          View All Activity
        </Button>
      </CardContent>
    </Card>
  )
}