import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { CalendarPlus, Car, Users, Zap } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"

const steps = [
  { key: "step1", icon: CalendarPlus, gradient: "from-violet-500 to-purple-600" },
  { key: "step2", icon: Car, gradient: "from-cyan-500 to-blue-600" },
  { key: "step3", icon: Users, gradient: "from-amber-500 to-orange-600" },
] as const

export default function HowItWorksSection() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"])

  return (
    <section ref={ref} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary">
            <Zap className="h-3.5 w-3.5" />
            {t("home.howItWorks.title")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {t("home.howItWorks.title")}
          </h2>
        </motion.div>

        <div className="relative mt-20">
          <div className="absolute top-[3.5rem] hidden h-0.5 w-full bg-border/50 md:block" aria-hidden="true" />
          <motion.div
            style={{ width: lineWidth }}
            className="absolute top-[3.5rem] hidden h-0.5 bg-gradient-to-r from-violet-500 via-cyan-500 to-amber-500 md:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="group relative text-center"
                >
                  <div className="relative z-10 mx-auto mb-8 flex h-[4.5rem] w-[4.5rem] items-center justify-center">
                    <div className={`flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-20 blur-xl transition-opacity group-hover:opacity-40`} />
                  </div>

                  <div className="rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                    <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {t(`home.howItWorks.${step.key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t(`home.howItWorks.${step.key}.description`)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
