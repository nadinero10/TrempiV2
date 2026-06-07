import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Car,
  Bell,
  Users,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/providers/I18nProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useMyEvents } from "@/hooks/useEvents";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/useNotifications";
import { useMyTransportations, useMyRequests } from "@/hooks/useMyTransport";
import { cn } from "@/lib/utils";
import { OrganizerSection } from "@/pages/dashboard/OrganizerSection";
import type { Event, Notification, Transportation, TransportationRequest } from "@/types/database";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function DashboardPage() {
  const { t, isRTL } = useI18n();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("events");

  const eventsQuery = useMyEvents();
  const hasEvents = (eventsQuery.data?.length ?? 0) > 0;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 md:py-10">
      <motion.header className="mb-8" {...fadeIn}>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboard.title")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("dashboard.greeting", { name: profile?.full_name ?? "" })}
        </p>
      </motion.header>

      {hasEvents && <OrganizerSection events={eventsQuery.data!} />}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="events">{t("dashboard.tabs.events")}</TabsTrigger>
          <TabsTrigger value="rides">{t("dashboard.tabs.rides")}</TabsTrigger>
          <TabsTrigger value="requests">{t("dashboard.tabs.requests")}</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            {t("dashboard.tabs.notifications")}
            <NotificationBadge />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" forceMount className={activeTab !== "events" ? "hidden" : ""}>
          <MyEventsTab />
        </TabsContent>
        <TabsContent value="rides" forceMount className={activeTab !== "rides" ? "hidden" : ""}>
          <MyRidesTab />
        </TabsContent>
        <TabsContent value="requests" forceMount className={activeTab !== "requests" ? "hidden" : ""}>
          <MyRequestsTab />
        </TabsContent>
        <TabsContent value="notifications" forceMount className={activeTab !== "notifications" ? "hidden" : ""}>
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationBadge() {
  const { data: count } = useUnreadCount();
  if (!count) return null;
  return (
    <span className="absolute -top-1 end-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function MyEventsTab() {
  const { t } = useI18n();
  const { data: events, isLoading, error } = useMyEvents();

  if (isLoading) return <CardSkeletonList />;
  if (error) return <ErrorState message={t("dashboard.error")} />;
  if (!events?.length) return <EmptyState message={t("dashboard.events.empty")} />;

  return (
    <motion.div className="mt-4 grid gap-3" {...fadeIn}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </motion.div>
  );
}

function EventCard({ event }: { event: Event }) {
  const { t } = useI18n();
  const isPast = new Date(event.date) < new Date();

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate font-semibold">{event.title}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(event.date).toLocaleDateString()}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isPast ? "secondary" : "default"}>
            {isPast ? t("dashboard.events.past") : t("dashboard.events.upcoming")}
          </Badge>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/event/${event.event_code}`}>
              {t("dashboard.events.manage")}
              <ArrowUpRight className="ms-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MyRidesTab() {
  const { t } = useI18n();
  const { data: rides, isLoading, error } = useMyTransportations();

  if (isLoading) return <CardSkeletonList />;
  if (error) return <ErrorState message={t("dashboard.error")} />;
  if (!rides?.length) return <EmptyState message={t("dashboard.rides.empty")} />;

  return (
    <motion.div className="mt-4 grid gap-3" {...fadeIn}>
      {rides.map((ride) => (
        <RideCard key={ride.id} ride={ride} />
      ))}
    </motion.div>
  );
}

function RideCard({ ride }: { ride: Transportation }) {
  const { t } = useI18n();

  const statusColor: Record<string, string> = {
    active: "bg-green-500/10 text-green-700",
    full: "bg-amber-500/10 text-amber-700",
    completed: "bg-blue-500/10 text-blue-700",
    cancelled: "bg-red-500/10 text-red-700",
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <h3 className="truncate font-semibold">
              {t(`transport.types.${ride.transportation_type}`)}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {ride.from_city} → {ride.destination ?? t("dashboard.rides.event")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums text-muted-foreground">
            {ride.available_seats}/{ride.total_seats} {t("dashboard.rides.seats")}
          </span>
          <Badge className={cn("capitalize", statusColor[ride.status])}>
            {t(`transport.status.${ride.status}`)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function MyRequestsTab() {
  const { t } = useI18n();
  const { data: requests, isLoading, error } = useMyRequests();

  if (isLoading) return <CardSkeletonList />;
  if (error) return <ErrorState message={t("dashboard.error")} />;
  if (!requests?.length) return <EmptyState message={t("dashboard.requests.empty")} />;

  return (
    <motion.div className="mt-4 grid gap-3" {...fadeIn}>
      {requests.map((req) => (
        <RequestCard key={req.id} request={req} />
      ))}
    </motion.div>
  );
}

function RequestCard({ request }: { request: TransportationRequest }) {
  const { t } = useI18n();

  const statusColor: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-700",
    matched: "bg-green-500/10 text-green-700",
    cancelled: "bg-red-500/10 text-red-700",
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate font-semibold">{request.from_city}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              {request.passengers} {t("dashboard.requests.passengers")}
            </span>
          </div>
        </div>
        <Badge className={cn("capitalize", statusColor[request.status])}>
          {t(`transport.requestStatus.${request.status}`)}
        </Badge>
      </CardContent>
    </Card>
  );
}

function NotificationsTab() {
  const { t } = useI18n();
  const { data: notifications, isLoading, error } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const { data: unreadCount } = useUnreadCount();

  if (isLoading) return <CardSkeletonList />;
  if (error) return <ErrorState message={t("dashboard.error")} />;
  if (!notifications?.length) return <EmptyState message={t("dashboard.notifications.empty")} />;

  return (
    <motion.div className="mt-4 space-y-3" {...fadeIn}>
      {(unreadCount ?? 0) > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <CheckCircle2 className="me-1.5 h-3.5 w-3.5" />
            {t("dashboard.notifications.markAllRead")}
          </Button>
        </div>
      )}

      <ScrollArea className="max-h-[500px]">
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={() => markAsRead.mutate(notification.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: () => void;
}) {
  const { t } = useI18n();

  const iconMap: Record<string, React.ReactNode> = {
    ride: <Car className="h-4 w-4" />,
    request: <Users className="h-4 w-4" />,
    event: <Calendar className="h-4 w-4" />,
  };

  const timeAgo = getTimeAgo(notification.created_at, t);

  return (
    <button
      onClick={onRead}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-3 text-start transition-colors",
        notification.is_read
          ? "bg-background"
          : "border-primary/20 bg-primary/5",
      )}
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        {iconMap[notification.type] ?? <Bell className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm font-medium">{notification.title}</p>
        {notification.content && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {notification.content}
          </p>
        )}
        <p className="text-xs text-muted-foreground/60">{timeAgo}</p>
      </div>
      {!notification.is_read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

function CardSkeletonList() {
  return (
    <div className="mt-4 grid gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-2 text-center">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}

function getTimeAgo(dateStr: string, t: (key: string, params?: Record<string, string>) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return t("time.justNow");
  if (minutes < 60) return t("time.minutesAgo", { count: String(minutes) });
  if (hours < 24) return t("time.hoursAgo", { count: String(hours) });
  return t("time.daysAgo", { count: String(days) });
}
