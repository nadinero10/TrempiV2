import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-9xl font-bold text-primary"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-muted-foreground"
      >
        {t("notFound.message")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button asChild size="lg">
          <Link to={ROUTES.HOME}>{t("notFound.goHome")}</Link>
        </Button>
      </motion.div>
    </div>
  );
}
