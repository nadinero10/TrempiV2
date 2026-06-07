import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Image,
  Eye,
  Lock,
  Copy,
  Check,
  MessageCircle,
  Send,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/providers/I18nProvider";
import { useCreateEvent } from "@/hooks/useEvents";
import type { Event } from "@/types/database";
import { cn } from "@/lib/utils";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  location: z.string().min(1),
  visibility: z.enum(["public", "private"]),
  image_url: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const createEvent = useCreateEvent();
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { visibility: "public" },
  });

  const visibility = watch("visibility");

  const onSubmit = async (data: EventFormData) => {
    const result = await createEvent.mutateAsync(data);
    setCreatedEvent(result);
  };

  const eventUrl = createdEvent
    ? `${window.location.origin}/event/${createdEvent.event_code}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t("events.create.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">{t("events.form.name")}</Label>
                <Input
                  id="title"
                  {...register("title")}
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{t("validation.required")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("events.form.description")}</Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    <Calendar className="inline h-4 w-4 me-1" />
                    {t("events.form.date")}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    aria-invalid={!!errors.date}
                  />
                  {errors.date && (
                    <p className="text-xs text-destructive">{t("validation.required")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">{t("events.form.startTime")}</Label>
                  <Input id="start_time" type="time" {...register("start_time")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">{t("events.form.endTime")}</Label>
                  <Input id="end_time" type="time" {...register("end_time")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="inline h-4 w-4 me-1" />
                  {t("events.form.location")}
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  aria-invalid={!!errors.location}
                />
                {errors.location && (
                  <p className="text-xs text-destructive">{t("validation.required")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t("events.form.visibility")}</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setValue("visibility", "public")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors",
                      visibility === "public"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <Eye className="h-4 w-4" />
                    {t("events.form.public")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("visibility", "private")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors",
                      visibility === "private"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <Lock className="h-4 w-4" />
                    {t("events.form.private")}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">
                  <Image className="inline h-4 w-4 me-1" />
                  {t("events.form.imageUrl")}
                </Label>
                <Input id="image_url" type="url" {...register("image_url")} />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={createEvent.isPending}
              >
                {createEvent.isPending
                  ? t("common.loading")
                  : t("events.create.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={!!createdEvent} onOpenChange={(open) => !open && setCreatedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("events.create.success")}</DialogTitle>
            <DialogDescription>{t("events.create.successDesc")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-5 py-4">
            <div className="rounded-xl bg-primary/10 px-6 py-3">
              <p className="text-2xl font-bold tracking-wider text-primary">
                {createdEvent?.event_code}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-3">
              <QRCodeSVG value={eventUrl} size={160} level="M" />
            </div>

            <div className="flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
              <span className="flex-1 truncate text-sm" dir="ltr">{eventUrl}</span>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label={t("share.copy")}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                onClick={() => {
                  const text = encodeURIComponent(`${createdEvent?.title}\n${eventUrl}`);
                  window.open(`https://wa.me/?text=${text}`, "_blank");
                }}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                onClick={() => {
                  const url = encodeURIComponent(eventUrl);
                  const text = encodeURIComponent(createdEvent?.title ?? "");
                  window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
                }}
              >
                <Send className="h-4 w-4" />
                Telegram
              </Button>
            </div>

            <Button
              className="w-full gap-2"
              onClick={() => navigate(`/event/${createdEvent?.event_code}`)}
            >
              <ExternalLink className="h-4 w-4" />
              {t("events.create.goToEvent")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
