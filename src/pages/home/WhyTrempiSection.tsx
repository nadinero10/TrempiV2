import { motion } from "framer-motion";
import { Wallet, Users, TrafficCone, Sparkles } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { key: "saveMoney", icon: Wallet },
  { key: "meetPeople", icon: Users },
  { key: "reduceTraffic", icon: TrafficCone },
  { key: "betterExperience", icon: Sparkles },
] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function WhyTrempiSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-center text-3xl font-bold tracking-tight md:text-4xl"
        >
          {t("home.whyTrempi.title")}
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.key}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <Card className="h-full border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {t(`home.whyTrempi.${benefit.key}.title`)}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t(`home.whyTrempi.${benefit.key}.description`)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
