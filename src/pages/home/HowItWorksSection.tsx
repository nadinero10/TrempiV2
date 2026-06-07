import { motion } from "framer-motion";
import { CalendarPlus, Car, Users } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { key: "step1", icon: CalendarPlus },
  { key: "step2", icon: Car },
  { key: "step3", icon: Users },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function HowItWorksSection() {
  const { t } = useI18n();

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-center text-3xl font-bold tracking-tight md:text-4xl"
        >
          {t("home.howItWorks.title")}
        </motion.h2>

        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            className="pointer-events-none absolute top-14 hidden h-px w-full border-t border-dashed border-border md:block"
            aria-hidden="true"
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.key}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <Card className="relative border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col items-center px-6 pt-8 pb-8 text-center">
                    <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {t(`home.howItWorks.${step.key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t(`home.howItWorks.${step.key}.description`)}
                    </p>
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
