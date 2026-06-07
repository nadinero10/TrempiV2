import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  const { t } = useI18n()

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-10 text-center text-white shadow-2xl shadow-primary/20 md:p-16"
        >
          <div className="absolute top-0 start-0 h-full w-full opacity-10">
            <div className="absolute top-10 start-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-10 end-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute top-1/2 start-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
            >
              <Sparkles className="h-7 w-7" />
            </motion.div>

            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              {t("home.hero.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {t("home.hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="group bg-white text-primary hover:bg-white/90 shadow-lg rounded-xl h-12 px-8 font-semibold"
              >
                <Link to="/events/create">
                  {t("home.hero.createEvent")}
                  <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-8"
              >
                <Link to="/search">{t("home.hero.joinEvent")}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
