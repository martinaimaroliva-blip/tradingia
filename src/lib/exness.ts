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
    return "smartradebot-exness-dev-secret";
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
  kind: "bot" | "indicator" | "signal",
  email: string,
): string {
  const base = siteUrl();
  const path =
    kind === "bot" ? "bots" : kind === "indicator" ? "indicators" : "signals";
  const token = signExnessToken(slug, email);
  const params = new URLSearchParams({ exnessEmail: email, exnessToken: token });
  return `${base}/${locale}/${path}/${slug}?${params.toString()}`;
}

const EXNESS_API_BASE = "https://my.exnessaffiliates.com";

export interface ExnessAffiliationResult {
  /** False when no credentials are set — caller should fall back to the
   * manual "email a human" flow. */
  configured: boolean;
  /** Whether this email is affiliated to our partner account, per Exness. */
  linked?: boolean;
  /** The client's Exness account number(s), when affiliated. */
  accounts?: string[];
  clientUid?: string;
  error?: string;
}

/**
 * Gets a JWT for the Exness Partner API.
 *
 * Exness JWTs expire, so the real credential is the partner login/password
 * (POST /api/auth/), not a fixed token — EXNESS_AFFILIATES_LOGIN/PASSWORD
 * re-authenticate on every call. EXNESS_API_KEY is kept as a fallback for a
 * manually pasted token, for quick testing without the partner password.
 */
async function getExnessToken(): Promise<string | null> {
  const login = optionalEnv("EXNESS_AFFILIATES_LOGIN");
  const password = optionalEnv("EXNESS_AFFILIATES_PASSWORD");
  if (login && password) {
    try {
      const res = await fetch(`${EXNESS_API_BASE}/api/auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      if (!res.ok) {
        console.error("[exness] auth failed", res.status, await res.text());
        return null;
      }
      const data = (await res.json()) as { token?: string };
      return data.token ?? null;
    } catch (err) {
      console.error("[exness] auth request error", err);
      return null;
    }
  }
  return optionalEnv("EXNESS_API_KEY") ?? null;
}

/**
 * Checks live, via the Exness Partner API, whether `email` is registered
 * under our partner link — POST /api/partner/affiliation/, documented at
 * https://my.exnessaffiliates.com/api/schema/#!/partner/partner_affiliation_create
 *
 * Auth is a JWT bearer token in the Authorization header (note: literally
 * "JWT <token>", not "Bearer <token>" — that's how Exness's API expects it).
 *
 * Reusable everywhere we need to know if a customer is a partner-linked
 * Exness client before unlocking a referral price — not tied to bots or
 * indicators specifically.
 */
export async function checkExnessAccount(
  email: string,
): Promise<ExnessAffiliationResult> {
  const token = await getExnessToken();
  if (!token) return { configured: false };

  try {
    const res = await fetch(`${EXNESS_API_BASE}/api/partner/affiliation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (res.status === 401) {
      console.error(
        "[exness] Partner API rejected our token (401) — check EXNESS_AFFILIATES_LOGIN/PASSWORD or EXNESS_API_KEY",
      );
      return { configured: true, error: "unauthorized" };
    }
    if (!res.ok) {
      const body = await res.text();
      console.error("[exness] affiliation check failed", res.status, body);
      return { configured: true, error: `http_${res.status}` };
    }

    const data = (await res.json()) as {
      affiliation: boolean;
      accounts: string[];
      client_uid: string;
    };
    return {
      configured: true,
      linked: data.affiliation,
      accounts: data.accounts,
      clientUid: data.client_uid,
    };
  } catch (err) {
    console.error("[exness] request error", err);
    return { configured: true, error: "request_failed" };
  }
}
