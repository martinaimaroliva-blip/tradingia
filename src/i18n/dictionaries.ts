import "server-only";
import type { Locale } from "./config";
import { en } from "./messages/en";
import type { Dictionary } from "./types";

export type { Dictionary };

const loaders: Record<Locale, () => Promise<{ default?: Dictionary } | Dictionary>> = {
  en: async () => en,
  es: async () => (await import("./messages/es")).es,
  ar: async () => (await import("./messages/ar")).ar,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loaded = await loaders[locale]();
  return (loaded as { default?: Dictionary }).default ?? (loaded as Dictionary);
}

/** Replace {placeholders} in a string with values. */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}
