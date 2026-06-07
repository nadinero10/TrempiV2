import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  LayoutDashboard,
  Languages,
} from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { key: "nav.home", path: ROUTES.HOME },
  { key: "nav.events", path: ROUTES.EVENTS },
  { key: "nav.search", path: ROUTES.SEARCH },
] as const;

export function Header() {
  const { t, language, setLanguage, isRTL } = useI18n();
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  const isActive = (path: string) =>
    path === ROUTES.HOME
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <img src="/trempi-logo.png" alt="Trempi" className="h-9 w-auto dark:invert mix-blend-multiply dark:mix-blend-screen" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                isActive(link.path)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label={t("nav.language")}
          >
            <span className="text-xs font-semibold">
              {language === "en" ? "AR" : "EN"}
            </span>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={profile?.avatar_url ?? undefined}
                      alt={profile?.full_name ?? ""}
                    />
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="w-48"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t("nav.dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={ROUTES.PROFILE}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void signOut()}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to={ROUTES.LOGIN}>{t("nav.login")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to={ROUTES.REGISTER}>{t("nav.register")}</Link>
              </Button>
            </div>
          )}
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={isRTL ? "left" : "right"} className="w-72">
            <SheetHeader>
              <SheetTitle className="text-start">
                <img src="/trempi-logo.png" alt="Trempi" className="h-8 w-auto dark:invert mix-blend-multiply dark:mix-blend-screen" />
              </SheetTitle>
              <SheetDescription className="sr-only">
                {t("nav.home")}
              </SheetDescription>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSheetOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActive(link.path)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-3 border-t pt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={toggleLanguage}
                >
                  <Languages className="h-4 w-4" />
                  {language === "en" ? "العربية" : "English"}
                </Button>
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {user ? (
                <div className="flex flex-col gap-1">
                  <Link
                    to={ROUTES.DASHBOARD}
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t("nav.dashboard")}
                  </Link>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                    {t("nav.profile")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      void signOut();
                      setSheetOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild onClick={() => setSheetOpen(false)}>
                    <Link to={ROUTES.LOGIN}>{t("nav.login")}</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    onClick={() => setSheetOpen(false)}
                  >
                    <Link to={ROUTES.REGISTER}>{t("nav.register")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
