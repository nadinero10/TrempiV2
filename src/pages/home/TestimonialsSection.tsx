import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  { initials: "SA", name: "Sarah A.", role: "Event Organizer", quote: "Trempi made our community event so much easier to organize. Everyone found rides instantly!" },
  { initials: "MK", name: "Mohammed K.", role: "University Student", quote: "I saved so much on transportation costs. Great way to meet people heading to the same events." },
  { initials: "LR", name: "Lina R.", role: "Conference Speaker", quote: "The ride matching is seamless. I use Trempi for every conference and meetup now." },
] as const

export default function TestimonialsSection() {
  const { t } = useI18n()

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.testimonials.title")}
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.initials}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group"
            >
              <div className="h-full rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-secondary/20">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-secondary/30 mb-3" />

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.quote}
                </p>

                <div className="mt-6 flex items-center gap-3 border-t pt-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-secondary/20 to-primary/20 font-semibold text-sm">
                      {item.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
