import { motion } from "framer-motion"
import { Search, MapPin, Car, Shield, CalendarPlus, Users } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"

const features = [
  { key: "step1", icon: MapPin, emoji: "📍", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { key: "step2", icon: Car, emoji: "🚗", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
  { key: "step3", icon: Users, emoji: "👥", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
] as const

const extraFeatures = [
  { icon: Shield, emoji: "🔒", title: "privacy", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { icon: CalendarPlus, emoji: "📱", title: "noApp", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
  { icon: Search, emoji: "⚡", title: "smart", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/30" },
] as const

export default function HowItWorksSection() {
  const { t } = useI18n()

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary">
            ⚡ {t("home.howItWorks.title")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.howItWorks.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group"
            >
              <div className="h-full rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-secondary/20">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}>
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <h3 className="text-base font-semibold">
                  {t(`home.howItWorks.${item.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t(`home.howItWorks.${item.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}

          {extraFeatures.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i + 3) * 0.1 }}
              className="group"
            >
              <div className="h-full rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-secondary/20">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}>
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <h3 className="text-base font-semibold">
                  {t(`home.whyTrempi.${item.title === "privacy" ? "betterExperience" : item.title === "noApp" ? "saveMoney" : "meetPeople"}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t(`home.whyTrempi.${item.title === "privacy" ? "betterExperience" : item.title === "noApp" ? "saveMoney" : "meetPeople"}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
