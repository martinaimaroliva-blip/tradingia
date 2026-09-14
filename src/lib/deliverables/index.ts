import "server-only";
import type { Locale } from "@/i18n/config";
import * as xauusdImpulseSignal from "./xauusd-impulse-signal";

export interface Deliverable {
  fileName: string;
  code: string;
  instructions(locale: Locale): string;
}

const registry: Record<string, Deliverable> = {
  "xauusd-impulse-signal": {
    fileName: xauusdImpulseSignal.FILE_NAME,
    code: xauusdImpulseSignal.CODE,
    instructions: (locale) => xauusdImpulseSignal.INSTALL_INSTRUCTIONS[locale],
  },
};

export function getDeliverable(slug?: string): Deliverable | undefined {
  return slug ? registry[slug] : undefined;
}
