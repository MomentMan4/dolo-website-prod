import { Header } from "@/components/header"
import { ContactHero } from "@/components/contact-hero"
import { ContactCTA } from "@/components/contact-cta"
import { ContactForm } from "@/components/contact-form"
import { ContactFaq } from "@/components/contact-faq"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Contact Us | Dolo",
  description: "Get in touch with our team to discuss your website needs.",
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col">
        <ContactHero />
        <ContactForm />
        <ContactFaq />
        <ContactCTA />
      </div>
      <Footer />
    </>
  )
}
