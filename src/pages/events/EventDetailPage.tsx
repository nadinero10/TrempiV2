import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Hand,
  Armchair,
  Users,
  Share2,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/providers/I18nProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useEvent } from "@/hooks/useEvents";
import { useEventTransportation, useEventRequests } from "@/hooks/useTransport";
import { cn } from "@/lib/utils";
import { TransportCard } from "@/components/shared/TransportCard";
import { ShareModal } from "@/components/shared/ShareModal";
import { OfferTransportDialog } from "./OfferTransportDialog";
import { RequestTransportDialog } from "./RequestTransportDialog";

export default function EventDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { t, isRTL } = useI18n();
  const { user } = useAuth();

  const { data: event, isLoading, error } = useEvent(code ?? "");
  const { data: transports } = useEventTransportation(event?.id ?? "");
  const { data: requests } = useEventRequests(event?.id ?? "");

  const [shareOpen, setShareOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">{t("events.notFound")}</p>
      </div>
    );
  }

  const eventUrl = `${window.location.origin}/event/${event.event_code}`;
  const isOrganizer = user?.id === event.organizer_id;

  const activeTransports = transports?.filter((t) => t.status === "active") ?? [];
  const totalSeats = activeTransports.reduce((sum, t) => sum + t.available_seats, 0);

  const stats = [
    { label: t("events.stats.offers"), value: transports?.length ?? 0, icon: Car },
    { label: t("events.stats.requests"), value: requests?.length ?? 0, icon: Hand },
    { label: t("events.stats.seats"), value: totalSeats, icon: Armchair },
    { label: t("events.stats.participants"), value: (transports?.length ?? 0) + (requests?.length ?? 0), icon: Users },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/80 to-primary/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <div className="container max-w-4xl mx-auto flex items-end justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                {event.title}
              </h1>
              {event.description && (
                <p className="mt-1 text-sm text-white/80 line-clamp-2 max-w-lg">
                  {event.description}
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="shrink-0 rounded-full"
              onClick={() => setShareOpen(true)}
              aria-label={t("share.title")}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 text-sm text-muted-foreground"
        >
          <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
            <Calendar className="h-4 w-4 text-primary" />
            <span>{event.date}</span>
          </div>
          {(event.start_time || event.end_time) && (
            <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
              <Clock className="h-4 w-4 text-primary" />
              <span>
                {event.start_time}
                {event.end_time && ` - ${event.end_time}`}
              </span>
            </div>
          )}
          {event.location && (
            <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
          )}
        </motion.div>

        {isOrganizer && (
          <div className="flex">
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link to={`/event/${event.event_code}/manage`}>
                <Settings className="h-3.5 w-3.5" />
                {t("events.manage")}
              </Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-4">
                <stat.icon className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => setOfferOpen(true)}
          >
            <Car className="h-5 w-5" />
            {t("events.offerTransport")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() => setRequestOpen(true)}
          >
            <Hand className="h-5 w-5" />
            {t("events.requestTransport")}
          </Button>
        </div>

        <Tabs defaultValue="offers" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="offers" className="flex-1 gap-1.5">
              <Car className="h-4 w-4" />
              {t("events.tabs.offers")}
              {transports && transports.length > 0 && (
                <Badge variant="secondary" className="ms-1 h-5 min-w-5 px-1 text-[10px]">
                  {transports.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1 gap-1.5">
              <Hand className="h-4 w-4" />
              {t("events.tabs.requests")}
              {requests && requests.length > 0 && (
                <Badge variant="secondary" className="ms-1 h-5 min-w-5 px-1 text-[10px]">
                  {requests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="mt-4">
            {!transports || transports.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Car className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>{t("events.empty.offers")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {transports.map((transport) => (
                  <TransportCard key={transport.id} transport={transport} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            {!requests || requests.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Hand className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>{t("events.empty.requests")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <Card key={req.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className={cn("flex items-center gap-2 text-sm", isRTL && "flex-row-reverse")}>
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span className="font-medium">{req.from_city}</span>
                            {req.pickup_point && (
                              <span className="text-muted-foreground">— {req.pickup_point}</span>
                            )}
                          </div>
                          {req.preferred_time && (
                            <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
                              <Clock className="h-3 w-3" />
                              <span>{req.preferred_time}</span>
                            </div>
                          )}
                          {req.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{req.notes}</p>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {req.passengers} {t("events.passengers")}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        url={eventUrl}
        title={event.title}
      />

      <OfferTransportDialog
        open={offerOpen}
        onOpenChange={setOfferOpen}
        eventId={event.id}
      />

      <RequestTransportDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        eventId={event.id}
      />
    </div>
  );
}
