import { motion } from "framer-motion";
import { useI18n } from "@/providers/I18nProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const placeholders = [
  { initials: "SA", name: "Sarah A.", quote: "Trempi made our community event so much easier to organize. Everyone found rides!" },
  { initials: "MK", name: "Mohammed K.", quote: "I saved so much on transportation costs. Great way to meet people heading to the same events." },
  { initials: "LR", name: "Lina R.", quote: "The ride matching is seamless. I use Trempi for every conference now." },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function TestimonialsSection() {
  const { t } = useI18n();

  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="text-center text-3xl font-bold tracking-tight md:text-4xl"
        >
          {t("home.testimonials.title")}
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {placeholders.map((item, i) => (
            <motion.div
              key={item.initials}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <Card className="h-full border bg-card shadow-sm">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {item.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-semibold">{item.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
