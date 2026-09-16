import "server-only";
import type { Locale } from "@/i18n/config";
import * as xauusdImpulseSignal from "./xauusd-impulse-signal";
import * as xauusdImpulseScalperBot from "./xauusd-impulse-scalper-bot";

export interface DeliverableFile {
  fileName: string;
  code: string;
}

export interface Deliverable {
  files: DeliverableFile[];
  instructions(locale: Locale): string;
}

const registry: Record<string, Deliverable> = {
  "xauusd-impulse-signal": {
    files: [
      { fileName: xauusdImpulseSignal.FILE_NAME, code: xauusdImpulseSignal.CODE },
    ],
    instructions: (locale) => xauusdImpulseSignal.INSTALL_INSTRUCTIONS[locale],
  },
  "xauusd-impulse-scalper-bot": {
    // Bundled with the indicator: same signal logic, buyer gets both files
    // and both sets of instructions in the one delivery email.
    files: [
      {
        fileName: xauusdImpulseScalperBot.FILE_NAME_EA,
        code: xauusdImpulseScalperBot.CODE_EA,
      },
      {
        fileName: xauusdImpulseScalperBot.FILE_NAME_SET,
        code: xauusdImpulseScalperBot.CODE_SET,
      },
      { fileName: xauusdImpulseSignal.FILE_NAME, code: xauusdImpulseSignal.CODE },
    ],
    instructions: (locale) =>
      [
        xauusdImpulseScalperBot.INSTALL_INSTRUCTIONS[locale],
        "",
        xauusdImpulseScalperBot.BONUS_NOTE[locale],
        xauusdImpulseSignal.INSTALL_INSTRUCTIONS[locale],
      ].join("\n"),
  },
};

export function getDeliverable(slug?: string): Deliverable | undefined {
  return slug ? registry[slug] : undefined;
}
