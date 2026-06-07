import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CalendarDays, Globe, Car } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/providers/I18nProvider";
import { useSearchEvents } from "@/hooks/useEvents";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/database";

export default function SearchPage() {
  const { t, isRTL } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [publicOnly, setPublicOnly] = useState(false);
  const [hasTransport, setHasTransport] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  const debouncedQuery = useDebounce(searchTerm, 300);

  const { data: results, isLoading, error } = useSearchEvents(debouncedQuery, {
    publicOnly,
    date: dateFilter || undefined,
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="relative">
          <Search className={cn(
            "absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground",
            isRTL ? "right-4" : "left-4",
          )} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("search.placeholder")}
            className={cn(
              "h-14 rounded-xl text-lg shadow-sm",
              isRTL ? "pr-12 pl-4" : "pl-12 pr-4",
            )}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterToggle
            active={publicOnly}
            onClick={() => setPublicOnly(!publicOnly)}
            icon={<Globe className="h-3.5 w-3.5" />}
            label={t("search.filters.publicOnly")}
          />
          <FilterToggle
            active={hasTransport}
            onClick={() => setHasTransport(!hasTransport)}
            icon={<Car className="h-3.5 w-3.5" />}
            label={t("search.filters.hasTransport")}
          />
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-md border bg-background px-2.5 py-1.5 text-sm"
            />
          </div>
        </div>

        <Separator />

        {debouncedQuery && !isLoading && results && (
          <p className="text-sm text-muted-foreground">
            {t("search.resultsCount", { count: String(results.length) })}
          </p>
        )}

        {isLoading && <SearchSkeletonGrid />}

        {error && (
          <div className="py-12 text-center">
            <p className="text-sm text-destructive">{t("search.error")}</p>
          </div>
        )}

        {!isLoading && !error && debouncedQuery && results?.length === 0 && (
          <EmptySearchState />
        )}

        {!isLoading && results && results.length > 0 && (
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {results.map((event) => (
              <SearchResultCard key={event.id} event={event} />
            ))}
          </motion.div>
        )}

        {!debouncedQuery && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("search.startTyping")}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function FilterToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="gap-1.5"
    >
      {icon}
      {label}
    </Button>
  );
}

function SearchResultCard({ event }: { event: Event }) {
  const { t } = useI18n();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2">{event.title}</h3>
            <Badge variant={event.visibility === "public" ? "default" : "secondary"} className="shrink-0">
              {t(`event.visibility.${event.visibility}`)}
            </Badge>
          </div>

          {event.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(event.date).toLocaleDateString()}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {event.location}
              </span>
            )}
          </div>

          <Button variant="ghost" size="sm" className="w-full" asChild>
            <a href={`/event/${event.event_code}`}>
              {t("search.viewEvent")}
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SearchSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptySearchState() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="font-medium">{t("search.noResults")}</p>
      <p className="text-sm text-muted-foreground">{t("search.tryDifferent")}</p>
    </div>
  );
}
