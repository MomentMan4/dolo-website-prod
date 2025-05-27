"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useLegalModals } from "./legal-modals-context"

export function LegalModals() {
  const { activeModal, closeModal } = useLegalModals()
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal()
      }
    }

    if (activeModal) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeModal, closeModal])

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal()
      }
    }

    if (activeModal) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [activeModal, closeModal])

  return (
    <AnimatePresence>
      {activeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {activeModal === "terms" && <TermsAndConditions />}
            {activeModal === "privacy" && <PrivacyPolicy />}
            {activeModal === "cookies" && <CookiePolicy />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TermsAndConditions() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-navy">Terms and Conditions of Service</h2>
      <p className="text-sm text-gray-500">
        Effective Date: 21.05.2025
        <br />
        Last Updated: 21.05.2025
      </p>

      <p>
        Welcome to Dolo. By accessing or using our website and services, you agree to be bound by the following Terms
        and Conditions. If you do not agree, you should not use our services.
      </p>

      <h3 className="text-lg font-semibold text-navy">1. Scope of Services</h3>
      <p>
        Dolo offers custom website development services under defined pricing tiers. These services are described on our
        website and in our onboarding documents.
      </p>

      <h3 className="text-lg font-semibold text-navy">2. Payment Terms</h3>
      <p>
        All services must be paid in full before work begins. Payment is securely processed via Stripe. Work commences
        once full payment and all required assets are received (defined as "Kick-Off").
      </p>

      <h3 className="text-lg font-semibold text-navy">3. Refund & Cancellation Policy</h3>
      <p>A full refund may be granted within 24 hours of payment if the project has not begun.</p>
      <p>
        If work has started, a partial refund may be granted within the first 2 business days, based on work completed.
      </p>
      <p>No refunds will be granted once active work exceeds 48 hours.</p>
      <p>Add-ons involving third parties (e.g., logo design) are non-refundable once initiated.</p>
      <p>Clients may defer the project start once (up to 60 days) at no extra cost.</p>

      <h3 className="text-lg font-semibold text-navy">4. Client Responsibilities</h3>
      <p>
        You are responsible for providing timely content, files, and feedback. Delays in asset delivery may result in
        project delays or extensions without refund eligibility.
      </p>

      <h3 className="text-lg font-semibold text-navy">5. Intellectual Property</h3>
      <p>
        Upon full payment, all final deliverables become your intellectual property. We reserve the right to display
        non-sensitive work in our portfolio unless otherwise agreed.
      </p>

      <h3 className="text-lg font-semibold text-navy">6. Limitation of Liability</h3>
      <p>
        We are not liable for indirect or consequential damages resulting from the use or inability to use your website
        after launch. Our maximum liability is limited to the total fees paid to us.
      </p>

      <h3 className="text-lg font-semibold text-navy">7. Modifications to These Terms</h3>
      <p>
        We may revise these Terms at any time. Continued use of our services after changes are posted constitutes
        acceptance of the revised Terms.
      </p>
    </div>
  )
}

function PrivacyPolicy() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-navy">Privacy Policy</h2>
      <p className="text-sm text-gray-500">
        Effective Date: 21.05.2025
        <br />
        Last Updated: 21.05.2025
      </p>

      <p>
        At Dolo, we take privacy seriously and are committed to protecting your personal data in accordance with the
        General Data Protection Regulation (GDPR) and Personal Information Protection and Electronic Documents Act
        (PIPEDA).
      </p>

      <h3 className="text-lg font-semibold text-navy">1. What We Collect</h3>
      <p>We collect personal information that you provide during:</p>
      <ul>
        <li>Perfect Plan submissions, onboarding forms, contact inquiries</li>
        <li>Uploaded files (logos, images, text)</li>
        <li>Payment processing (via Stripe)</li>
      </ul>
      <p>This may include your name, email, business name, role, and project information.</p>

      <h3 className="text-lg font-semibold text-navy">2. How We Use Your Data</h3>
      <ul>
        <li>To deliver and personalize our services</li>
        <li>To communicate with you about your project</li>
        <li>To send confirmations, invoices, or important updates</li>
        <li>To analyze anonymized usage and improve our services</li>
      </ul>
      <p>We do not sell or rent your data.</p>

      <h3 className="text-lg font-semibold text-navy">3. Legal Basis for Processing</h3>
      <p>We process your data based on one or more of the following:</p>
      <ul>
        <li>Consent (e.g., form submissions, newsletter opt-in)</li>
        <li>Contractual necessity (e.g., fulfilling a paid service)</li>
        <li>Legal compliance</li>
      </ul>

      <h3 className="text-lg font-semibold text-navy">4. Data Storage & Security</h3>
      <p>
        Data is stored securely via trusted third-party tools (e.g., Supabase, Stripe, Resend) in accordance with
        encryption and access control protocols. We only retain data as long as necessary for service delivery and legal
        compliance.
      </p>

      <h3 className="text-lg font-semibold text-navy">5. Your Rights</h3>
      <p>Under GDPR and PIPEDA, you may request to:</p>
      <ul>
        <li>Access or correct your personal data</li>
        <li>Delete your data</li>
        <li>Withdraw consent for communications</li>
      </ul>
      <p>To make a request, email us at privacy@dolo.com</p>
    </div>
  )
}

function CookiePolicy() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-navy">Cookie Policy</h2>
      <p className="text-sm text-gray-500">Effective Date: 21.05.2025</p>

      <p>Dolo uses cookies and similar tracking technologies to enhance your experience.</p>

      <h3 className="text-lg font-semibold text-navy">1. What Are Cookies?</h3>
      <p>
        Cookies are small text files stored on your device when you visit our website. They help us analyze traffic,
        remember preferences, and improve functionality.
      </p>

      <h3 className="text-lg font-semibold text-navy">2. Types of Cookies We Use</h3>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> Required for core functionality (e.g., page navigation, form security)
        </li>
        <li>
          <strong>Performance Cookies:</strong> Help us understand how visitors use our site (e.g., analytics tools)
        </li>
        <li>
          <strong>Marketing Cookies:</strong> (Optional) Help us tailor ads or future offers
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-navy">3. Consent & Control</h3>
      <p>
        When you first visit our site, we request your consent to use non-essential cookies. You can change or revoke
        cookie preferences via your browser or the banner provided.
      </p>

      <h3 className="text-lg font-semibold text-navy">4. Managing Cookies</h3>
      <p>You may disable cookies at any time in your browser settings, but this may impact functionality.</p>
    </div>
  )
}

// Add a default export
const LegalModalsDefault = LegalModals
export default LegalModalsDefault
