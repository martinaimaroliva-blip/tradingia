import { NextResponse } from "next/server";
import { z } from "zod";
import { optionalEnv } from "@/lib/env";
import { sendMail } from "@/lib/email";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().max(190),
  asset: z.string().trim().min(1).max(120),
  timeframe: z.string().trim().min(1).max(60),
  entryRules: z.string().trim().min(1).max(4000),
  exitRules: z.string().trim().min(1).max(4000),
  riskManagement: z.string().trim().min(1).max(4000),
  tools: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(2000).optional(),
});

/**
 * Buyer submits their trading-strategy details after paying the 50% deposit
 * on the custom bot, so the team has what it needs to scope the build and
 * go through it point by point on the follow-up call.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { email, asset, timeframe, entryRules, exitRules, riskManagement, tools, notes } =
    parsed.data;
  const notifyTo =
    optionalEnv("ORDER_NOTIFICATION_EMAIL") ??
    optionalEnv("NEXT_PUBLIC_CONTACT_EMAIL");

  if (notifyTo) {
    await sendMail({
      to: notifyTo,
      subject: `Detalles de estrategia recibidos — ${email}`,
      html: `
        <h2>Detalles de estrategia para el bot personalizado</h2>
        <p><strong>Email del comprador:</strong> ${escapeHtml(email)}</p>
        <p><strong>Instrumento:</strong> ${escapeHtml(asset)}</p>
        <p><strong>Timeframe:</strong> ${escapeHtml(timeframe)}</p>
        <p><strong>Reglas de entrada:</strong><br>${escapeHtml(entryRules).replace(/\n/g, "<br>")}</p>
        <p><strong>Reglas de salida:</strong><br>${escapeHtml(exitRules).replace(/\n/g, "<br>")}</p>
        <p><strong>Gestión de riesgo:</strong><br>${escapeHtml(riskManagement).replace(/\n/g, "<br>")}</p>
        <p><strong>Indicadores/herramientas:</strong> ${escapeHtml(tools || "—")}</p>
        <p><strong>Notas:</strong><br>${escapeHtml(notes || "—").replace(/\n/g, "<br>")}</p>
        <p>Buscá el pago con ese email en Stripe/NOWPayments/Mercado Pago para confirmar el pedido, y coordiná con el cliente la reunión de revisión.</p>
      `,
      text: `Email: ${email}\nInstrumento: ${asset}\nTimeframe: ${timeframe}\nEntrada: ${entryRules}\nSalida: ${exitRules}\nRiesgo: ${riskManagement}\nHerramientas: ${tools || "—"}\nNotas: ${notes || "—"}`,
    });
  } else {
    console.info(
      "[strategy-details] ORDER_NOTIFICATION_EMAIL not set — logging only",
      { email, asset, timeframe },
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] ?? c,
  );
}
