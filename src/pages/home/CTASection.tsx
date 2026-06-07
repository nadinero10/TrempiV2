import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Search } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  const { t } = useI18n()

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.hero.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-xl h-12 px-6 border-2"
            >
              <Link to="/search">
                <Search className="me-2 h-4 w-4" />
                {t("home.hero.joinEvent")}
              </Link>
            </Button>
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}
