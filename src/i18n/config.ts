export const locales = ["es", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const rtlLocales: Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  ar: "العربية",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirForLocale(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

// Country (ISO-3166-1 alpha-2) -> preferred locale. Used for geo detection.
const arabicCountries = [
  "SA", "AE", "EG", "QA", "KW", "BH", "OM", "JO", "IQ", "LB", "LY", "DZ",
  "MA", "TN", "SD", "YE", "PS", "SY", "MR", "SO", "DJ", "KM",
];
const spanishCountries = [
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO",
  "HN", "PY", "SV", "NI", "CR", "PA", "UY", "GQ",
];

export function localeFromCountry(country?: string | null): Locale | null {
  if (!country) return null;
  const c = country.toUpperCase();
  if (arabicCountries.includes(c)) return "ar";
  if (spanishCountries.includes(c)) return "es";
  return "en";
}

export function localeFromAcceptLanguage(header?: string | null): Locale | null {
  if (!header) return null;
  const parts = header
    .split(",")
    .map((p) => {
      const [tag, q] = p.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of parts) {
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("es")) return "es";
    if (tag.startsWith("en")) return "en";
  }
  return null;
}
