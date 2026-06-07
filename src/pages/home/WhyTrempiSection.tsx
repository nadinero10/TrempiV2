import { motion } from "framer-motion"
import { useI18n } from "@/providers/I18nProvider"

const stats = [
  { value: "2.5K", emoji: "♾️", color: "text-blue-600 dark:text-blue-400" },
  { value: "40%", emoji: "🚗", color: "text-green-600 dark:text-green-400" },
  { value: "50%", emoji: "💰", color: "text-orange-600 dark:text-orange-400" },
  { value: "98%", emoji: "⭐", color: "text-purple-600 dark:text-purple-400" },
] as const

const statKeys = ["meetPeople", "reduceTraffic", "saveMoney", "betterExperience"] as const

export default function WhyTrempiSection() {
  const { t } = useI18n()

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 px-4 py-1.5 text-sm font-medium text-green-700 dark:text-green-400">
            ✅ {t("home.whyTrempi.title")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.whyTrempi.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-card border shadow-sm">
                <span className="text-2xl">{stat.emoji}</span>
              </div>
              <div className={`text-3xl font-bold ${stat.color} md:text-4xl`}>
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`home.whyTrempi.${statKeys[i]}.title`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
