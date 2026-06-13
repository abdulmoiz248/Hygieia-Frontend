import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service — Hygieia",
  description: "Terms and conditions governing your use of the Hygieia healthcare platform.",
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-slate-gray to-mint-green py-16 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-snow-white/70 hover:text-snow-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-dark-slate-gray to-soft-coral px-8 py-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-mint-green" />
              </div>
              <span className="text-mint-green font-semibold text-sm uppercase tracking-widest">Hygieia</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Terms of Service</h1>
            <div className="flex flex-col sm:flex-row gap-2 text-snow-white/70 text-sm">
              <span><strong className="text-snow-white/90">Last Updated:</strong> May 28, 2026</span>
              <span className="hidden sm:inline">·</span>
              <span><strong className="text-snow-white/90">Effective Date:</strong> May 28, 2026</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10 space-y-10 text-gray-700 leading-relaxed">

            {/* 1 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing, registering for, or using the Hygieia platform ("Platform," "Service," "we," "us," or
                "our"), you ("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"). If you
                do not agree to these Terms, you must not use the Platform.
              </p>
              <p className="mt-3">
                These Terms apply to all users of the Platform, including patients, doctors, nutritionists, lab
                technicians, and administrators.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">2. Description of Service</h2>
              <p>Hygieia is a healthcare management platform that provides:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
                <li><strong>Patient Services:</strong> Health profile management, appointment booking, lab test ordering, fitness tracking, diet plan management, medical record storage, medication adherence tracking, and patient journaling.</li>
                <li><strong>AI-Powered Features:</strong> Personalized health recommendations, an AI health chatbot, image-based acne and dental condition predictions, and semantic search capabilities.</li>
                <li><strong>Healthcare Worker Tools:</strong> Patient management, appointment scheduling, consultation workflows, and professional profile management.</li>
                <li><strong>Fitness Integration:</strong> Workout session tracking and Fitbit integration.</li>
                <li><strong>Communication Services:</strong> Email notifications, appointment reminders, newsletters, blog content, FAQs, and platform announcements.</li>
                <li><strong>Administrative Functions:</strong> User management, analytics dashboards, feedback collection, and worker reports.</li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">3. Eligibility</h2>
              <p>To use Hygieia, you must:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Be at least <strong>16 years of age</strong> (or have parental/guardian consent)</li>
                <li>Provide a valid email address</li>
                <li>Agree to these Terms and our Privacy Policy</li>
              </ul>
              <p className="mt-3">Healthcare worker accounts are created by platform administrators. Workers must be qualified professionals authorized to provide healthcare services in their respective jurisdictions.</p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">4. Account Registration &amp; Security</h2>

              <h3 className="font-semibold text-dark-slate-gray mb-2">4.1 Patient Registration</h3>
              <p>You register using your email address and a password of at least 8 characters containing uppercase letters, lowercase letters, and numbers. A 6-digit OTP is sent via email to verify your account. You may also register using Google OAuth.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">4.2 Healthcare Worker Registration</h3>
              <p>Worker accounts are created by platform administrators. A system-generated @hygieia.com email and password will be sent to your personal email. Workers are pre-verified upon creation.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">4.3 Account Security</h3>
              <p>You are responsible for maintaining the confidentiality of your login credentials, all activities that occur under your account, and notifying us immediately of any unauthorized access.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">4.4 One Account Per User</h3>
              <p>Each user may maintain only one account. Creating multiple accounts to circumvent restrictions is prohibited.</p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">5. User Conduct</h2>

              <h3 className="font-semibold text-dark-slate-gray mb-2">5.1 Acceptable Use</h3>
              <p>You agree to use the Platform only for lawful, healthcare-related purposes, provide accurate and truthful information, and comply with all applicable laws and regulations.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">5.2 Prohibited Activities</h3>
              <p>You agree <strong>not</strong> to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Provide false, misleading, or fraudulent information</li>
                <li>Impersonate another person or healthcare professional</li>
                <li>Attempt to gain unauthorized access to other users' accounts or data</li>
                <li>Use the Platform to harass, abuse, or harm others</li>
                <li>Reverse-engineer or attempt to extract the source code of the Platform</li>
                <li>Interfere with or disrupt the Platform's infrastructure</li>
                <li>Upload malicious files, viruses, or harmful content</li>
                <li>Use automated tools (bots, scrapers) without authorization</li>
                <li>Share your healthcare worker credentials with unauthorized individuals</li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">6. Healthcare Disclaimer</h2>
              <div className="bg-soft-coral/5 border border-soft-coral/25 rounded-lg p-5 mb-4">
                <p className="font-semibold text-soft-coral mb-1">Important Notice</p>
                <p className="text-sm">Hygieia is a health management and information platform. It is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider for any medical condition.</p>
              </div>

              <h3 className="font-semibold text-dark-slate-gray mb-2">6.2 AI Limitations</h3>
              <p>AI-generated recommendations, chatbot responses, and image-based predictions are generated using machine learning models that may produce inaccurate or incomplete results. They should <strong>not</strong> be relied upon as a sole basis for medical decisions and are not reviewed by a healthcare professional before delivery unless explicitly stated.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">6.3 Healthcare Provider Responsibility</h3>
              <p>Doctors, nutritionists, and lab technicians are independently responsible for the accuracy of their professional advice, maintaining their licenses, and complying with applicable healthcare regulations. Hygieia does not verify, endorse, or guarantee the qualifications of healthcare workers on the Platform.</p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">7. Appointments &amp; Bookings</h2>
              <p>You may book appointments with available doctors and nutritionists. Appointment availability is subject to the healthcare provider's schedule. Cancellation policies are set by individual healthcare providers. Repeated no-shows may result in restricted booking privileges.</p>
              <p className="mt-3">Lab test bookings are facilitated through the Platform. Hygieia is not responsible for the accuracy of lab results; that responsibility lies with the lab technician and the testing processes used.</p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">8. Fitbit Integration</h2>
              <p>By connecting Fitbit, you authorize Hygieia to access activity, heart rate, location, nutrition, profile, settings, sleep, social, and weight data scopes. You may disconnect Fitbit at any time; previously imported data may be retained unless you request deletion. Your use of Fitbit is also subject to Fitbit's own Terms of Service and Privacy Policy.</p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">9. Intellectual Property</h2>
              <p>The Hygieia platform, including its software, design, architecture, AI models, branding, and documentation, is owned by the Hygieia development team and protected by intellectual property laws.</p>
              <p className="mt-3">You retain ownership of any content you submit (profile data, health records, journal entries, images). By submitting content, you grant Hygieia a non-exclusive, worldwide license to use, store, process, and display your content solely for providing the Platform's services to you.</p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">10. Data &amp; Privacy</h2>
              <p>Your privacy is important to us. Please review our{" "}
                <Link href="/privacy-policy" className="text-soft-blue hover:underline font-medium">Privacy Policy</Link>{" "}
                for detailed information about what data we collect, how we use and store it, your rights, and the third-party services we use. The Privacy Policy is incorporated into these Terms by reference.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">11. Email Communications</h2>
              <p>By using the Platform, you consent to receive transactional emails (OTP verification, password reset, appointment confirmations), service emails (appointment reminders, lab result notifications, health recommendations), and newsletters (you may unsubscribe at any time).</p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">12. Limitation of Liability</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-sm space-y-3">
                <p>Hygieia is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis. We do not guarantee uninterrupted availability, freedom from errors, or indefinite data preservation.</p>
                <p>To the maximum extent permitted by law, we disclaim all warranties, express or implied, including those regarding the accuracy of AI-generated content or the qualifications of healthcare providers on the Platform.</p>
                <p>Hygieia and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or reliance on AI-generated content.</p>
              </div>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">13. Account Termination</h2>
              <p>You may request account deletion by contacting the platform administrator. We reserve the right to suspend or terminate your account if you violate these Terms, provide false information, or engage in prohibited activities. Upon removal of a healthcare worker account, a confirmation email is sent to the worker's personal email address.</p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">14. Modifications to the Service</h2>
              <p>We reserve the right to modify, update, or discontinue any feature of the Platform at any time. We will notify you of material changes via email or in-app notification. Your continued use after changes are posted constitutes acceptance of the modified Terms.</p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">15. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the applicable laws of the jurisdiction in which the Platform operates. Any disputes shall be resolved through good-faith negotiation before pursuing formal legal remedies.</p>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">16. Severability</h2>
              <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
            </section>

            {/* 17 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">17. Entire Agreement</h2>
              <p>These Terms, together with the{" "}
                <Link href="/privacy-policy" className="text-soft-blue hover:underline font-medium">Privacy Policy</Link>,
                constitute the entire agreement between you and Hygieia regarding your use of the Platform and supersede all prior agreements or understandings.
              </p>
            </section>

            {/* 18 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">18. Contact Us</h2>
              <div className="bg-mint-green/10 border border-mint-green/20 rounded-lg p-5">
                <p className="font-medium text-dark-slate-gray mb-2">If you have questions about these Terms of Service:</p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Email:</strong>{" "}<a href="mailto:support@hygieia.com" className="text-soft-blue hover:underline">support@hygieia.com</a></li>
                  <li><strong>Platform:</strong> Hygieia Healthcare Platform</li>
                </ul>
              </div>
            </section>

            {/* Footer note */}
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-6">
              These Terms of Service were last reviewed and updated on <strong>May 28, 2026</strong>.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
