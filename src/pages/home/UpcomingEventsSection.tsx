import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Calendar } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { usePublicEvents } from "@/hooks/useEvents"
import EventCard from "@/components/shared/EventCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UpcomingEventsSection() {
  const { t } = useI18n()
  const { data: events, isLoading } = usePublicEvents(6)

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary">
            <Calendar className="h-3.5 w-3.5" />
            {t("home.upcomingEvents.title")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.upcomingEvents.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto mt-8 max-w-xl"
        >
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search.placeholder")}
              className="h-12 rounded-xl ps-11 pe-4 border-2 border-border/60 bg-card shadow-sm"
              onFocus={(e) => { e.target.blur(); window.location.href = "/search" }}
              readOnly
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">{t("home.upcomingEvents.noEvents")}</p>
            <Button variant="outline" asChild className="mt-4 rounded-xl">
              <Link to="/events/create">{t("home.hero.createEvent")}</Link>
            </Button>
          </div>
        )}

        {events && events.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="ghost" asChild className="text-secondary hover:text-secondary/80 rounded-xl">
              <Link to="/events">{t("home.upcomingEvents.viewAll")} →</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
