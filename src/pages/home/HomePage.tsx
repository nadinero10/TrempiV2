import HeroSection from "./HeroSection"
import HowItWorksSection from "./HowItWorksSection"
import WhyTrempiSection from "./WhyTrempiSection"
import UpcomingEventsSection from "./UpcomingEventsSection"
import TestimonialsSection from "./TestimonialsSection"
import FAQSection from "./FAQSection"
import CTASection from "./CTASection"

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <HowItWorksSection />
      <WhyTrempiSection />
      <UpcomingEventsSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
    </main>
  )
}
