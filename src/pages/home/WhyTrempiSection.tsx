import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Wallet, Users, Leaf, Sparkles } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"

const benefits = [
  { key: "saveMoney", icon: Wallet, gradient: "from-emerald-400 to-teal-500", stat: "40%", statLabel: "savings" },
  { key: "meetPeople", icon: Users, gradient: "from-blue-400 to-indigo-500", stat: "2.5K", statLabel: "riders" },
  { key: "reduceTraffic", icon: Leaf, gradient: "from-lime-400 to-green-500", stat: "50%", statLabel: "less CO2" },
  { key: "betterExperience", icon: Sparkles, gradient: "from-violet-400 to-purple-500", stat: "98%", statLabel: "happy" },
] as const

export default function WhyTrempiSection() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background"
      />
      <div className="absolute top-1/3 end-0 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
      <div className="absolute bottom-1/4 start-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary">
            <Sparkles className="h-3.5 w-3.5" />
            {t("home.whyTrempi.title")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {t("home.whyTrempi.title")}
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group perspective-[800px]"
              >
                <div className="h-full rounded-2xl border bg-card p-6 text-center shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-secondary/30">
                  <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="mt-5 text-3xl font-bold gradient-text">
                    {item.stat}
                  </div>

                  <h3 className="mt-2 font-semibold">
                    {t(`home.whyTrempi.${item.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
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
