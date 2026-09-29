import "server-only";
import type { Locale } from "@/i18n/config";
import * as xauusdImpulseSignal from "./xauusd-impulse-signal";
import * as xauusdImpulseScalperBot from "./xauusd-impulse-scalper-bot";
import * as btcPulse from "./btc-pulse";
import * as magnum from "./magnum";
import * as sniperEa from "./sniper-ea";

export interface DeliverableFile {
  fileName: string;
  code: string;
  /** "base64" for a compiled binary (.ex5) attached as-is; omitted (plain
   * utf-8 text) for source files like .mq5/.set. */
  encoding?: "base64";
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
  "btc-pulse": {
    files: [
      { fileName: btcPulse.FILE_NAME, code: btcPulse.CODE_BASE64, encoding: "base64" },
    ],
    instructions: (locale) => btcPulse.INSTALL_INSTRUCTIONS[locale],
  },
  magnum: {
    files: [
      { fileName: magnum.FILE_NAME, code: magnum.CODE_BASE64, encoding: "base64" },
    ],
    instructions: (locale) => magnum.INSTALL_INSTRUCTIONS[locale],
  },
  "sniper-ea": {
    files: [
      { fileName: sniperEa.FILE_NAME, code: sniperEa.CODE_BASE64, encoding: "base64" },
    ],
    instructions: (locale) => sniperEa.INSTALL_INSTRUCTIONS[locale],
  },
};

export function getDeliverable(slug?: string): Deliverable | undefined {
  return slug ? registry[slug] : undefined;
}
