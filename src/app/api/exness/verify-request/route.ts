import { NextResponse } from "next/server";
import { z } from "zod";
import { isLocale } from "@/i18n/config";
import { getProduct } from "@/lib/products";
import { optionalEnv } from "@/lib/env";
import { sendMail } from "@/lib/email";
import { buildExnessResumeLink, checkExnessAccount } from "@/lib/exness";

export const runtime = "nodejs";

const schema = z.object({
  slug: z.string().trim().min(1).max(60),
  kind: z.enum(["bot", "indicator"]),
  name: z.string().trim().min(1).max(120),
  contactEmail: z.string().trim().email().max(190),
  exnessEmail: z.string().trim().email().max(190),
  path: z.enum(["switch", "new"]),
  locale: z.string().trim().max(5).optional(),
});

/**
 * The customer says they've either switched partner on an existing Exness
 * account, opened a new one, or just used the referral link. We can't
 * verify that automatically yet (see lib/exness.ts), so this notifies the
 * team with everything needed to check the partner dashboard by hand, plus
 * a ready-to-send resume link that unlocks the Exness price once confirmed.
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

  const { slug, kind, name, contactEmail, exnessEmail, path } = parsed.data;
  const locale =
    parsed.data.locale && isLocale(parsed.data.locale) ? parsed.data.locale : "es";

  const product = getProduct(slug);
  if (!product || product.kind !== kind) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const resumeLink = buildExnessResumeLink(locale, slug, kind, exnessEmail);
  const auto = await checkExnessAccount(exnessEmail);

  const notifyTo =
    optionalEnv("ORDER_NOTIFICATION_EMAIL") ?? optionalEnv("NEXT_PUBLIC_CONTACT_EMAIL");

  const pathLabel =
    path === "switch"
      ? "Cambio de partner en cuenta existente (revisar en 72hs)"
      : "Cuenta nueva (recién creada o a crear)";

  if (notifyTo) {
    await sendMail({
      to: notifyTo,
      subject: `Verificar cuenta de Exness — ${product.name}`,
      html: `
        <h2>Pedido de verificación de Exness</h2>
        <p><strong>Producto:</strong> ${escapeHtml(product.name)}</p>
        <p><strong>Cliente:</strong> ${escapeHtml(name)} — ${escapeHtml(contactEmail)}</p>
        <p><strong>Email de la cuenta de Exness:</strong> ${escapeHtml(exnessEmail)}</p>
        <p><strong>Camino elegido:</strong> ${escapeHtml(pathLabel)}</p>
        <p>Revisá tu panel de partner de Exness. Cuando confirmes que esa cuenta está
        bajo tu link, reenviale este link al cliente para que complete la compra al
        precio con Exness (no hace falta que vuelva a verificar nada):</p>
        <p><a href="${resumeLink}">${resumeLink}</a></p>
        ${auto.configured ? "" : "<p><em>La verificación automática por API todavía no está conectada.</em></p>"}
      `,
      text: `Producto: ${product.name}\nCliente: ${name} <${contactEmail}>\nEmail Exness: ${exnessEmail}\nCamino: ${pathLabel}\n\nLink para reenviar una vez verificado:\n${resumeLink}`,
    });
  } else {
    console.info(
      "[exness] ORDER_NOTIFICATION_EMAIL not set — verification request logged only",
      { slug, exnessEmail, path },
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
