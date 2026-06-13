import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy — Hygieia",
  description: "How Hygieia collects, uses, and protects your personal and health data.",
}

export default function PrivacyPolicyPage() {
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
          <div className="bg-gradient-to-r from-dark-slate-gray to-soft-blue px-8 py-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-mint-green" />
              </div>
              <span className="text-mint-green font-semibold text-sm uppercase tracking-widest">Hygieia</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
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
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">1. Introduction</h2>
              <p>
                Welcome to Hygieia ("we," "us," "our," or the "Platform"). Hygieia is a healthcare management
                platform that connects patients with doctors, nutritionists, and lab technicians to provide
                comprehensive health services.
              </p>
              <p className="mt-3">
                We are committed to protecting your privacy and handling your personal and health-related data
                responsibly. This Privacy Policy explains what information we collect, how we use it, how we store
                it, and your rights regarding that information.
              </p>
              <p className="mt-3">
                By creating an account or using the Platform, you agree to the practices described in this Privacy
                Policy. If you do not agree with these practices, please do not use the Platform.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">2. Information We Collect</h2>

              <h3 className="font-semibold text-dark-slate-gray mb-2">2.1 Account Information</h3>
              <p>When you register for Hygieia, we collect:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li><strong>Email address</strong> (used as your primary identifier and for communication)</li>
                <li><strong>Password</strong> (stored in hashed form using bcrypt; we never store plaintext passwords)</li>
                <li><strong>Account role</strong> (patient, doctor, nutritionist, lab technician, or admin)</li>
              </ul>
              <p className="mt-3">For healthcare workers, we also collect:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li><strong>Full name</strong></li>
                <li><strong>Personal email address</strong> (separate from the assigned @hygieia.com work email)</li>
              </ul>

              <h3 className="font-semibold text-dark-slate-gray mt-5 mb-2">2.2 Profile Information</h3>
              <p><strong>Patients</strong> may provide: name, phone number, date of birth, gender, address, emergency contact, profile photo, blood type, height, and weight.</p>
              <p className="mt-2"><strong>Doctors &amp; Nutritionists</strong> may provide: name, phone, gender, date of birth, profile photo, specialization, years of experience, certifications, education, languages spoken, bio, consultation fee, working hours, and professional rating.</p>
              <p className="mt-2"><strong>Lab Technicians</strong> may provide: name, phone number, gender, date of birth, and profile photo.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-5 mb-2">2.3 Health &amp; Medical Data</h3>
              <div className="bg-soft-coral/5 border border-soft-coral/20 rounded-lg p-4 mt-2">
                <p className="text-sm font-semibold text-soft-coral mb-1">Important</p>
                <p className="text-sm">Health data is classified as sensitive personal data. We apply additional safeguards to protect this information.</p>
              </div>
              <p className="mt-3">As a healthcare platform, we collect and process sensitive health information including allergies, medical conditions, current medications, surgery history, implants, vaccination records, pregnancy status, mental health information, family medical history, organ donor status, disabilities, lifestyle information, health score, medication adherence, lab test results, medical records, prescription data, and diet plans.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-5 mb-2">2.4 Appointment &amp; Booking Data</h3>
              <p>Appointment details (date, time, healthcare provider, status), booking history, and consultation records.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-5 mb-2">2.5 Fitness &amp; Wellness Data</h3>
              <p>Workout sessions, fitness tracking data, and Fitbit integration data (if connected) including activity data, heart rate, sleep data, nutrition data, and weight data.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-5 mb-2">2.6 AI &amp; Chatbot Interaction Data</h3>
              <p>Chat messages with the Hygieia AI chatbot, AI-generated health recommendations, image uploads for acne or dental condition predictions, and chat session history.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-5 mb-2">2.7 Communication Data</h3>
              <p>Email notifications (OTP verifications, appointment reminders, newsletters), patient journal entries, and feedback form submissions.</p>

              <h3 className="font-semibold text-dark-slate-gray mt-5 mb-2">2.8 Technical Data</h3>
              <p>JWT authentication tokens, OAuth tokens (Google, Fitbit), and account creation timestamps.</p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">3. How We Use Your Information</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-soft-blue/10">
                      <th className="text-left p-3 font-semibold text-dark-slate-gray border border-gray-200">Purpose</th>
                      <th className="text-left p-3 font-semibold text-dark-slate-gray border border-gray-200">Data Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Account creation & authentication", "Email, password, OTP codes"],
                      ["Identity verification", "Email, OTP, Google/Fitbit OAuth"],
                      ["Profile management", "Name, contact details, profile photo"],
                      ["Healthcare service delivery", "Medical data, appointments, prescriptions, lab results"],
                      ["AI-powered recommendations", "Health data, medical history, lifestyle information"],
                      ["Chatbot assistance", "Chat messages, health profile data"],
                      ["Fitness tracking", "Workout data, Fitbit integration data"],
                      ["Lab test processing", "Lab bookings, test results, medical records"],
                      ["Diet & nutrition planning", "Health data, dietary preferences"],
                      ["Email notifications", "Email address"],
                      ["Platform analytics", "Aggregated, anonymized usage data"],
                      ["Image-based health predictions", "Uploaded images for acne/dental AI models"],
                    ].map(([purpose, data]) => (
                      <tr key={purpose} className="even:bg-gray-50">
                        <td className="p-3 border border-gray-200">{purpose}</td>
                        <td className="p-3 border border-gray-200 text-gray-600">{data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">We do <strong>not</strong> use your personal data for selling to third-party advertisers, unsolicited marketing unrelated to your healthcare, or profiling for non-healthcare purposes.</p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">4. How We Share Your Information</h2>
              <p>We do <strong>not</strong> sell your personal data. We may share your data in the following limited circumstances:</p>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">4.1 Within the Platform</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Doctors and nutritionists may access your health profile when you book a consultation.</li>
                <li>Lab technicians may access lab test orders associated with your account.</li>
                <li>Administrators have access to platform management data (user counts, system analytics).</li>
              </ul>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">4.2 Third-Party Service Providers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="bg-mint-green/10">
                      <th className="text-left p-3 font-semibold text-dark-slate-gray border border-gray-200">Service</th>
                      <th className="text-left p-3 font-semibold text-dark-slate-gray border border-gray-200">Purpose</th>
                      <th className="text-left p-3 font-semibold text-dark-slate-gray border border-gray-200">Data Shared</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Supabase", "Database hosting (PostgreSQL)", "Account data, user records"],
                      ["MongoDB Atlas", "Document storage", "Profiles, chat history, medical records"],
                      ["Cloudinary", "Image/file hosting", "Profile photos, uploaded images"],
                      ["Google OAuth", "Social login", "Email address (from Google)"],
                      ["Fitbit API", "Fitness data integration", "Fitness and health metrics"],
                      ["Groq", "AI model inference", "Anonymized health data"],
                      ["SMTP Provider", "Email delivery", "Email addresses, notification content"],
                    ].map(([service, purpose, data]) => (
                      <tr key={service} className="even:bg-gray-50">
                        <td className="p-3 border border-gray-200 font-medium">{service}</td>
                        <td className="p-3 border border-gray-200">{purpose}</td>
                        <td className="p-3 border border-gray-200 text-gray-600">{data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">4.3 Legal Requirements</h3>
              <p>We may disclose your information if required by law, court order, or regulatory authority.</p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">5. Data Storage &amp; Security</h2>

              <h3 className="font-semibold text-dark-slate-gray mb-2">5.1 Where Your Data Is Stored</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Supabase (PostgreSQL):</strong> User accounts, appointments, lab data, notifications</li>
                <li><strong>MongoDB:</strong> Patient profiles, doctor/nutritionist profiles, chat sessions, recommendations</li>
                <li><strong>Cloudinary:</strong> Profile images and uploaded files</li>
                <li><strong>Redis:</strong> Temporary queue and session data (automatically purged)</li>
              </ul>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">5.2 Security Measures</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Password hashing using bcrypt with salt rounds</li>
                <li>JWT authentication for all API requests</li>
                <li>6-digit OTP verification for email and password resets</li>
                <li>All API communication over HTTPS</li>
                <li>Microservice isolation to reduce attack surface</li>
                <li>Role-based access control</li>
                <li>Input validation using DTOs and validation pipes</li>
              </ul>

              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">5.3 Data Retention</h3>
              <p>Data is retained for as long as your account is active. When a healthcare worker account is deleted, profile data is removed and a confirmation email is sent. OTP codes, session tokens, and queue messages are automatically expired or purged.</p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">6. Your Rights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Access", desc: "View your profile and health data at any time through the Platform." },
                  { title: "Correction", desc: "Update your profile information at any time through your account settings." },
                  { title: "Deletion", desc: "Request deletion of your account and associated data by contacting the platform administrator." },
                  { title: "Data Portability", desc: "Request a copy of your personal data in a structured, commonly used format." },
                  { title: "Withdraw Consent", desc: "Disconnect third-party integrations (Fitbit, Google) at any time and unsubscribe from newsletters." },
                  { title: "Objection", desc: "Object to certain processing activities by contacting us." },
                ].map(({ title, desc }) => (
                  <div key={title} className="bg-soft-blue/5 border border-soft-blue/15 rounded-lg p-4">
                    <h4 className="font-semibold text-soft-blue mb-1">{title}</h4>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">7. Cookies &amp; Tokens</h2>
              <p>Hygieia uses JWT tokens stored in HTTP headers for authentication. Cookie-based sessions are used only for OAuth callback flows (Google, Fitbit). We do <strong>not</strong> use tracking cookies or third-party analytics cookies.</p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-4">8. Third-Party Integrations</h2>
              <h3 className="font-semibold text-dark-slate-gray mb-2">8.1 Google OAuth</h3>
              <p>When you sign in with Google, we receive your email address only. We do not access your Google contacts, files, or other Google account data.</p>
              <h3 className="font-semibold text-dark-slate-gray mt-4 mb-2">8.2 Fitbit</h3>
              <p>When you connect Fitbit, we access activity, heart rate, sleep, nutrition, profile, social, and weight data scopes. You can disconnect Fitbit at any time, after which we will no longer fetch new data.</p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">9. Children's Privacy</h2>
              <p>Hygieia is not intended for use by individuals under the age of 16 without parental or guardian consent. We do not knowingly collect data from children under 16. If you believe a child has provided us with personal data, please contact us so we can take appropriate action.</p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">10. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time. When we make significant changes, we will update the "Last Updated" date and notify you via email or an in-app notification. Your continued use of the Platform after changes are posted constitutes acceptance of the updated Privacy Policy.</p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-bold text-dark-slate-gray mb-3">11. Contact Us</h2>
              <div className="bg-mint-green/10 border border-mint-green/20 rounded-lg p-5">
                <p className="font-medium text-dark-slate-gray mb-2">If you have questions or concerns about this Privacy Policy:</p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Email:</strong>{" "}<a href="mailto:support@hygieia.com" className="text-soft-blue hover:underline">support@hygieia.com</a></li>
                  <li><strong>Platform:</strong> Hygieia Healthcare Platform</li>
                </ul>
              </div>
            </section>

            {/* Footer note */}
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-6">
              This Privacy Policy was last reviewed and updated on <strong>May 28, 2026</strong>.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
