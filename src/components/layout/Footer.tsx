import { Link } from "react-router-dom";
import { useI18n } from "@/providers/I18nProvider";
import { APP_NAME } from "@/lib/constants";
import { ROUTES } from "@/config/routes";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const FOOTER_LINKS = {
  product: [
    { key: "nav.events", path: ROUTES.EVENTS },
    { key: "nav.search", path: ROUTES.SEARCH },
    { key: "nav.createEvent", path: ROUTES.CREATE_EVENT },
  ],
  company: [
    { key: "footer.aboutUs", path: "#" },
    { key: "footer.careers", path: "#" },
    { key: "footer.contact", path: "#" },
  ],
  legal: [
    { key: "footer.privacy", path: "#" },
    { key: "footer.terms", path: "#" },
  ],
} as const;

export function Footer() {
  const { t, language, setLanguage } = useI18n();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to={ROUTES.HOME} className="inline-block">
              <img src="/trempi-logo.png" alt="Trempi" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-2 text-sm text-primary-foreground/70">
              {t("footer.about")}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
              {t("footer.product")}
            </h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
              {t("footer.company")}
            </h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
              {t("footer.legal")}
            </h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} {APP_NAME}. {t("footer.rights")}.
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              {language === "en" ? "العربية" : "English"}
            </Button>

            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
