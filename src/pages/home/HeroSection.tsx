import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Bus, Users, MapPin } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="relative hidden lg:flex items-center justify-center"
    >
      <div className="relative h-80 w-80">
        <div className="absolute inset-0 rounded-full bg-primary/5" />
        <div className="absolute inset-6 rounded-full bg-primary/10" />

        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 start-1/2 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
        >
          <Car className="h-7 w-7" />
        </motion.div>

        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 end-4 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-lg"
        >
          <Bus className="h-6 w-6" />
        </motion.div>

        <motion.div
          animate={{ y: [-3, 5, -3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 start-1/2 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
        >
          <Users className="h-7 w-7" />
        </motion.div>

        <motion.div
          animate={{ y: [3, -5, 3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 start-4 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-lg"
        >
          <MapPin className="h-6 w-6" />
        </motion.div>

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 320 320"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="160"
            cy="160"
            r="120"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="6 6"
          />
        </svg>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center lg:text-start"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {t("home.hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link to={ROUTES.CREATE_EVENT}>
                  {t("home.hero.createEvent")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={ROUTES.SEARCH}>
                  {t("home.hero.joinEvent")}
                </Link>
              </Button>
            </div>
          </motion.div>

          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
