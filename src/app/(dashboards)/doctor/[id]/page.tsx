import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Users,
  Phone,
  Mail,
  MessageCircle,
  Video,
  ArrowLeft,
  Heart,
  BookmarkPlus,
  Download,
  Shield,
  Zap,
  Globe,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import type { Doctor } from "@/types/index"
import { ShareProfile } from "@/components/doctor dashboard/doctor profile/share-profile"
import { ReviewsSection } from "@/components/doctor dashboard/doctor profile/reviews-section"
import { AchievementsSection } from "@/components/doctor dashboard/doctor profile/achievements-section"
import { mockDoctors } from "@/mocks/data"

interface DoctorProfilePageProps {
  params: {
    id: string
  }
}

export default function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const doctor = mockDoctors.find((d) => d.id === params.id)

  if (!doctor) {
    notFound()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-snow-white via-mint-green/5 to-soft-blue/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-soft-blue/5 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-mint-green/5 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-soft-coral/5 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <Link href="/doctors">
            <Button variant="ghost" className="group hover:bg-soft-blue/10 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform duration-300" />
              Back to Doctors
            </Button>
          </Link>

          <div className="flex items-center gap-3">

            <Button
              variant="outline"
              className="group border-mint-green/20 hover:border-mint-green hover:bg-mint-green/5 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-mint-green" />
              Download Profile
            </Button>
          
            <ShareProfile doctorId={doctor.id} doctorName={doctor.name} />
          
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Doctor Header */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-soft-blue/5 to-mint-green/10 animate-scale-in relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-soft-blue/10 to-transparent rounded-bl-full"></div>
              <CardContent className="p-8 relative">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral rounded-full opacity-20 group-hover:opacity-30 transition-opacity animate-pulse-glow"></div>
                    <Avatar className="w-40 h-40 border-4 border-white shadow-2xl group-hover:scale-105 transition-all duration-500 relative z-10">
                      <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-soft-blue to-mint-green text-white">
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-mint-green to-soft-blue rounded-full p-3 shadow-xl animate-pulse">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div>
                      <h1 className="text-4xl font-bold gradient-text mb-3">{doctor.name}</h1>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className="bg-gradient-to-r from-soft-coral to-soft-coral/80 text-white text-base px-4 py-2 hover:scale-105 transition-transform">
                          {doctor.specialty}
                        </Badge>
                        <Badge variant="outline" className="border-mint-green text-mint-green bg-mint-green/5">
                          Verified Doctor
                        </Badge>
                        <Badge variant="outline" className="border-soft-blue text-soft-blue bg-soft-blue/5">
                          Available Today
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-cool-gray">
                        <div className="flex items-center gap-2 group">
                          <div className="flex items-center gap-1">
                            {renderStars(doctor.rating)}
                            <span className="ml-2 font-bold text-lg text-dark-slate-gray">{doctor.rating}</span>
                          </div>
                          <span className="text-sm">(1,247 reviews)</span>
                        </div>
                        <div className="flex items-center gap-2 group hover:text-soft-blue transition-colors">
                          <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">{doctor.location}</span>
                        </div>
                        <div className="flex items-center gap-2 group hover:text-mint-green transition-colors">
                          <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Online Consultations</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-soft-blue/10 rounded-full">
                        <Zap className="w-4 h-4 text-soft-blue" />
                        <span className="text-sm font-medium text-soft-blue">Quick Response</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-mint-green/10 rounded-full">
                        <Users className="w-4 h-4 text-mint-green" />
                        <span className="text-sm font-medium text-mint-green">1,200+ Patients</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-soft-coral/10 rounded-full">
                        <Award className="w-4 h-4 text-soft-coral" />
                        <span className="text-sm font-medium text-soft-coral">Top Rated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Calendar,
                  value: `${doctor.experience}+`,
                  label: "Years Experience",
                  color: "soft-blue",
                  delay: "0s",
                },
                { icon: Users, value: "1,200+", label: "Happy Patients", color: "mint-green", delay: "0.1s" },
                { icon: Award, value: "15+", label: "Awards Won", color: "soft-coral", delay: "0.2s" },
                {
                  icon: DollarSign,
                  value: `$${doctor.consultationFee}`,
                  label: "Consultation",
                  color: "purple-500",
                  delay: "0.3s",
                },
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card
                    key={index}
                    className="text-center p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50/50 group animate-slide-up relative overflow-hidden"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div
                      className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${stat.color}/20 to-${stat.color}/10 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10`}
                    >
                      <IconComponent className={`w-8 h-8 text-${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-dark-slate-gray mb-1 relative z-10">{stat.value}</div>
                    <div className="text-cool-gray text-sm font-medium relative z-10">{stat.label}</div>
                  </Card>
                )
              })}
            </div>

            {/* Enhanced Tabbed Content */}
            <Tabs defaultValue="about" className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm border border-gray-200/50">
                <TabsTrigger value="about" className="data-[state=active]:bg-soft-blue data-[state=active]:text-white">
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-mint-green data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="data-[state=active]:bg-soft-coral data-[state=active]:text-white"
                >
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-soft-blue/5">
                  <CardHeader>
                    <CardTitle className="text-dark-slate-gray text-2xl">About {doctor.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-cool-gray leading-relaxed text-lg">
                      {doctor.name} is a highly experienced {doctor.specialty.toLowerCase()} with over{" "}
                      {doctor.experience} years of practice. Known for providing compassionate care and utilizing the
                      latest medical technologies, Dr. {doctor.name.split(" ")[1]} has helped thousands of patients
                      achieve better health outcomes through innovative treatment approaches and personalized care
                      plans.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-dark-slate-gray text-lg flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          Specializations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Heart Disease",
                            "Preventive Care",
                            "Cardiac Surgery",
                            "Hypertension",
                            "Arrhythmia",
                            "Heart Failure",
                          ].map((spec, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-mint-green/10 text-mint-green border-mint-green/20 hover:bg-mint-green/20 transition-colors"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-dark-slate-gray text-lg flex items-center gap-2">
                          <BookmarkPlus className="w-5 h-5 text-soft-blue" />
                          Education & Certifications
                        </h4>
                        <ul className="space-y-3 text-cool-gray">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-mint-green mt-1 flex-shrink-0" />
                            MD from Harvard Medical School (2012)
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-mint-green mt-1 flex-shrink-0" />
                            Residency at Johns Hopkins Hospital
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-mint-green mt-1 flex-shrink-0" />
                            Board Certified in {doctor.specialty}
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-mint-green mt-1 flex-shrink-0" />
                            Fellow of the American College of Cardiology
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ReviewsSection />
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <AchievementsSection />
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Booking Card */}
            <Card className="border-0 shadow-2xl sticky top-8 animate-slide-in-right overflow-hidden">
              
              <CardHeader className="bg-gradient-to-br from-soft-blue via-soft-blue/90 to-mint-green text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardTitle className="text-center text-xl relative z-10">Book Consultation</CardTitle>
                <CardDescription className="text-center text-white/90 relative z-10">
                  Available for appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center p-4 bg-gradient-to-r from-soft-blue/5 to-mint-green/5 rounded-xl">
                  <div className="text-4xl font-bold gradient-text">${doctor.consultationFee}</div>
                  <div className="text-cool-gray text-sm">per consultation</div>
                  {/* <Badge className="mt-2 bg-mint-green/10 text-mint-green">20% off first visit</Badge> */}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-soft-blue to-soft-blue/90 hover:from-soft-blue/90 hover:to-soft-blue text-white group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Video className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Online Appointment</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-mint-green text-mint-green hover:bg-mint-green hover:text-white group bg-transparent relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-mint-green translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                    <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">In-Person Visit</span>
                  </Button>

                 
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  {[
                    { icon: Clock, text: "Available Mon-Fri, 9AM-6PM", color: "text-soft-blue" },
                    { icon: Phone, text: "Emergency: (555) 123-4567", color: "text-mint-green" },
                    { icon: Mail, text: "Response within 2 hours", color: "text-soft-coral" },
                    { icon: Shield, text: "100% Secure & Private", color: "text-purple-500" },
                  ].map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <IconComponent className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-cool-gray group-hover:text-dark-slate-gray transition-colors">
                          {item.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Info Card */}
            <Card
              className="border-0 shadow-xl animate-slide-in-right bg-gradient-to-br from-white to-mint-green/5"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="text-dark-slate-gray flex items-center gap-2">
                  <Award className="w-5 h-5 text-soft-blue" />
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Languages", value: "English, Spanish, French", icon: Globe },
                  { label: "Insurance", value: "Most Plans Accepted", icon: Shield },
                  { label: "Next Available", value: "Today 3:00 PM", icon: Clock, highlight: true },
                  { label: "Response Time", value: "< 2 hours", icon: Zap },
                ].map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-white/50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-cool-gray group-hover:text-soft-blue transition-colors" />
                        <span className="text-cool-gray">{item.label}:</span>
                      </div>
                      <span
                        className={`font-medium ${item.highlight ? "text-mint-green" : "text-dark-slate-gray"} group-hover:scale-105 transition-transform`}
                      >
                        {item.value}
                      </span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
