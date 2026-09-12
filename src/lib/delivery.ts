import "server-only";
import { optionalEnv } from "@/lib/env";
import { sendMail } from "@/lib/email";
import type { BuyerInfo } from "@/lib/orders";

export interface FulfilmentInput {
  provider: "stripe" | "nowpayments";
  reference: string;
  kind?: string;
  slug?: string;
  productName?: string;
  amount?: number;
  currency?: string;
  locale?: string;
  buyer?: BuyerInfo | null;
}

/**
 * Provision access after a confirmed payment.
 *
 * Today, compiling a bot to a buyer's MT4/MT5 account is a manual step, so
 * "fulfilment" means: notify the team with everything needed to build and
 * send the file by hand, and reassure the buyer it's on its way.
 *
 * TODO (once a license-key system exists): call the licensing API instead of
 * emailing a human, attach the actual file/manual, and skip the "we'll get
 * back to you" wording below.
 */
export async function fulfilPurchase(input: FulfilmentInput): Promise<void> {
  console.info("[delivery] fulfilment requested", {
    provider: input.provider,
    reference: input.reference,
    kind: input.kind,
    slug: input.slug,
    email: input.buyer?.email,
    amount: input.amount,
    currency: input.currency,
  });

  const notifyTo =
    optionalEnv("ORDER_NOTIFICATION_EMAIL") ??
    optionalEnv("NEXT_PUBLIC_CONTACT_EMAIL");

  const amountLabel =
    input.amount != null
      ? `${input.amount} ${(input.currency ?? "USD").toUpperCase()}`
      : "—";

  if (notifyTo) {
    const rows: [string, string][] = [
      ["Producto", input.productName ?? input.slug ?? "—"],
      ["Tipo", input.kind ?? "—"],
      ["Monto", amountLabel],
      ["Método de pago", input.provider === "stripe" ? "Tarjeta (Stripe)" : "Cripto (NOWPayments)"],
      ["Referencia", input.reference],
      ["Comprador", input.buyer?.name ?? "—"],
      ["Email", input.buyer?.email ?? "—"],
      ["Cuenta MT4/MT5", input.buyer?.accountNumber ?? "—"],
      ["Bróker", input.buyer?.broker ?? "—"],
    ];
    await sendMail({
      to: notifyTo,
      subject: `Nueva venta: ${input.productName ?? input.slug ?? "producto"}`,
      html: `<h2>Nueva venta confirmada</h2><table cellpadding="6">${rows
        .map(
          ([k, v]) =>
            `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`,
        )
        .join("")}</table>`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    });
  } else {
    console.info(
      "[delivery] ORDER_NOTIFICATION_EMAIL / NEXT_PUBLIC_CONTACT_EMAIL not set — no internal notification sent",
    );
  }

  if (input.buyer?.email) {
    const isBot = input.kind === "bot";
    const accountLine =
      isBot && input.buyer.accountNumber
        ? `<p>Lo estamos compilando para tu cuenta <strong>${escapeHtml(
            input.buyer.accountNumber,
          )}</strong>${
            input.buyer.broker ? ` en ${escapeHtml(input.buyer.broker)}` : ""
          }.</p>`
        : "";
    await sendMail({
      to: input.buyer.email,
      subject: `Recibimos tu pago — ${input.productName ?? "TradingIA"}`,
      html: `
        <p>¡Gracias, ${escapeHtml(input.buyer.name || "")}! Registramos tu pago de <strong>${escapeHtml(
          amountLabel,
        )}</strong> por <strong>${escapeHtml(input.productName ?? "tu compra")}</strong>.</p>
        ${accountLine}
        <p>Te vamos a enviar el archivo, la licencia y el manual a este mismo correo en las próximas horas. Cualquier duda, respondé este mensaje.</p>
      `,
      text: `¡Gracias! Registramos tu pago de ${amountLabel} por ${
        input.productName ?? "tu compra"
      }. Te enviamos el archivo, la licencia y el manual a este correo en las próximas horas.`,
    });
  }
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
