import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Search, Star } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function FloatingMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative"
    >
      <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 blur-3xl" />

      <div className="relative space-y-4">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl border bg-card p-4 shadow-xl shadow-secondary/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-muted-foreground">Ride Confirmed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center text-xs font-bold">DA</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">David A.</p>
              <p className="text-xs text-muted-foreground">Haifa → Tel Aviv Conference</p>
            </div>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">4.9</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-xs text-muted-foreground">3 seats available</span>
            <span className="text-xs font-medium text-secondary">Join ride →</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="ms-8 rounded-2xl border bg-card p-4 shadow-lg shadow-primary/5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
              <span className="text-lg">🚌</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Bus - Nazareth Route</p>
              <p className="text-xs text-muted-foreground">12 stops • 40 seats</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="me-4 rounded-2xl border bg-card p-4 shadow-lg shadow-secondary/5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <span className="text-lg">🎉</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Tech Meetup 2026</p>
              <p className="text-xs text-muted-foreground">15 rides • 48 passengers</p>
            </div>
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400">Live</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function HeroSection() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-secondary/[0.04] via-background to-background" />
      <div className="absolute top-0 end-0 w-1/2 h-full bg-gradient-to-l from-secondary/[0.03] to-transparent" />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-28"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <FloatingMockup />
          </div>

          <div className="order-1 lg:order-2 text-center lg:text-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary"
            >
              <Star className="h-3.5 w-3.5 fill-secondary" />
              {t("nav.createEvent")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold leading-[1.2] tracking-tight md:text-5xl lg:text-[3.25rem]"
            >
              <span className="gradient-text">{t("home.hero.title")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-base text-muted-foreground md:text-lg leading-relaxed"
            >
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                size="lg"
                asChild
                className="group bg-secondary hover:bg-secondary/90 text-white rounded-xl h-12 px-6 shadow-md shadow-secondary/20"
              >
                <Link to="/events/create">
                  {t("home.hero.createEvent")}
                  <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </Button>

              <div className="relative flex-1 max-w-xs">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search.placeholder")}
                  className="h-12 rounded-xl ps-10 border-2 border-border/60 bg-card"
                  onFocus={(e) => { e.target.blur(); window.location.href = "/search" }}
                  readOnly
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6"
            >
              <Button variant="ghost" size="sm" asChild className="text-secondary hover:text-secondary/80 hover:bg-secondary/5 rounded-lg">
                <Link to="/search">
                  <Star className="me-1.5 h-3.5 w-3.5" />
                  {t("home.hero.joinEvent")}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
