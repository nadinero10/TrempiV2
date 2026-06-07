import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";
type Translations = Record<string, unknown>;

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: Direction;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string>) => string;
}

const STORAGE_KEY = "trempi-language";

const translations: Record<Language, Translations> = { en, ar };

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function getNestedValue(obj: Translations, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, params: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => params[key] ?? `{{${key}}}`);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "ar" ? "ar" : "en";
  });

  const dir: Direction = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
  }, []);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      const value = getNestedValue(translations[language], key);
      if (value === undefined) return key;
      return params ? interpolate(value, params) : value;
    },
    [language]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, dir, isRTL, t }),
    [language, setLanguage, dir, isRTL, t]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
