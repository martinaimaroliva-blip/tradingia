import "server-only";
import { optionalEnv } from "@/lib/env";

const API_BASE = "https://api.systeme.io/api";

export interface LeadPayload {
  email: string;
  name?: string;
  phone?: string;
  locale?: string;
  source?: string;
  topic?: string;
  message?: string;
  path?: string;
}

export interface CrmResult {
  ok: boolean;
  configured: boolean;
  contactId?: string | number;
  error?: string;
}

/**
 * Create or update a contact in systeme.io and (optionally) attach a tag that
 * triggers an email automation.
 *
 * If SYSTEMEIO_API_KEY is not set the call is a no-op that still resolves ok,
 * so the front-end UX works before the integration is wired up in production.
 */
export async function upsertLead(payload: LeadPayload): Promise<CrmResult> {
  const apiKey = optionalEnv("SYSTEMEIO_API_KEY");
  if (!apiKey) {
    console.info("[systeme.io] SYSTEMEIO_API_KEY not set — lead not forwarded", {
      email: payload.email,
      source: payload.source,
    });
    return { ok: true, configured: false };
  }

  const [firstName, ...rest] = (payload.name ?? "").trim().split(/\s+/);
  const lastName = rest.join(" ");

  const fields: { slug: string; value: string }[] = [];
  if (firstName) fields.push({ slug: "first_name", value: firstName });
  if (lastName) fields.push({ slug: "surname", value: lastName });
  if (payload.phone) fields.push({ slug: "phone_number", value: payload.phone });

  try {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ email: payload.email, fields }),
    });

    // 422 usually means the contact already exists — treat as success.
    if (!res.ok && res.status !== 422) {
      const body = await res.text();
      console.error("[systeme.io] contact upsert failed", res.status, body);
      return { ok: false, configured: true, error: `HTTP ${res.status}` };
    }

    let contactId: string | number | undefined;
    if (res.ok) {
      const data = (await res.json()) as { id?: string | number };
      contactId = data.id;
    }

    const tagId = optionalEnv("SYSTEMEIO_TAG_ID");
    if (tagId && contactId) {
      const tagRes = await fetch(`${API_BASE}/contacts/${contactId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ tagId: Number(tagId) }),
      });
      if (!tagRes.ok) {
        console.error("[systeme.io] tag attach failed", tagRes.status);
      }
    }

    return { ok: true, configured: true, contactId };
  } catch (err) {
    console.error("[systeme.io] request error", err);
    return { ok: false, configured: true, error: "request_failed" };
  }
}
