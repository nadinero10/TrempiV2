import { motion } from "framer-motion"
import { CalendarPlus, Car, Users } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"

const steps = [
  { key: "step1", icon: CalendarPlus, color: "from-purple-500 to-indigo-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { key: "step2", icon: Car, color: "from-teal-500 to-cyan-600", bg: "bg-teal-50 dark:bg-teal-950/30" },
  { key: "step3", icon: Users, color: "from-orange-500 to-pink-600", bg: "bg-orange-50 dark:bg-orange-950/30" },
] as const

export default function HowItWorksSection() {
  const { t } = useI18n()

  return (
    <section className="relative bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.howItWorks.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>
        </motion.div>

        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            className="pointer-events-none absolute top-20 hidden h-0.5 w-full bg-gradient-to-r from-purple-200 via-teal-200 to-orange-200 dark:from-purple-900 dark:via-teal-900 dark:to-orange-900 md:block"
            aria-hidden="true"
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className={`card-gradient rounded-2xl border p-8 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 ${step.bg}`}>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg text-white">
                    <div className={`flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br ${step.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">
                    {t(`home.howItWorks.${step.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`home.howItWorks.${step.key}.description`)}
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
