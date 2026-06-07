import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, Clock, Users, Car } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/providers/I18nProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useCreateRequest, useMatchingTransport } from "@/hooks/useTransport";
import { cn } from "@/lib/utils";
import type { Transportation } from "@/types/database";

interface RequestTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}

const requestSchema = z.object({
  from_city: z.string().min(1),
  pickup_point: z.string().optional(),
  preferred_time: z.string().optional(),
  passengers: z.number().min(1),
  contact: z.string().optional(),
  notes: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

export function RequestTransportDialog({
  open,
  onOpenChange,
  eventId,
}: RequestTransportDialogProps) {
  const { t, isRTL } = useI18n();
  const { user } = useAuth();
  const createRequest = useCreateRequest();
  const [submitted, setSubmitted] = useState(false);
  const [submittedCity, setSubmittedCity] = useState("");

  const { data: matches } = useMatchingTransport(eventId, submittedCity);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { passengers: 1 },
  });

  const onSubmit = async (data: RequestFormData) => {
    if (!user) return;

    await createRequest.mutateAsync({
      event_id: eventId,
      user_id: user.id,
      from_city: data.from_city,
      pickup_point: data.pickup_point ?? null,
      preferred_time: data.preferred_time ?? null,
      passengers: data.passengers,
      contact: data.contact ?? null,
      notes: data.notes ?? null,
      status: "pending",
    });

    toast.success(t("transport.request.success"));
    setSubmittedCity(data.from_city);
    setSubmitted(true);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setSubmitted(false);
      setSubmittedCity("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[80vh] sm:h-[70vh] rounded-t-2xl p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>{t("transport.request.title")}</SheetTitle>
          <SheetDescription>{t("transport.request.description")}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100%-5rem)] px-6 py-4">
          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="req_from_city">
                    <MapPin className="inline h-4 w-4 me-1" />
                    {t("transport.form.fromCity")}
                  </Label>
                  <Input
                    id="req_from_city"
                    {...register("from_city")}
                    aria-invalid={!!errors.from_city}
                  />
                  {errors.from_city && (
                    <p className="text-xs text-destructive">{t("validation.required")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req_pickup_point">{t("transport.form.pickupPoint")}</Label>
                  <Input id="req_pickup_point" {...register("pickup_point")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req_preferred_time">
                    <Clock className="inline h-4 w-4 me-1" />
                    {t("transport.form.preferredTime")}
                  </Label>
                  <Input id="req_preferred_time" type="time" {...register("preferred_time")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req_passengers">
                    <Users className="inline h-4 w-4 me-1" />
                    {t("transport.form.passengers")}
                  </Label>
                  <Input
                    id="req_passengers"
                    type="number"
                    min={1}
                    {...register("passengers")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req_contact">{t("transport.form.contact")}</Label>
                  <Input id="req_contact" {...register("contact")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="req_notes">{t("transport.form.notes")}</Label>
                <Textarea id="req_notes" rows={2} {...register("notes")} />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={createRequest.isPending}
              >
                {createRequest.isPending ? t("common.loading") : t("transport.request.submit")}
              </Button>
            </form>
          ) : (
            <div className="space-y-4 pb-8">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                <p className="text-sm font-medium text-green-800">
                  {t("transport.request.submitted")}
                </p>
              </div>

              {matches && matches.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">
                    {t("transport.request.matches")}
                  </h3>
                  {matches.map((match: Transportation) => (
                    <Card key={match.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                            <Car className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {match.from_city}
                            </span>
                            {match.departure_time && (
                              <span className="text-xs text-muted-foreground">
                                {match.departure_time}
                              </span>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {match.available_seats} {t("transport.seatsLeft")}
                          </Badge>
                        </div>
                        {match.whatsapp && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full gap-1.5 text-green-600 border-green-200"
                            asChild
                          >
                            <a
                              href={`https://wa.me/${match.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("transport.contactDriver")}
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {matches && matches.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  {t("transport.request.noMatches")}
                </p>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleClose(false)}
              >
                {t("common.close")}
              </Button>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
