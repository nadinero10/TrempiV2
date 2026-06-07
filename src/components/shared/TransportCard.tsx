import { useState } from "react";
import {
  Car,
  Bus,
  Users,
  MapPin,
  Clock,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Transportation, TransportationStop } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/I18nProvider";
import { StopTimeline } from "./StopTimeline";

interface TransportCardProps {
  transport: Transportation & { stops?: TransportationStop[] };
}

const TYPE_CONFIG = {
  private_car: { icon: Car, color: "bg-blue-100 text-blue-700 border-blue-200" },
  shared_taxi: { icon: Car, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  bus: { icon: Bus, color: "bg-green-100 text-green-700 border-green-200" },
  shuttle: { icon: Bus, color: "bg-purple-100 text-purple-700 border-purple-200" },
  other: { icon: Users, color: "bg-gray-100 text-gray-700 border-gray-200" },
} as const;

export function TransportCard({ transport }: TransportCardProps) {
  const { t, isRTL } = useI18n();
  const [notesExpanded, setNotesExpanded] = useState(false);

  const config = TYPE_CONFIG[transport.transportation_type];
  const Icon = config.icon;
  const seatsUsed = transport.total_seats - transport.available_seats;
  const seatsPct = transport.total_seats > 0
    ? (seatsUsed / transport.total_seats) * 100
    : 0;

  const isActive = transport.status === "active";

  return (
    <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", !isActive && "opacity-75")}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={cn("gap-1 font-medium", config.color)} variant="outline">
            <Icon className="h-3.5 w-3.5" />
            {t(`transport.type.${transport.transportation_type}`)}
          </Badge>
          {!isActive && (
            <Badge variant="secondary" className="text-xs">
              {t(`transport.status.${transport.status}`)}
            </Badge>
          )}
        </div>

        {transport.driver_name && (
          <p className="font-medium text-sm">{transport.driver_name}</p>
        )}
        {transport.bus_company && (
          <p className="font-medium text-sm">{transport.bus_company}</p>
        )}

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">
              {transport.from_city}
              {transport.pickup_point && ` — ${transport.pickup_point}`}
            </span>
          </div>
          {transport.departure_time && (
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{transport.departure_time}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t("transport.seats", {
                available: String(transport.available_seats),
                total: String(transport.total_seats),
              })}
            </span>
            {transport.price != null && transport.price > 0 && (
              <span className="font-semibold text-primary">
                ₪{transport.price}
              </span>
            )}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                seatsPct >= 100 ? "bg-red-500" : seatsPct >= 70 ? "bg-yellow-500" : "bg-green-500",
              )}
              style={{ width: `${Math.min(seatsPct, 100)}%` }}
            />
          </div>
        </div>

        {transport.transportation_type === "bus" &&
          transport.stops &&
          transport.stops.length > 0 && (
            <StopTimeline stops={transport.stops} />
          )}

        {transport.notes && (
          <div>
            <button
              type="button"
              onClick={() => setNotesExpanded(!notesExpanded)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {notesExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {t("transport.notes")}
            </button>
            {notesExpanded && (
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {transport.notes}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          {transport.whatsapp && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5 text-green-600 border-green-200 hover:bg-green-50"
              asChild
            >
              <a
                href={`https://wa.me/${transport.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </Button>
          )}
          {transport.phone && (
            <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
              <a href={`tel:${transport.phone}`}>
                <Phone className="h-3.5 w-3.5" />
                {t("transport.call")}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
