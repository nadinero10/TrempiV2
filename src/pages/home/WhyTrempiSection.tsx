import { motion } from "framer-motion"
import { Wallet, Users, TrafficCone, Sparkles } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"

const benefits = [
  { key: "saveMoney", icon: Wallet, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800" },
  { key: "meetPeople", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800" },
  { key: "reduceTraffic", icon: TrafficCone, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30", border: "border-orange-200 dark:border-orange-800" },
  { key: "betterExperience", icon: Sparkles, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", border: "border-purple-200 dark:border-purple-800" },
] as const

export default function WhyTrempiSection() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 hero-gradient opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.whyTrempi.title")}
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`group h-full rounded-2xl border ${item.border} bg-card p-6 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1`}>
                  <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${item.bg} transition-transform group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h3 className="mt-5 font-semibold">
                    {t(`home.whyTrempi.${item.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`home.whyTrempi.${item.key}.description`)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
