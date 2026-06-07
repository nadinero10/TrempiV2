import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(/bg-pattern.png)", backgroundSize: "cover" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary"
            >
              <Sparkles className="h-4 w-4" />
              {t("nav.createEvent")}
            </motion.div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              <span className="gradient-text">{t("home.hero.title")}</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("home.hero.subtitle")}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Link to="/events/create">{t("home.hero.createEvent")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 hover:bg-muted/50"
              >
                <Link to="/search">{t("home.hero.joinEvent")}</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">{t("nav.events")}</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">2K+</div>
                <div className="text-xs text-muted-foreground">{t("events.detail.participants")}</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "var(--color-teal)" }}>98%</div>
                <div className="text-xs text-muted-foreground">{t("home.whyTrempi.betterExperience.title")}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-secondary/20 via-transparent to-[var(--color-teal)]/20 blur-2xl" />
              <img
                src="/hero-illustration.png"
                alt="People traveling together to events"
                className="relative w-full max-w-lg rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
