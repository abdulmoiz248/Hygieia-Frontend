import type { Metadata } from "next"
import Link from "next/link"
import LegalDocumentPage, { LegalCallout, LegalSubheading } from "@/components/legal/LegalDocumentPage"

const lastUpdated = "May 28, 2026"
const effectiveDate = "May 28, 2026"

export const metadata: Metadata = {
  title: "Terms of Service | Hygieia",
  description: "Terms and conditions governing your use of the Hygieia healthcare platform.",
}

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing, registering for, or using the Hygieia platform, you agree to be bound by these Terms of Service. If
          you do not agree to these Terms, you must not use the Platform.
        </p>
        <p>
          These Terms apply to all users of the Platform, including patients, doctors, nutritionists, lab technicians,
          and administrators.
        </p>
      </>
    ),
  },
  {
    id: "description-of-service",
    title: "2. Description of Service",
    content: (
      <ul className="list-disc space-y-2 pl-6">
        <li>Patient services including profile management, appointments, lab test ordering, fitness tracking, diet plans, medical records, medication adherence tracking, and journaling.</li>
        <li>AI-powered features including health recommendations, an AI health chatbot, image-based acne and dental predictions, and semantic search.</li>
        <li>Healthcare worker tools for patient management, scheduling, consultations, and professional profiles.</li>
        <li>Fitness integration through workout tracking and Fitbit activity, heart rate, sleep, and nutrition data.</li>
        <li>Communication services including email notifications, reminders, newsletters, blog content, FAQs, and announcements.</li>
        <li>Administrative functions including user management, analytics dashboards, feedback collection, and worker reports.</li>
      </ul>
    ),
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    content: (
      <>
        <p>To use Hygieia, you must be at least 16 years old or have parental or guardian consent, provide a valid email address, and agree to these Terms and our <Link href="/privacy-policy" className="font-medium text-soft-blue hover:underline">Privacy Policy</Link>.</p>
        <p>
          Healthcare worker accounts are created by platform administrators. Workers must be qualified professionals
          authorized to provide healthcare services in their respective jurisdictions.
        </p>
      </>
    ),
  },
  {
    id: "account-registration",
    title: "4. Account Registration and Security",
    content: (
      <>
        <LegalSubheading>4.1 Patient Registration</LegalSubheading>
        <p>
          Patients register using an email address and password. Passwords must be at least 8 characters and contain
          uppercase letters, lowercase letters, and numbers. A 6-digit OTP is sent by email to verify the account before
          activation. Google OAuth may also be used.
        </p>
        <LegalSubheading>4.2 Healthcare Worker Registration</LegalSubheading>
        <p>
          Worker accounts are created by administrators. A system-generated @hygieia.com email and password is assigned
          and sent to the worker&apos;s personal email. Workers are pre-verified upon creation.
        </p>
        <LegalSubheading>4.3 Account Security</LegalSubheading>
        <p>
          You are responsible for maintaining the confidentiality of your login credentials, all activity under your
          account, and notifying us immediately if you suspect unauthorized access.
        </p>
        <LegalSubheading>4.4 One Account Per User</LegalSubheading>
        <p>Each user may maintain only one account. Creating multiple accounts to circumvent restrictions is prohibited.</p>
      </>
    ),
  },
  {
    id: "user-conduct",
    title: "5. User Conduct",
    content: (
      <>
        <LegalSubheading>5.1 Acceptable Use</LegalSubheading>
        <p>
          You agree to use the Platform only for lawful, healthcare-related purposes, provide accurate information, use
          the Platform respectfully, and comply with applicable laws and regulations.
        </p>
        <LegalSubheading>5.2 Prohibited Activities</LegalSubheading>
        <ul className="list-disc space-y-2 pl-6">
          <li>Providing false, misleading, or fraudulent information.</li>
          <li>Impersonating another person or healthcare professional.</li>
          <li>Attempting unauthorized access to accounts or data.</li>
          <li>Harassing, abusing, or harming others through the Platform.</li>
          <li>Reverse-engineering or attempting to extract Platform source code.</li>
          <li>Interfering with Platform infrastructure, services, or networks.</li>
          <li>Uploading malicious files, viruses, or harmful content.</li>
          <li>Using bots, scrapers, or automated tools without authorization.</li>
          <li>Using AI features to obtain diagnoses for third parties without consent.</li>
          <li>Sharing healthcare worker credentials with unauthorized individuals.</li>
        </ul>
      </>
    ),
  },
  {
    id: "healthcare-disclaimer",
    title: "6. Healthcare Disclaimer",
    content: (
      <>
        <LegalCallout>
          Hygieia is a health management and information platform. It is not a substitute for professional medical
          advice, diagnosis, or treatment.
        </LegalCallout>
        <p>
          AI-generated recommendations, chatbot responses, and image-based predictions are for informational purposes
          only. Always seek the advice of a qualified healthcare provider, and never disregard or delay professional
          medical advice because of information obtained through the Platform.
        </p>
        <LegalSubheading>6.2 AI Limitations</LegalSubheading>
        <p>
          AI features may produce inaccurate or incomplete results and should not be relied upon as the sole basis for
          medical decisions. They are not reviewed by a healthcare professional before delivery unless explicitly stated.
        </p>
        <LegalSubheading>6.3 Healthcare Provider Responsibility</LegalSubheading>
        <p>
          Doctors, nutritionists, and lab technicians are independently responsible for their professional advice,
          licenses, qualifications, medical ethics, and regulatory compliance. Hygieia does not verify, endorse, or
          guarantee the quality of care provided by healthcare workers on the Platform.
        </p>
      </>
    ),
  },
  {
    id: "appointments-bookings",
    title: "7. Appointments and Bookings",
    content: (
      <>
        <LegalSubheading>7.1 Booking Appointments</LegalSubheading>
        <p>
          You may book appointments with available doctors and nutritionists. Availability depends on the healthcare
          provider&apos;s schedule, and email notifications and reminders may be sent.
        </p>
        <LegalSubheading>7.2 Cancellation</LegalSubheading>
        <p>
          Cancellation policies are set by individual healthcare providers. Repeated no-shows or last-minute
          cancellations may result in restricted booking privileges.
        </p>
        <LegalSubheading>7.3 Lab Tests</LegalSubheading>
        <p>
          Lab test bookings are facilitated through the Platform. Lab results are stored in your medical records.
          Hygieia is not responsible for the accuracy of lab results; responsibility lies with the lab technician and
          testing process used.
        </p>
      </>
    ),
  },
  {
    id: "fitbit",
    title: "8. Fitbit Integration",
    content: (
      <>
        <p>
          You may optionally connect your Fitbit account to import fitness and health data. By connecting Fitbit, you
          authorize Hygieia to access activity, heart rate, location, nutrition, profile, settings, sleep, social, and
          weight data scopes.
        </p>
        <p>
          You may disconnect Fitbit at any time. After disconnection, we will no longer fetch new data from Fitbit, but
          previously imported data may be retained unless you request deletion.
        </p>
        <p>
          Your use of Fitbit is also subject to Fitbit&apos;s own Terms of Service and Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "9. Intellectual Property",
    content: (
      <>
        <LegalSubheading>9.1 Platform Ownership</LegalSubheading>
        <p>
          The Hygieia platform, including its software, design, architecture, AI models, branding, and documentation, is
          owned by the Hygieia development team and protected by intellectual property laws.
        </p>
        <LegalSubheading>9.2 User Content</LegalSubheading>
        <p>
          You retain ownership of content you submit, including profile data, health records, journal entries, and
          images. By submitting content, you grant Hygieia a non-exclusive, worldwide license to use, store, process,
          and display it solely to provide Platform services.
        </p>
        <LegalSubheading>9.3 AI-Generated Content</LegalSubheading>
        <p>
          AI-generated recommendations, chatbot responses, and predictions are provided by the Platform and may be used
          for personal health management purposes only.
        </p>
      </>
    ),
  },
  {
    id: "data-privacy",
    title: "10. Data and Privacy",
    content: (
      <p>
        Please review our <Link href="/privacy-policy" className="font-medium text-soft-blue hover:underline">Privacy Policy</Link> for details about what data we collect, how we use and store it, your rights, and third-party services. The Privacy Policy is incorporated into these Terms by reference.
      </p>
    ),
  },
  {
    id: "email-communications",
    title: "11. Email Communications",
    content: (
      <p>
        By using the Platform, you consent to receive transactional emails, service emails, newsletters, and worker
        account emails where applicable. You may unsubscribe from newsletters at any time.
      </p>
    ),
  },
  {
    id: "liability",
    title: "12. Limitation of Liability",
    content: (
      <>
        <LegalSubheading>12.1 Service Availability</LegalSubheading>
        <p>
          Hygieia is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee
          uninterrupted availability, freedom from errors, or indefinite data preservation.
        </p>
        <LegalSubheading>12.2 Exclusion of Warranties</LegalSubheading>
        <p>
          To the maximum extent permitted by law, we disclaim all express or implied warranties, including warranties of
          merchantability, fitness for a particular purpose, accuracy of AI-generated content, and qualifications of
          healthcare providers.
        </p>
        <LegalSubheading>12.3 Limitation</LegalSubheading>
        <p>
          Hygieia and its developers shall not be liable for indirect, incidental, special, consequential, or punitive
          damages, loss of data, profits, business opportunities, reliance on AI-generated content, healthcare advice, or
          unauthorized account access.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "13. Account Termination",
    content: (
      <>
        <p>You may request account deletion by contacting the platform administrator.</p>
        <p>
          We may suspend or terminate accounts that violate these Terms, provide false or misleading information, engage
          in prohibited activities, or abuse Platform AI features or APIs. Administrators may remove healthcare worker
          accounts, after which worker profiles and associated data will be deleted from the Platform.
        </p>
      </>
    ),
  },
  {
    id: "service-modifications",
    title: "14. Modifications to the Service",
    content: (
      <p>
        We reserve the right to modify, update, or discontinue any feature of the Platform at any time and to change
        these Terms with reasonable notice. Material changes may be communicated by email or in-app notification.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "15. Governing Law",
    content: (
      <p>
        These Terms shall be governed by the applicable laws of the jurisdiction in which the Platform operates. Disputes
        should be resolved through good-faith negotiation before formal legal remedies are pursued.
      </p>
    ),
  },
  {
    id: "severability",
    title: "16. Severability",
    content: (
      <p>
        If any provision of these Terms is found unenforceable or invalid, that provision will be limited or eliminated
        to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
      </p>
    ),
  },
  {
    id: "entire-agreement",
    title: "17. Entire Agreement",
    content: (
      <p>
        These Terms, together with the <Link href="/privacy-policy" className="font-medium text-soft-blue hover:underline">Privacy Policy</Link>, constitute the entire agreement between you and Hygieia regarding your use of the Platform and supersede all prior agreements, representations, or understandings.
      </p>
    ),
  },
  {
    id: "contact",
    title: "18. Contact Us",
    content: (
      <>
        <p>If you have questions or concerns about these Terms of Service, contact us at:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Email: support@hygieia.com</li>
          <li>Platform: Hygieia Healthcare Platform</li>
        </ul>
        <p className="text-sm text-cool-gray/75">These Terms of Service were last reviewed and updated on {lastUpdated}.</p>
      </>
    ),
  },
]

export default function TermsOfServicePage() {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      description="The rules, responsibilities, healthcare disclaimers, and platform terms that apply when you use Hygieia."
      lastUpdated={lastUpdated}
      effectiveDate={effectiveDate}
      sections={sections}
    />
  )
}
