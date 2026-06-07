import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/providers/I18nProvider";
import { usePublicEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import EventCard from "@/components/shared/EventCard";

function EventCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export default function UpcomingEventsSection() {
  const { t } = useI18n();
  const { data: events, isLoading } = usePublicEvents(6);

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.upcomingEvents.title")}
          </h2>
          <Link
            to={ROUTES.SEARCH}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("home.upcomingEvents.viewAll")}
          </Link>
        </motion.div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : !events?.length ? (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="py-16 text-center text-muted-foreground"
            >
              {t("home.upcomingEvents.noEvents")}
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
