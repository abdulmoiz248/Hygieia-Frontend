"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Lock, Smartphone, Globe, Moon, Shield, LogOut, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    appointments: true,
    medications: true,
    healthTips: false,
    marketing: false,
  })

  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-dark-slate-gray">Settings</h1>
        <p className="text-cool-gray">Manage your account preferences and privacy settings</p>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-soft-blue" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="appointments">Appointment Reminders</Label>
                <p className="text-sm text-cool-gray">Get notified about upcoming appointments</p>
              </div>
              <Switch
                id="appointments"
                checked={notifications.appointments}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, appointments: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="medications">Medication Reminders</Label>
                <p className="text-sm text-cool-gray">Reminders to take your medications</p>
              </div>
              <Switch
                id="medications"
                checked={notifications.medications}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, medications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="healthTips">Health Tips</Label>
                <p className="text-sm text-cool-gray">Weekly health and wellness tips</p>
              </div>
              <Switch
                id="healthTips"
                checked={notifications.healthTips}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, healthTips: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing">Marketing Communications</Label>
                <p className="text-sm text-cool-gray">Updates about new features and services</p>
              </div>
              <Switch
                id="marketing"
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketing: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-mint-green" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Password</Label>
                <p className="text-sm text-cool-gray">Last changed 3 months ago</p>
              </div>
              <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current">Current Password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new">New Password</Label>
                      <Input id="new" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm">Confirm New Password</Label>
                      <Input id="confirm" type="password" />
                    </div>
                    <Button className="w-full bg-mint-green hover:bg-mint-green/90">Update Password</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-cool-gray">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                <Smartphone className="w-4 h-4 mr-2" />
                Enable 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active Sessions</Label>
                <p className="text-sm text-cool-gray">Manage your logged-in devices</p>
              </div>
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                View Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-soft-coral" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-cool-gray">Switch to dark theme</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Language</Label>
                <p className="text-sm text-cool-gray">Choose your preferred language</p>
              </div>
              <Button variant="outline" size="sm">
                English (US)
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Time Zone</Label>
                <p className="text-sm text-cool-gray">Automatically detected</p>
              </div>
              <Button variant="outline" size="sm">
                EST (UTC-5)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-soft-coral">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sign Out</Label>
                <p className="text-sm text-cool-gray">Sign out from all devices</p>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-soft-coral">Delete Account</Label>
                <p className="text-sm text-cool-gray">Permanently delete your account and data</p>
              </div>
              <Dialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-soft-coral border-soft-coral hover:bg-soft-coral/10 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-soft-coral">Delete Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-soft-coral/10 p-4 rounded-lg">
                      <p className="text-sm text-soft-coral font-medium">
                        ⚠️ This action cannot be undone. This will permanently delete your account and remove all your
                        data from our servers.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="confirm-delete">Type &quot;DELETE&quot; to confirm</Label>
                      <Input id="confirm-delete" placeholder="DELETE" />
                    </div>
                    <Button className="w-full bg-soft-coral hover:bg-soft-coral/90" disabled>
                      I understand, delete my account
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
