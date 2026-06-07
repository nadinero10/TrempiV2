import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Search } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HeroSection() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const mockupRotate = useTransform(scrollYProgress, [0, 1], [0, -3])

  return (
    <section ref={ref} className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0ff] via-background to-background dark:from-[#1a0f2e] dark:via-background" />

      <div className="absolute top-20 start-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-20 end-10 h-96 w-96 rounded-full bg-[var(--color-teal)]/8 blur-3xl" />
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 md:pt-32 md:pb-24"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 text-sm font-medium text-secondary backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
              {t("nav.createEvent")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold leading-[1.15] tracking-tight md:text-5xl lg:text-[3.5rem]"
            >
              <span className="gradient-text">{t("home.hero.title")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed"
            >
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                asChild
                className="group bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25 transition-all hover:shadow-xl hover:shadow-secondary/30 rounded-xl h-12 px-6"
              >
                <Link to="/events/create">
                  {t("home.hero.createEvent")}
                  <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <div className="relative flex-1 max-w-sm">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search.placeholder")}
                  className="h-12 rounded-xl ps-11 border-2 bg-background/80 backdrop-blur-sm"
                  onFocus={(e) => {
                    e.target.blur()
                    window.location.href = "/search"
                  }}
                  readOnly
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center justify-center gap-6 lg:justify-start"
            >
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-secondary/20" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">2,000+</span> {t("events.detail.participants")}
              </p>
            </motion.div>
          </div>

          <motion.div
            style={{ y: mockupY, rotateZ: mockupRotate }}
            initial={{ opacity: 0, y: 60, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center perspective-[1200px]"
          >
            <div className="relative">
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-tr from-secondary/20 via-transparent to-primary/10 blur-2xl" />
              <div className="relative rounded-3xl bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 p-3 shadow-2xl shadow-secondary/10 backdrop-blur-xl border border-white/20">
                <img
                  src="/hero-mockup.png"
                  alt="Trempi App"
                  className="w-full max-w-md rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-2xl bg-gradient-to-br from-secondary to-primary opacity-20 blur-xl" />
              <div className="absolute -top-4 -start-4 h-20 w-20 rounded-2xl bg-gradient-to-br from-[var(--color-teal)] to-secondary opacity-15 blur-xl" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
