import { NextResponse } from "next/server";
import { z } from "zod";
import { isLocale } from "@/i18n/config";
import {
  checkExnessAccount,
  createReferralAgent,
  setReferralAgentCommission,
} from "@/lib/exness";
import {
  signPartnerRef,
  buildPartnerLink,
  PRODUCT_REFERRAL_PERCENT,
} from "@/lib/referrals";
import { sendMail } from "@/lib/email";
import { optionalEnv } from "@/lib/env";

export const runtime = "nodejs";

/** % of their referred clients' trading activity Exness pays the partner
 * directly — set on Exness's side, has nothing to do with PRODUCT_REFERRAL_PERCENT. */
const TRADING_COMMISSION_PERCENT = 20;

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(190),
  locale: z.string().trim().max(5).optional(),
});

/**
 * Self-service "become a partner" activation.
 *
 * Only turns someone into a paid referral partner once we can confirm,
 * live via the Exness Partner API, that they actually opened an Exness
 * account through our link — this is what stops someone from claiming
 * partner status (and a link of their own) without ever bringing in a
 * real client.
 *
 * No database: the partner's "record" is the signed code itself (see
 * lib/referrals.ts) and this activation email — if this call is repeated
 * for the same email, it creates another Exness referral-agent-link rather
 * than reusing one, since there's nothing on our side to look it up by.
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

  const { name, email } = parsed.data;
  const locale =
    parsed.data.locale && isLocale(parsed.data.locale) ? parsed.data.locale : "es";
  const notifyTo =
    optionalEnv("ORDER_NOTIFICATION_EMAIL") ?? optionalEnv("NEXT_PUBLIC_CONTACT_EMAIL");

  const affiliation = await checkExnessAccount(email);
  if (!affiliation.configured) {
    return NextResponse.json({ error: "exness_not_configured" }, { status: 501 });
  }
  if (!affiliation.linked) {
    return NextResponse.json({ error: "not_affiliated" }, { status: 403 });
  }

  const created = await createReferralAgent(email, `${name} (${email.split("@")[0]})`);
  if (!created.success || !created.agentLinkId) {
    console.error(
      "[referrals] failed to create Exness referral agent",
      created.error,
      created.raw,
    );
    if (notifyTo) {
      await sendMail({
        to: notifyTo,
        subject: `Activación de partner falló — ${email}`,
        html: `<p>No se pudo crear el agente referido en Exness para <strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}).</p><p>Error: ${escapeHtml(created.error ?? "unknown")}</p><p>Hay que darlo de alta a mano en my.exnessaffiliates.com.</p>`,
        text: `No se pudo crear el agente referido en Exness para ${name} (${email}). Error: ${created.error ?? "unknown"}. Hay que darlo de alta a mano.`,
      });
    }
    return NextResponse.json({ error: "agent_creation_failed" }, { status: 502 });
  }

  const commission = await setReferralAgentCommission(
    created.agentLinkId,
    TRADING_COMMISSION_PERCENT,
  );
  if (!commission.success) {
    console.error("[referrals] failed to set commission", commission.error);
  }

  const code = signPartnerRef({ email, name });
  const link = buildPartnerLink(locale, code);

  if (notifyTo) {
    await sendMail({
      to: notifyTo,
      subject: `Nuevo partner activado — ${name}`,
      html: `
        <h2>Nuevo agente referido en Exness</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Exness agent link id:</strong> ${escapeHtml(created.agentLinkId)}</p>
        <p><strong>Comisión de trading:</strong> ${
          commission.success
            ? `${TRADING_COMMISSION_PERCENT}% fijado en Exness`
            : `NO se pudo fijar (${escapeHtml(commission.error ?? "error")}) — hacelo a mano en my.exnessaffiliates.com`
        }</p>
        <p><strong>Link de SmartradeBot del partner:</strong> <a href="${link}">${link}</a> (${PRODUCT_REFERRAL_PERCENT}% de cada venta de producto)</p>
        <p><strong>Respuesta cruda de Exness</strong> (revisar si trae el link propio del agente, para pasárselo también):</p>
        <pre>${escapeHtml(JSON.stringify(created.raw, null, 2))}</pre>
      `,
      text: `Nuevo partner: ${name} <${email}>. Agent link id: ${created.agentLinkId}. Comisión de trading: ${commission.success ? TRADING_COMMISSION_PERCENT + "%" : "error: " + commission.error}. Link: ${link}. Raw: ${JSON.stringify(created.raw)}`,
    });
  }

  await sendMail({
    to: email,
    subject: "Tu cuenta de partner de SmartradeBot está activa",
    html: `
      <p>¡Listo, ${escapeHtml(name)}! Ya sos partner de SmartradeBot.</p>
      <p>Este es tu link para compartir — cada persona que abra una cuenta de Exness con él queda asociada a vos, y por cada compra de bot, indicador o señal que hagan te llevás un <strong>${PRODUCT_REFERRAL_PERCENT}%</strong>, además del <strong>${TRADING_COMMISSION_PERCENT}%</strong> que te paga Exness directamente por su actividad de trading.</p>
      <p><a href="${link}">${link}</a></p>
      <p>Cualquier duda, respondé este mensaje.</p>
    `,
    text: `¡Listo, ${name}! Ya sos partner de SmartradeBot. Tu link: ${link}. Ganás ${PRODUCT_REFERRAL_PERCENT}% de cada venta de producto que generes, más el ${TRADING_COMMISSION_PERCENT}% que te paga Exness por la actividad de trading de tus referidos.`,
  });

  return NextResponse.json({ ok: true, link });
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
