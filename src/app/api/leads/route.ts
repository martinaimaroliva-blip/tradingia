import { NextResponse } from "next/server";
import { z } from "zod";
import { optionalEnv } from "@/lib/env";
import { upsertLead } from "@/lib/systemeio";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(190),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
  topic: z.string().trim().max(60).optional().default(""),
  locale: z.string().trim().max(5).optional().default(""),
  source: z.string().trim().max(40).optional().default("website"),
  path: z.string().trim().max(300).optional().default(""),
  // honeypot — real users never fill this
  company: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { company, ...lead } = parsed.data;
  if (company) {
    // Honeypot tripped — pretend success.
    return NextResponse.json({ ok: true });
  }

  const result = await upsertLead({
    email: lead.email,
    name: lead.name || undefined,
    phone: lead.phone || undefined,
    message: lead.message || undefined,
    topic: lead.topic || undefined,
    locale: lead.locale || undefined,
    source: lead.source,
    path: lead.path || undefined,
    // The one tag most free systeme.io plans allow is reserved for the
    // highest-value automation (checkout abandoned right before Exness
    // verification) — everything else still syncs via funnel_stage alone.
    tagId:
      lead.source === "checkout_no_exness"
        ? optionalEnv("SYSTEMEIO_TAG_ID")
        : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: "crm_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, configured: result.configured });
}
