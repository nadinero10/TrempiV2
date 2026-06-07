import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Car } from "lucide-react";
import type { Event } from "@/types/database";
import { useI18n } from "@/providers/I18nProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { t } = useI18n();

  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      to={`/event/${event.event_code}`}
      className="block"
      aria-label={event.title}
    >
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card className="h-full overflow-hidden border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <Calendar className="h-10 w-10 text-primary/40" />
            )}
            <Badge className="absolute top-3 end-3 bg-background/90 text-foreground shadow-sm backdrop-blur-sm">
              {formattedDate}
            </Badge>
          </div>
          <CardContent className="space-y-2 p-4">
            <h3 className="line-clamp-1 font-semibold">{event.title}</h3>
            {event.location && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Car className="h-3.5 w-3.5 shrink-0" />
              <span>{t("events.detail.rideOffers")}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
