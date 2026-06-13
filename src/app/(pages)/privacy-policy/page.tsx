import type { Metadata } from "next"
import LegalDocumentPage, { LegalCallout, LegalSubheading, LegalTable } from "@/components/legal/LegalDocumentPage"

const lastUpdated = "May 28, 2026"
const effectiveDate = "May 28, 2026"

export const metadata: Metadata = {
  title: "Privacy Policy | Hygieia",
  description: "How Hygieia collects, uses, stores, and protects personal and health-related data.",
}

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>
          Welcome to Hygieia (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or the &quot;Platform&quot;).
          Hygieia is a healthcare management platform that connects patients with doctors, nutritionists, and lab
          technicians to provide comprehensive health services.
        </p>
        <p>
          We are committed to protecting your privacy and handling your personal and health-related data responsibly.
          This Privacy Policy explains what information we collect, how we use it, how we store it, and your rights
          regarding that information.
        </p>
        <p>
          By creating an account or using the Platform, you agree to the practices described in this Privacy Policy. If
          you do not agree with these practices, please do not use the Platform.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: (
      <>
        <LegalSubheading>2.1 Account Information</LegalSubheading>
        <p>
          When you register for Hygieia, we collect your email address, password, and account role. Passwords are stored
          in hashed form using bcrypt; we never store plaintext passwords. For healthcare workers, we also collect full
          name and personal email address separate from the assigned @hygieia.com work email.
        </p>

        <LegalSubheading>2.2 Profile Information</LegalSubheading>
        <ul className="list-disc space-y-2 pl-6">
          <li>Patients: name, phone number, date of birth, gender, address, emergency contact, profile photo, blood type, height, and weight.</li>
          <li>Doctors and nutritionists: name, phone number, gender, date of birth, profile photo, specialization, experience, certifications, education, languages, bio, fee, working hours, and professional rating.</li>
          <li>Lab technicians: name, phone number, gender, date of birth, and profile photo.</li>
        </ul>

        <LegalSubheading>2.3 Health and Medical Data</LegalSubheading>
        <LegalCallout>
          Health data is sensitive personal data. We apply additional safeguards to protect this information.
        </LegalCallout>
        <p>
          We may collect allergies, medical conditions, current medications, surgery history, implants, vaccination
          records, pregnancy status, menstrual cycle information, mental health information, family medical history,
          organ donor status, disabilities, lifestyle information, health score, medication adherence, missed doses, lab
          results, medical records, prescriptions, and diet plans.
        </p>

        <LegalSubheading>2.4 Appointment and Booking Data</LegalSubheading>
        <p>We collect appointment details, booking history, consultation records, dates, times, providers, and status.</p>

        <LegalSubheading>2.5 Fitness and Wellness Data</LegalSubheading>
        <p>
          We collect workout sessions and fitness tracking data. If you connect Fitbit, we may process activity, heart
          rate, sleep, nutrition, weight data, and securely stored Fitbit access and refresh tokens.
        </p>

        <LegalSubheading>2.6 AI and Chatbot Interaction Data</LegalSubheading>
        <p>
          We collect chat messages exchanged with the Hygieia AI chatbot, AI-generated recommendations, image uploads
          for acne or dental condition predictions, and chat session history.
        </p>

        <LegalSubheading>2.7 Communication Data</LegalSubheading>
        <p>Email notifications, OTP verifications, appointment reminders, newsletters, patient journal entries, and feedback form submissions may be processed.</p>

        <LegalSubheading>2.8 Technical Data</LegalSubheading>
        <p>We process JWT authentication tokens, OAuth tokens for Google and Fitbit, and account creation timestamps.</p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "3. How We Use Your Information",
    content: (
      <>
        <LegalTable
          columns={["Purpose", "Data Used"]}
          rows={[
            ["Account creation and authentication", "Email, password, OTP codes"],
            ["Identity verification", "Email, OTP, Google/Fitbit OAuth"],
            ["Profile management", "Name, contact details, profile photo"],
            ["Healthcare service delivery", "Medical data, appointments, prescriptions, lab results"],
            ["AI-powered recommendations", "Health data, medical history, lifestyle information"],
            ["Chatbot assistance", "Chat messages, health profile data"],
            ["Fitness tracking", "Workout data, Fitbit integration data"],
            ["Lab test processing", "Lab bookings, test results, medical records"],
            ["Diet and nutrition planning", "Health data, dietary preferences"],
            ["Email notifications", "Email address for OTPs, reminders, newsletters, and appointment confirmations"],
            ["Platform analytics", "Aggregated, anonymized usage data for admin dashboards"],
            ["Image-based health predictions", "Uploaded images for acne and dental AI models"],
          ]}
        />
        <p>
          We do not use your personal data for selling to third-party advertisers, unsolicited marketing unrelated to
          your healthcare, or profiling for non-healthcare purposes.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. How We Share Your Information",
    content: (
      <>
        <p>We do not sell your personal data. We may share your data only in limited circumstances.</p>
        <LegalSubheading>4.1 Within the Platform</LegalSubheading>
        <p>
          Doctors and nutritionists may access your health profile and medical records when you book an appointment or
          consultation with them. Lab technicians may access lab test orders associated with your account. Administrators
          may access platform management data such as user counts, worker reports, and system analytics.
        </p>
        <LegalSubheading>4.2 Third-Party Service Providers</LegalSubheading>
        <LegalTable
          columns={["Service", "Purpose", "Data Shared"]}
          rows={[
            ["Supabase", "Database hosting (PostgreSQL)", "Account data, user records"],
            ["MongoDB Atlas", "Document storage", "Profiles, chat history, medical records"],
            ["Cloudinary", "Image/file hosting", "Profile photos, uploaded images"],
            ["Google OAuth", "Social login", "Email address from Google"],
            ["Fitbit API", "Fitness data integration", "Fitness and health metrics"],
            ["Groq", "AI model inference", "Anonymized health data for recommendations"],
            ["SMTP Provider", "Email delivery", "Email addresses, notification content"],
          ]}
        />
        <LegalSubheading>4.3 Legal Requirements</LegalSubheading>
        <p>We may disclose your information if required by law, court order, or regulatory authority.</p>
      </>
    ),
  },
  {
    id: "storage-security",
    title: "5. Data Storage and Security",
    content: (
      <>
        <LegalSubheading>5.1 Where Your Data Is Stored</LegalSubheading>
        <p>
          Supabase stores user accounts, appointments, lab data, and notifications. MongoDB stores profiles, chat
          sessions, medical records, and recommendations. Cloudinary stores profile images and uploaded files. Redis is
          used for temporary queue and session data that is automatically purged.
        </p>
        <LegalSubheading>5.2 Security Measures</LegalSubheading>
        <ul className="list-disc space-y-2 pl-6">
          <li>Password hashing using bcrypt with salt rounds before storage.</li>
          <li>JWT authentication for API requests.</li>
          <li>6-digit OTP verification for email verification and password resets.</li>
          <li>Encrypted transport over HTTPS.</li>
          <li>Microservice isolation with internal TCP and message queue communication.</li>
          <li>Role-based access control and validated API inputs.</li>
        </ul>
        <LegalSubheading>5.3 Data Retention</LegalSubheading>
        <p>
          Active account data is retained while your account is active. Deleted worker account profile data is removed
          and a confirmation email is sent. OTP codes, session tokens, and queue messages expire or are purged
          automatically.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    content: (
      <ul className="list-disc space-y-2 pl-6">
        <li>Access your profile and health data through the Platform.</li>
        <li>Correct profile information through account settings.</li>
        <li>Request account and data deletion by contacting the platform administrator.</li>
        <li>Request a copy of your personal data in a structured, commonly used format.</li>
        <li>Withdraw consent by disconnecting third-party integrations or unsubscribing from newsletters.</li>
        <li>Object to certain processing activities by contacting us.</li>
      </ul>
    ),
  },
  {
    id: "cookies-tokens",
    title: "7. Cookies and Tokens",
    content: (
      <>
        <p>Hygieia uses JWT tokens stored in HTTP headers for primary API authentication.</p>
        <p>
          Cookie-based sessions may be used for OAuth callback flows such as Google and Fitbit. We do not use tracking
          cookies or third-party analytics cookies.
        </p>
      </>
    ),
  },
  {
    id: "third-party-integrations",
    title: "8. Third-Party Integrations",
    content: (
      <>
        <LegalSubheading>8.1 Google OAuth</LegalSubheading>
        <p>
          When you sign in with Google, we receive your email address from Google. We do not access your Google
          contacts, files, or other Google account data.
        </p>
        <LegalSubheading>8.2 Fitbit</LegalSubheading>
        <p>
          When you connect Fitbit, we access activity, heart rate, sleep, nutrition, profile, social, and weight data
          scopes. You can disconnect Fitbit at any time, after which we will no longer fetch new data from Fitbit.
        </p>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    title: "9. Children's Privacy",
    content: (
      <p>
        Hygieia is not intended for use by individuals under the age of 16 without parental or guardian consent. We do
        not knowingly collect data from children under 16. If you believe a child has provided us with personal data,
        please contact us so we can take appropriate action.
      </p>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to This Privacy Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time. When we make significant changes, we will update the
          &quot;Last Updated&quot; date at the top of this page and notify you via email or an in-app notification.
        </p>
        <p>Your continued use of the Platform after changes are posted constitutes acceptance of the updated Privacy Policy.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: (
      <>
        <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, contact us at:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Email: support@hygieia.com</li>
          <li>Platform: Hygieia Healthcare Platform</li>
        </ul>
        <p className="text-sm text-cool-gray/75">This Privacy Policy was last reviewed and updated on {lastUpdated}.</p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      description="A clear overview of the personal, medical, technical, and communication data Hygieia collects, why we use it, and how we protect it."
      lastUpdated={lastUpdated}
      effectiveDate={effectiveDate}
      sections={sections}
    />
  )
}
