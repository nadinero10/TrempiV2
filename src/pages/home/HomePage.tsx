import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import WhyTrempiSection from "./WhyTrempiSection";
import UpcomingEventsSection from "./UpcomingEventsSection";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <HowItWorksSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <WhyTrempiSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <UpcomingEventsSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <TestimonialsSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <FAQSection />
      </motion.div>
    </main>
  );
}
