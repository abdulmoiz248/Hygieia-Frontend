"use client"

import { useState } from "react"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const Footer = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  return (
    <footer id="contact" className="w-full bg-gradient-to-br from-slate-800 to-[#2C3E50] text-white">
      {/* Top wave decoration */}
      <div className="wave-top h-12 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-[#FAFAFA]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Logo and intro */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src='/logo/hygieia-logo.png' className="h-12 w-12 rounded-full bg-[#FF6F61]"></img>
              <h2 className="ml-3 text-2xl font-bold">Hygieia</h2>
            </div>
            <p className="text-[#7F8C8D] max-w-xs">
              Dedicated to providing innovative solutions for a better tomorrow.
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-[#A8E6CF]">Contact Us</h3>
            <ul className="space-y-4 text-[#7F8C8D]">
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-[#FF6F61]">📍</span>
                <span>123 Hygieia Street, Lahore, Pakistan</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-[#FF6F61]">📞</span>
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-[#FF6F61]">✉️</span>
                <a href="mailto:contact@hygieia.com" className="hover:text-[#4A90E2] transition-colors">
                  contact@hygieia.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-[#A8E6CF]">Quick Links</h3>
            <ul className="space-y-3">
              {["About Us", "Services", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="group flex items-center text-[#7F8C8D] transition-colors hover:text-[#4A90E2]"
                  >
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#FF6F61] transition-all group-hover:bg-[#4A90E2] group-hover:scale-150"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-[#4A90E2]"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-[#FF6F61]"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-[#A8E6CF]"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
          <p className="mb-4 text-center text-sm text-[#7F8C8D] md:mb-0">
            © {new Date().getFullYear()} Hygieia. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button onClick={() => setShowPrivacyModal(true)} className="text-sm text-[#7F8C8D] hover:text-[#A8E6CF]">
              Privacy Policy
            </button>
            <button onClick={() => setShowTermsModal(true)} className="text-sm text-[#7F8C8D] hover:text-[#A8E6CF]">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-3xl bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
  <h3 className="text-lg font-semibold">1. Introduction</h3>
  <p>
    Hey there! Welcome to Hygieia’s Privacy Policy. We’re all about keeping your data safe and transparent. This policy breaks down exactly what we collect, how we use it, and how we guard it—no filler, no BS.
  </p>

  <h3 className="text-lg font-semibold">2. Information We Collect</h3>
  <p>
    When you vibe with our platform—signing up, chatting with a doctor, or subscribing to our newsletter—we might grab stuff like:
  </p>
  <ul className="list-disc list-inside space-y-1">
    <li>Your name and email so we can hit you back.</li>
    <li>Phone number & location to connect you with nearby health pros.</li>
    <li>Any profile details you share (age, gender, medical history) to personalize your experience.</li>
    <li>Technical data (device info, IP address, analytics) so we know what rocks and what flops.</li>
  </ul>

  <h3 className="text-lg font-semibold">3. How We Use Your Information</h3>
  <p>
    Here’s the deal: we use your info to power up Hygieia. That means:
  </p>
  <ul className="list-disc list-inside space-y-1">
    <li>Deliver core services like video calls, chat, and e-prescriptions.</li>
    <li>Send you updates, tips, and newsletters you actually care about.</li>
    <li>Analyze trends so we can level up features and fix bugs—fast.</li>
    <li>Stay compliant with laws and keep our platform legit.</li>
  </ul>

  <h3 className="text-lg font-semibold">4. Data Security</h3>
  <p>
    We treat your personal info like a diamond. We’ve got SSL encryption, secure servers, and best-practice protocols to block unauthorized access, leaks, or tweaks. If stuff ever goes sideways, we’ll let you know ASAP.
  </p>

  <h3 className="text-lg font-semibold">5. Your Rights</h3>
  <p>
    You’re the boss of your data. You can:
  </p>
  <ul className="list-disc list-inside space-y-1">
    <li>Request access to what we’ve got on you.</li>
    <li>Correct any details that are outdated or wrong.</li>
    <li>Ask us to delete your info (we’ll wipe it, no drama).</li>
    <li>Opt out of marketing communications at any time.</li>
  </ul>

  <h3 className="text-lg font-semibold">6. Contact Us</h3>
  <p>
    Got questions, concerns, or just wanna rant about privacy? Hit us up at <a href="mailto:privacy@hygieia.com" className="text-softCoral">privacy@hygieia.com</a>. We’ll keep it 100 and get back to you within 48 hours.
  </p>
</div>

        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] bg-white overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
  <h3 className="text-lg font-semibold">1. AcceptanceOfTerms</h3>
  <p>
    By hopping onto Hygieia—whether you’re booking a doc, chatting in our app, or just browsing—you’re down with these Terms of Service. No exceptions.
  </p>

  <h3 className="text-lg font-semibold">2. useOfServices</h3>
  <p>
    You’ll use our platform only for legit, lawful stuff. Don’t go wild with anything shady or sketchy—keep it clean.
  </p>

  <h3 className="text-lg font-semibold">3. userAccounts</h3>
  <p>
    Your account creds? Your biz. Keep them locked down. Anything that happens under your login is on you—so don’t share that password.
  </p>

  <h3 className="text-lg font-semibold">4. intellectualProperty</h3>
  <p>
    All the content, code, logos, and magic behind Hygieia belong to us. Don’t copy, remix, or resell without our explicit permission—you’ll be stepping on copyright and trademark laws.
  </p>

  <h3 className="text-lg font-semibold">5. limitationOfLiability</h3>
  <p>
    We built Hygieia with love, but we can’t cover every single glitch or freak accident. We’re not on the hook for any indirect, special, or punitive damages—use at your own risk.
  </p>

  <h3 className="text-lg font-semibold">6. changesToTerms</h3>
  <p>
    We might tweak these Terms from time to time. When we do, we’ll post the update here. If you keep using Hygieia after a change—congrats, you just accepted it.
  </p>

  <h3 className="text-lg font-semibold">7. termination</h3>
  <p>
    If you break the rules or just act out, we reserve the right to suspend or terminate your account without warning. No hard feelings—but we gotta keep the community safe.
  </p>
</div>

        </DialogContent>
      </Dialog>
    </footer>
  )
}

export default Footer
