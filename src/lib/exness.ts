import "server-only";
import crypto from "node:crypto";
import { optionalEnv, siteUrl } from "@/lib/env";
import type { Locale } from "@/i18n/config";

function secret(): string {
  const value = optionalEnv("EXNESS_VERIFY_SECRET");
  if (!value) {
    console.warn(
      "[exness] EXNESS_VERIFY_SECRET not set — using an insecure dev fallback. Set it before going live.",
    );
    return "tradingia-exness-dev-secret";
  }
  return value;
}

function normalize(slug: string, email: string): string {
  return `${slug}|${email.trim().toLowerCase()}`;
}

/** Signs a (slug, email) pair so a resume link can't be forged by hand. */
export function signExnessToken(slug: string, email: string): string {
  return crypto
    .createHmac("sha256", secret())
    .update(normalize(slug, email))
    .digest("hex")
    .slice(0, 32);
}

export function verifyExnessToken(
  slug: string,
  email: string,
  token: string | null | undefined,
): boolean {
  if (!token) return false;
  const expected = signExnessToken(slug, email);
  // Constant-time-ish compare (both are fixed-length hex strings here).
  return (
    expected.length === token.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token))
  );
}

/**
 * Link to send the customer once their Exness account is confirmed as
 * under our partner link — lands back on the product page with the Exness
 * price already unlocked.
 */
export function buildExnessResumeLink(
  locale: Locale,
  slug: string,
  kind: "bot" | "indicator",
  email: string,
): string {
  const base = siteUrl();
  const path = kind === "bot" ? "bots" : "indicators";
  const token = signExnessToken(slug, email);
  const params = new URLSearchParams({ exnessEmail: email, exnessToken: token });
  return `${base}/${locale}/${path}/${slug}?${params.toString()}`;
}

/**
 * TODO: once Exness partner API access is available, check here whether
 * `email` is actually registered under our partner link and return a real
 * verdict instead of `configured: false`. Until then, verification is done
 * by a human reading the notification email and replying with the signed
 * resume link (see buildExnessResumeLink).
 */
export async function checkExnessAccount(
  _email: string,
): Promise<{ configured: boolean; linked?: boolean }> {
  const apiKey = optionalEnv("EXNESS_API_KEY");
  if (!apiKey) return { configured: false };
  // Placeholder — wire the real endpoint here once we have API docs/access.
  return { configured: false };
}
