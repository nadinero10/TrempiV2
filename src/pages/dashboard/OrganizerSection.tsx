import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Armchair, Car, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/providers/I18nProvider";
import { useEventTransportation, useEventRequests } from "@/hooks/useTransport";
import { exportToCSV } from "@/lib/export";
import type { Event } from "@/types/database";

interface OrganizerSectionProps {
  events: Event[];
}

export function OrganizerSection({ events }: OrganizerSectionProps) {
  const { t } = useI18n();
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? "");

  const { data: transports } = useEventTransportation(selectedEventId);
  const { data: requests } = useEventRequests(selectedEventId);

  const eventStats = useMemo(() => {
    const rides = transports ?? [];
    const reqs = requests ?? [];

    const totalSeats = rides.reduce((sum, r) => sum + r.total_seats, 0);
    const availableSeats = rides.reduce((sum, r) => sum + r.available_seats, 0);
    const filledSeats = totalSeats - availableSeats;
    const utilization = totalSeats > 0 ? Math.round((filledSeats / totalSeats) * 100) : 0;

    return {
      totalRides: rides.length,
      totalRequests: reqs.length,
      totalSeats,
      filledSeats,
      utilization,
      totalPassengers: reqs.reduce((sum, r) => sum + r.passengers, 0),
    };
  }, [transports, requests]);

  const handleExport = () => {
    if (!transports?.length) return;
    const data = transports.map((item) => ({
      type: item.transportation_type,
      from_city: item.from_city,
      destination: item.destination ?? "",
      total_seats: item.total_seats,
      available_seats: item.available_seats,
      status: item.status,
      driver_name: item.driver_name ?? "",
      phone: item.phone ?? "",
      departure_time: item.departure_time ?? "",
    }));
    const eventTitle = events.find((e) => e.id === selectedEventId)?.title ?? "event";
    exportToCSV(data, `${eventTitle}-transportation`);
  };

  return (
    <motion.section
      className="mb-8 space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("dashboard.organizer.title")}</h2>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Car className="h-4 w-4" />}
          label={t("dashboard.organizer.totalRides")}
          value={eventStats.totalRides}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label={t("dashboard.organizer.totalRequests")}
          value={eventStats.totalRequests}
        />
        <StatCard
          icon={<Armchair className="h-4 w-4" />}
          label={t("dashboard.organizer.totalSeats")}
          value={eventStats.totalSeats}
        />
        <StatCard
          icon={<BarChart3 className="h-4 w-4" />}
          label={t("dashboard.organizer.utilization")}
          value={`${eventStats.utilization}%`}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2">
        <span className="text-sm text-muted-foreground">
          {t("dashboard.organizer.passengers", { count: String(eventStats.totalPassengers) })}
        </span>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={!transports?.length}>
          <Download className="me-1.5 h-3.5 w-3.5" />
          {t("dashboard.organizer.export")}
        </Button>
      </div>

      <Separator />
    </motion.section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-xl font-bold tabular-nums">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
