import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useI18n } from "@/providers/I18nProvider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  { initials: "SA", name: "Sarah A.", role: "Event Organizer", gradient: "from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30" },
  { initials: "MK", name: "Mohammed K.", role: "University Student", gradient: "from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30" },
  { initials: "LR", name: "Lina R.", role: "Conference Speaker", gradient: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30" },
] as const

const quoteKeys = ["testimonial1", "testimonial2", "testimonial3"] as const

export default function TestimonialsSection() {
  const { t } = useI18n()

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.testimonials.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.initials}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="group"
            >
              <div className="h-full rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="h-6 w-6 text-secondary/20 mb-3" />

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`home.testimonials.${quoteKeys[i]}`)}
                </p>

                <div className="mt-5 flex items-center gap-3 border-t pt-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={`bg-gradient-to-br ${item.gradient} text-xs font-semibold`}>
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
