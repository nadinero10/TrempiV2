import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Car,
  Bus,
  Shuffle,
  CircleDot,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/providers/I18nProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useCreateTransportation } from "@/hooks/useTransport";
import { cn } from "@/lib/utils";
import type { TransportationType } from "@/types/database";

interface OfferTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}

interface StopEntry {
  stop_name: string;
  city: string;
  stop_time: string;
  order_index: number;
}

const baseSchema = z.object({
  from_city: z.string().min(1),
  pickup_point: z.string().optional(),
  available_seats: z.number().min(1),
  total_seats: z.number().min(1),
  departure_time: z.string().optional(),
  return_time: z.string().optional(),
  driver_name: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  notes: z.string().optional(),
  price: z.number().optional(),
  bus_company: z.string().optional(),
  pickup_area: z.string().optional(),
  destination: z.string().optional(),
  frequency: z.string().optional(),
});

type FormData = z.infer<typeof baseSchema>;

const TYPE_OPTIONS: {
  value: TransportationType;
  icon: typeof Car;
  color: string;
}[] = [
  { value: "private_car", icon: Car, color: "border-blue-300 bg-blue-50 text-blue-700" },
  { value: "shared_taxi", icon: Car, color: "border-yellow-300 bg-yellow-50 text-yellow-700" },
  { value: "bus", icon: Bus, color: "border-green-300 bg-green-50 text-green-700" },
  { value: "shuttle", icon: Shuffle, color: "border-purple-300 bg-purple-50 text-purple-700" },
  { value: "other", icon: HelpCircle, color: "border-gray-300 bg-gray-50 text-gray-700" },
];

export function OfferTransportDialog({
  open,
  onOpenChange,
  eventId,
}: OfferTransportDialogProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const createTransport = useCreateTransportation();
  const [selectedType, setSelectedType] = useState<TransportationType | null>(null);
  const [stops, setStops] = useState<StopEntry[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: { available_seats: 1, total_seats: 4 },
  });

  const addStop = () => {
    setStops((prev) => [
      ...prev,
      { stop_name: "", city: "", stop_time: "", order_index: prev.length },
    ]);
  };

  const removeStop = (idx: number) => {
    setStops((prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order_index: i })));
  };

  const updateStop = (idx: number, field: keyof StopEntry, value: string) => {
    setStops((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedType || !user) return;

    await createTransport.mutateAsync({
      event_id: eventId,
      user_id: user.id,
      transportation_type: selectedType,
      status: "active",
      from_city: data.from_city,
      pickup_point: data.pickup_point ?? null,
      available_seats: data.available_seats,
      total_seats: data.total_seats,
      price: data.price ?? null,
      notes: data.notes ?? null,
      driver_name: data.driver_name ?? null,
      phone: data.phone ?? null,
      whatsapp: data.whatsapp ?? null,
      departure_time: data.departure_time ?? null,
      return_time: data.return_time ?? null,
      bus_company: data.bus_company ?? null,
      pickup_area: data.pickup_area ?? null,
      destination: data.destination ?? null,
      frequency: data.frequency ?? null,
    });

    toast.success(t("transport.offer.success"));
    reset();
    setSelectedType(null);
    setStops([]);
    onOpenChange(false);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedType(null);
      setStops([]);
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[85vh] rounded-t-2xl p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>{t("transport.offer.title")}</SheetTitle>
          <SheetDescription>{t("transport.offer.description")}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100%-5rem)] px-6 py-4">
          {!selectedType ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedType(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all hover:scale-[1.02]",
                    option.color,
                  )}
                >
                  <option.icon className="h-8 w-8" />
                  <span className="text-sm font-medium">
                    {t(`transport.type.${option.value}`)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-8">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedType(null)}
                >
                  ← {t("common.back")}
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                  {t(`transport.type.${selectedType}`)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from_city">{t("transport.form.fromCity")}</Label>
                  <Input id="from_city" {...register("from_city")} aria-invalid={!!errors.from_city} />
                </div>

                {(selectedType === "private_car" || selectedType === "shared_taxi" || selectedType === "other") && (
                  <div className="space-y-2">
                    <Label htmlFor="pickup_point">{t("transport.form.pickupPoint")}</Label>
                    <Input id="pickup_point" {...register("pickup_point")} />
                  </div>
                )}

                {selectedType === "shuttle" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pickup_area">{t("transport.form.pickupArea")}</Label>
                      <Input id="pickup_area" {...register("pickup_area")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">{t("transport.form.destination")}</Label>
                      <Input id="destination" {...register("destination")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">{t("transport.form.frequency")}</Label>
                      <Input id="frequency" {...register("frequency")} />
                    </div>
                  </>
                )}

                {selectedType === "bus" && (
                  <div className="space-y-2">
                    <Label htmlFor="bus_company">{t("transport.form.busCompany")}</Label>
                    <Input id="bus_company" {...register("bus_company")} />
                  </div>
                )}

                {selectedType !== "shuttle" && (
                  <div className="space-y-2">
                    <Label htmlFor="departure_time">{t("transport.form.departureTime")}</Label>
                    <Input id="departure_time" type="time" {...register("departure_time")} />
                  </div>
                )}

                {(selectedType === "bus") && (
                  <div className="space-y-2">
                    <Label htmlFor="return_time">{t("transport.form.returnTime")}</Label>
                    <Input id="return_time" type="time" {...register("return_time")} />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="available_seats">{t("transport.form.availableSeats")}</Label>
                  <Input id="available_seats" type="number" min={1} {...register("available_seats")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_seats">{t("transport.form.totalSeats")}</Label>
                  <Input id="total_seats" type="number" min={1} {...register("total_seats")} />
                </div>

                {(selectedType === "shared_taxi" || selectedType === "bus") && (
                  <div className="space-y-2">
                    <Label htmlFor="price">{t("transport.form.price")}</Label>
                    <Input id="price" type="number" min={0} {...register("price")} />
                  </div>
                )}

                {selectedType === "private_car" && (
                  <div className="space-y-2">
                    <Label htmlFor="driver_name">{t("transport.form.driverName")}</Label>
                    <Input id="driver_name" {...register("driver_name")} />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("transport.form.phone")}</Label>
                  <Input id="phone" type="tel" {...register("phone")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">{t("transport.form.whatsapp")}</Label>
                  <Input id="whatsapp" type="tel" {...register("whatsapp")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t("transport.form.notes")}</Label>
                <Textarea id="notes" rows={2} {...register("notes")} />
              </div>

              {selectedType === "bus" && (
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5">
                      <CircleDot className="h-4 w-4" />
                      {t("transport.form.stops")}
                    </Label>
                    <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addStop}>
                      <Plus className="h-3.5 w-3.5" />
                      {t("transport.form.addStop")}
                    </Button>
                  </div>
                  {stops.map((stop, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end">
                      <div className="space-y-1">
                        <Label className="text-xs">{t("transport.form.stopName")}</Label>
                        <Input
                          value={stop.stop_name}
                          onChange={(e) => updateStop(idx, "stop_name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("transport.form.stopCity")}</Label>
                        <Input
                          value={stop.city}
                          onChange={(e) => updateStop(idx, "city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("transport.form.stopTime")}</Label>
                        <Input
                          type="time"
                          value={stop.stop_time}
                          onChange={(e) => updateStop(idx, "stop_time", e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeStop(idx)}
                        aria-label={t("common.remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={createTransport.isPending}
              >
                {createTransport.isPending ? t("common.loading") : t("transport.offer.submit")}
              </Button>
            </form>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
