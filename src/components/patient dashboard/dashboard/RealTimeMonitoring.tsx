"use client"

import { motion } from "framer-motion"
import { Heart, Activity, Thermometer, Droplets, Eye, Brain, Zap, AlertCircle, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Mock real-time data
const realTimeMetrics = [
  {
    name: "Heart Rate",
    value: 72,
    unit: "BPM",
    status: "normal",
    trend: "stable",
    icon: Heart,
    color: "var(--color-soft-coral)",
    bgColor: "bg-soft-coral/20",
    borderColor: "border-soft-coral/30",
    range: { min: 60, max: 100 },
    lastUpdate: "2 min ago"
  },
  {
    name: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "normal",
    trend: "improving",
    icon: Activity,
    color: "var(--color-soft-blue)",
    bgColor: "bg-soft-blue/20",
    borderColor: "border-soft-blue/30",
    range: { min: 90, max: 140 },
    lastUpdate: "5 min ago"
  },
  {
    name: "Body Temperature",
    value: 98.6,
    unit: "°F",
    status: "normal",
    trend: "stable",
    icon: Thermometer,
    color: "var(--color-mint-green)",
    bgColor: "bg-mint-green/20",
    borderColor: "border-mint-green/30",
    range: { min: 97, max: 99 },
    lastUpdate: "1 min ago"
  },
  {
    name: "Oxygen Saturation",
    value: 98,
    unit: "%",
    status: "excellent",
    trend: "stable",
    icon: Eye,
    color: "var(--color-cool-gray)",
    bgColor: "bg-cool-gray/20",
    borderColor: "border-cool-gray/30",
    range: { min: 95, max: 100 },
    lastUpdate: "3 min ago"
  }
]

const healthAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Blood Pressure Elevated",
    message: "Your blood pressure reading is slightly above normal range. Consider stress management techniques.",
    severity: "medium",
    time: "10 min ago",
    action: "Monitor closely",
    icon: AlertCircle,
    color: "text-soft-coral",
    bgColor: "bg-soft-coral/20"
  },
  {
    id: 2,
    type: "info",
    title: "Medication Reminder",
    message: "Time to take your evening medication. Don't forget to log it in your tracker.",
    severity: "low",
    time: "15 min ago",
    action: "Take medication",
    icon: Clock,
    color: "text-mint-green",
    bgColor: "bg-mint-green/20"
  },
  {
    id: 3,
    type: "success",
    title: "Exercise Goal Achieved",
    message: "Congratulations! You've reached your daily step goal of 10,000 steps.",
    severity: "low",
    time: "1 hour ago",
    action: "View details",
    icon: CheckCircle,
    color: "text-mint-green",
    bgColor: "bg-mint-green/20"
  }
]

const activityStream = [
  {
    time: "2:30 PM",
    activity: "Blood pressure reading recorded",
    value: "118/75 mmHg",
    status: "normal",
    icon: Activity,
    color: "text-mint-green"
  },
  {
    time: "2:15 PM",
    activity: "Heart rate measurement",
    value: "68 BPM",
    status: "normal",
    icon: Heart,
    color: "text-soft-coral"
  },
  {
    time: "2:00 PM",
    activity: "Medication taken",
    value: "Lisinopril 10mg",
    status: "completed",
    icon: CheckCircle,
    color: "text-mint-green"
  },
  {
    time: "1:45 PM",
    activity: "Exercise session completed",
    value: "30 min cardio",
    status: "completed",
    icon: Zap,
    color: "text-soft-blue"
  },
  {
    time: "1:30 PM",
    activity: "Water intake logged",
    value: "8 glasses",
    status: "on-track",
    icon: Droplets,
    color: "text-mint-green"
  }
]

export default function RealTimeMonitoring() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-mint-green'
      case 'normal': return 'text-soft-blue'
      case 'warning': return 'text-soft-coral'
      case 'critical': return 'text-red-500'
      default: return 'text-cool-gray'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-mint-green" />
      case 'declining': return <TrendingUp className="w-4 h-4 text-soft-coral" />
      case 'stable': return <div className="w-4 h-4 bg-cool-gray rounded-full" />
      default: return <div className="w-4 h-4 bg-cool-gray rounded-full" />
    }
  }

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Real-time Health Metrics */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-soft-coral/10 to-soft-blue/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-soft-coral/20 rounded-lg">
              <Activity className="w-5 h-5 text-soft-coral" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Real-time Health Monitoring</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Live health data and trends</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-mint-green' : 'bg-soft-coral'}`} />
              <span className="text-xs text-dark-slate-gray/60">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realTimeMetrics.map((metric, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${metric.borderColor} ${metric.bgColor} transition-all duration-200 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                    <span className="text-sm font-medium text-dark-slate-gray/70">{metric.name}</span>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                
                <div className="text-2xl font-bold text-dark-slate-gray/90 mb-1">
                  {metric.value} <span className="text-sm font-normal">{metric.unit}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(metric.status)} bg-white/50`}
                  >
                    {metric.status}
                  </Badge>
                  <span className="text-xs text-dark-slate-gray/60">
                    {metric.range.min}-{metric.range.max}
                  </span>
                </div>
                
                <div className="text-xs text-dark-slate-gray/60">
                  Updated: {metric.lastUpdate}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts & Notifications */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-mint-green/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-soft-blue/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-soft-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Health Alerts & Notifications</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Important updates and reminders</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {healthAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border border-white/20 ${alert.bgColor} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${alert.bgColor} ${alert.color}`}>
                    <alert.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-dark-slate-gray/90">{alert.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          alert.severity === 'high' ? 'bg-soft-coral/20 text-soft-coral border-soft-coral/30' :
                          alert.severity === 'medium' ? 'bg-soft-blue/20 text-soft-blue border-soft-blue/30' :
                          'bg-mint-green/20 text-mint-green border-mint-green/30'
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-dark-slate-gray/70 mb-3">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dark-slate-gray/60">{alert.time}</span>
                      <button className="text-xs font-medium text-soft-blue hover:text-soft-blue/80 transition-colors">
                        {alert.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Stream */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-mint-green/10 to-soft-coral/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-mint-green/20 rounded-lg">
              <Zap className="w-5 h-5 text-mint-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Activity Stream</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Recent health activities and measurements</p>
            </div>
            <div className="ml-auto text-xs text-dark-slate-gray/60">
              {currentTime.toLocaleTimeString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {activityStream.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/30 rounded-lg border border-white/20 transition-all duration-200 hover:bg-white/40"
              >
                <div className={`p-2 rounded-lg bg-white/50 ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-dark-slate-gray/80">{activity.activity}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        activity.status === 'completed' ? 'bg-mint-green/20 text-mint-green border-mint-green/30' :
                        activity.status === 'on-track' ? 'bg-soft-blue/20 text-soft-blue border-soft-blue/30' :
                        'bg-cool-gray/20 text-cool-gray border-cool-gray/30'
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-dark-slate-gray/70">{activity.value}</div>
                </div>
                <div className="text-xs text-dark-slate-gray/60">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cool-gray/10 to-dark-slate-gray/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-cool-gray/20 rounded-lg">
              <Brain className="w-5 h-5 text-cool-gray" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">System Status</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Monitoring system health</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/30 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-mint-green" />
                <span className="text-sm font-medium text-dark-slate-gray/70">Data Sync</span>
              </div>
              <div className="text-lg font-bold text-dark-slate-gray/90">Active</div>
              <div className="text-xs text-dark-slate-gray/60">Last sync: 2 min ago</div>
            </div>
            
            <div className="p-4 bg-white/30 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-mint-green" />
                <span className="text-sm font-medium text-dark-slate-gray/70">Device Connection</span>
              </div>
              <div className="text-lg font-bold text-dark-slate-gray/90">Connected</div>
              <div className="text-xs text-dark-slate-gray/60">3 devices active</div>
            </div>
            
            <div className="p-4 bg-white/30 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-mint-green" />
                <span className="text-sm font-medium text-dark-slate-gray/70">AI Analysis</span>
              </div>
              <div className="text-lg font-bold text-dark-slate-gray/90">Running</div>
              <div className="text-xs text-dark-slate-gray/60">Processing health data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
