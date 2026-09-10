"use client";

import * as React from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dir,
  messages,
  children,
}: {
  locale: Locale;
  dir: "ltr" | "rtl";
  messages: Dictionary;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ locale, dir, t: messages }),
    [locale, dir, messages],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

/** Build a locale-prefixed href. */
export function useLocalePath() {
  const { locale } = useI18n();
  return React.useCallback(
    (path: string) => {
      const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
      return `/${locale}${clean}`;
    },
    [locale],
  );
}
