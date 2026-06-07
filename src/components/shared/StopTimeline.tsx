import type { TransportationStop } from "@/types/database";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/I18nProvider";

interface StopTimelineProps {
  stops: TransportationStop[];
}

export function StopTimeline({ stops }: StopTimelineProps) {
  const { isRTL } = useI18n();

  const sorted = [...stops].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="relative py-2">
      <div
        className={cn(
          "absolute top-0 bottom-0 w-0.5 bg-border",
          isRTL ? "right-[7px]" : "left-[7px]",
        )}
      />
      <div className="space-y-3">
        {sorted.map((stop) => (
          <div
            key={stop.id}
            className={cn(
              "relative flex items-start gap-3",
              isRTL && "flex-row-reverse",
            )}
          >
            <div className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-background" />
            <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
              <p className="text-sm font-medium leading-tight truncate">
                {stop.stop_name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{stop.city}</span>
                {stop.stop_time && (
                  <>
                    <span className="text-border">•</span>
                    <span>{stop.stop_time}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
