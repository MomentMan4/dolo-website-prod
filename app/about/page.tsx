import { Header } from "@/components/header"
import { AboutHero } from "@/components/about-hero"
import { OurStory } from "@/components/our-story"
import { OurVision } from "@/components/our-vision"
import { OurMission } from "@/components/our-mission"
import { OurValues } from "@/components/our-values"
import { WhyWorkWithUs } from "@/components/why-work-with-us"
import { Quote } from "@/components/quote"
import { AboutCta } from "@/components/about-cta"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <AboutHero />
      <OurStory />
      <OurVision />
      <OurMission />
      <OurValues />
      <WhyWorkWithUs />
      <Quote />
      <AboutCta />
      <Footer />
    </main>
  )
}
