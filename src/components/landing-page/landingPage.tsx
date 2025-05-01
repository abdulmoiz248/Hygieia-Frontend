import HeroSection from "@/components/landing-page/components/hero-section"
import HistoricalTimeline from "@/components/landing-page/components/historical-timeline"
import MissionStats from "@/components/landing-page/components/mission-stats"
import HowItWorks from "@/components/landing-page/components/how-it-works"
import HealthScoreQuiz from "@/components/landing-page/components/health-score-quiz"
import ClimateHealth from "@/components/landing-page/components/climate-health"
import DoctorQuiz from "@/components/landing-page/components/doctor-quiz"
import Testimonials from "@/components/landing-page/components/testimonials"
import BlogNewsletter from "@/components/landing-page/components/blog-newsletter"
import Faq from "@/components/landing-page/components/faq"
import FloatingAvatar from "@/components/landing-page/components/floating-avatar"
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "../layouts/landing-page/Footer"
import { BloodDonationHub } from "./components/blood-donation-hub"

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar/>
      <HeroSection />
      <HistoricalTimeline />
      <MissionStats />
      <HowItWorks />
      <HealthScoreQuiz />
       <BloodDonationHub/>
      <ClimateHealth />
      <DoctorQuiz />
      <Testimonials />
      <BlogNewsletter />
      <Faq />
      <Footer/>
      <FloatingAvatar />
    </main>
  )
}
