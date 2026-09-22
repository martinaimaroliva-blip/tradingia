import "server-only";
import crypto from "node:crypto";
import { optionalEnv, siteUrl } from "@/lib/env";
import type { Locale } from "@/i18n/config";

/**
 * % of a SmartradeBot product sale (bot/indicator/signal) paid to the
 * partner who referred the buyer. Separate from — and on top of — the 20%
 * trading-commission share Exness pays partner agents directly; Exness has
 * no visibility into our own product sales, so we track and pay this part
 * ourselves.
 */
export const PRODUCT_REFERRAL_PERCENT = 10;

export interface PartnerRefPayload {
  email: string;
  name: string;
}

function secret(): string {
  // Reuses the same server-only secret as the Exness resume-link tokens
  // (lib/exness.ts) — both are just HMAC signing keys for our own
  // short-lived, stateless tokens, no need for a second env var.
  const value = optionalEnv("EXNESS_VERIFY_SECRET");
  if (!value) {
    console.warn(
      "[referrals] EXNESS_VERIFY_SECRET not set — using an insecure dev fallback. Set it before going live.",
    );
    return "smartradebot-exness-dev-secret";
  }
  return value;
}

/**
 * Packs a partner's identity into a self-contained, tamper-proof code —
 * there's no database, so whoever holds a code that verifies IS the
 * referring partner. Lets us attribute a sale to them (and know who to
 * pay) without persisting a partner table anywhere.
 */
export function signPartnerRef(payload: PartnerRefPayload): string {
  const json = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const sig = crypto
    .createHmac("sha256", secret())
    .update(json)
    .digest("hex")
    .slice(0, 24);
  return `${json}.${sig}`;
}

export function verifyPartnerRef(
  code: string | null | undefined,
): PartnerRefPayload | null {
  if (!code) return null;
  const dot = code.indexOf(".");
  if (dot === -1) return null;
  const json = code.slice(0, dot);
  const sig = code.slice(dot + 1);
  if (!json || !sig) return null;

  const expected = crypto
    .createHmac("sha256", secret())
    .update(json)
    .digest("hex")
    .slice(0, 24);
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(json, "base64url").toString("utf8"));
    if (typeof payload?.email !== "string" || typeof payload?.name !== "string") {
      return null;
    }
    return payload as PartnerRefPayload;
  } catch {
    return null;
  }
}

/** The link a partner shares — landing on the homepage with their code
 * attached, so `PartnerRefCapture` can pick it up on any first visit. */
export function buildPartnerLink(locale: Locale, code: string): string {
  return `${siteUrl()}/${locale}?partner=${encodeURIComponent(code)}`;
}
