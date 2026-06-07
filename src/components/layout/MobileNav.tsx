import { Link, useLocation } from "react-router-dom";
import { Home, Search, Plus, Calendar, User } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";

const NAV_ITEMS = [
  { key: "nav.home", path: ROUTES.HOME, icon: Home },
  { key: "nav.search", path: ROUTES.SEARCH, icon: Search },
  { key: "nav.createEvent", path: ROUTES.CREATE_EVENT, icon: Plus, prominent: true },
  { key: "nav.events", path: ROUTES.EVENTS, icon: Calendar },
  { key: "nav.profile", path: ROUTES.PROFILE, icon: User },
] as const;

export function MobileNav() {
  const { t } = useI18n();
  const location = useLocation();

  const isActive = (path: string) =>
    path === ROUTES.HOME
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          if ("prominent" in item && item.prominent) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-transform hover:scale-105">
                  <Icon className="h-6 w-6" />
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors",
                active ? "text-secondary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.key)}</span>
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-secondary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
