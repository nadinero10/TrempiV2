import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { usePublicEvents } from "@/hooks/useEvents"
import EventCard from "@/components/shared/EventCard"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventsListPage() {
  const { t } = useI18n()
  const { data: events, isLoading } = usePublicEvents()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">{t("nav.events")}</h1>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Calendar className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">
            {t("home.upcomingEvents.noEvents")}
          </p>
        </div>
      )}
    </div>
  )
}
