import { NextResponse } from "next/server";
import { z } from "zod";
import { optionalEnv } from "@/lib/env";
import { sendMail } from "@/lib/email";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().max(190),
  accountNumber: z.string().trim().min(1).max(40),
  server: z.string().trim().min(1).max(80),
  productName: z.string().trim().max(120).optional(),
});

/**
 * Buyer submits their MT4/MT5 account number + server after a bot purchase
 * so it can be compiled and activated. No database yet, so this just emails
 * the team — match it to the sale by email in Stripe/NOWPayments.
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

  const { email, accountNumber, server, productName } = parsed.data;
  const notifyTo =
    optionalEnv("ORDER_NOTIFICATION_EMAIL") ??
    optionalEnv("NEXT_PUBLIC_CONTACT_EMAIL");

  if (notifyTo) {
    await sendMail({
      to: notifyTo,
      subject: `Datos de cuenta recibidos — ${email}`,
      html: `
        <h2>Datos de cuenta para compilar el bot</h2>
        <p><strong>Email del comprador:</strong> ${escapeHtml(email)}</p>
        <p><strong>Producto:</strong> ${escapeHtml(productName ?? "—")}</p>
        <p><strong>Número de cuenta:</strong> ${escapeHtml(accountNumber)}</p>
        <p><strong>Servidor:</strong> ${escapeHtml(server)}</p>
        <p>Buscá el pago con ese email en Stripe/NOWPayments para confirmar el pedido.</p>
      `,
      text: `Email: ${email}\nProducto: ${productName ?? "—"}\nCuenta: ${accountNumber}\nServidor: ${server}`,
    });
  } else {
    console.info(
      "[account-details] ORDER_NOTIFICATION_EMAIL not set — logging only",
      { email, accountNumber, server },
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
