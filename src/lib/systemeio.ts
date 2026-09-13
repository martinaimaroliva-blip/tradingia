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
  /** Overrides SYSTEMEIO_TAG_ID for this call — use a stage-specific tag. */
  tagId?: string;
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
  // Free-plan-friendly funnel segmentation: a custom field instead of a tag
  // (systeme.io's free tier caps the number of tags, but not custom fields).
  if (payload.source) fields.push({ slug: "funnel_stage", value: payload.source });

  try {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ email: payload.email, fields }),
    });

    let contactId: string | number | undefined;
    if (res.ok) {
      const data = (await res.json()) as { id?: string | number };
      contactId = data.id;
    } else if (res.status === 422) {
      // Contact already exists — look it up and PATCH the fields onto it so
      // a returning contact's funnel_stage still gets updated.
      contactId = await findContactIdByEmail(apiKey, payload.email);
      if (contactId && fields.length > 0) {
        const patchRes = await fetch(`${API_BASE}/contacts/${contactId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/merge-patch+json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify({ fields }),
        });
        if (!patchRes.ok) {
          console.error("[systeme.io] contact field update failed", patchRes.status);
        }
      }
    } else {
      const body = await res.text();
      console.error("[systeme.io] contact upsert failed", res.status, body);
      return { ok: false, configured: true, error: `HTTP ${res.status}` };
    }

    const tagId = payload.tagId ?? optionalEnv("SYSTEMEIO_TAG_ID");
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

async function findContactIdByEmail(
  apiKey: string,
  email: string,
): Promise<string | number | undefined> {
  try {
    const res = await fetch(
      `${API_BASE}/contacts?email=${encodeURIComponent(email)}`,
      { headers: { "X-API-Key": apiKey } },
    );
    if (!res.ok) return undefined;
    const data = (await res.json()) as { items?: { id?: string | number }[] };
    return data.items?.[0]?.id;
  } catch (err) {
    console.error("[systeme.io] contact lookup error", err);
    return undefined;
  }
}
