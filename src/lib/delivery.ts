import "server-only";
import { optionalEnv, siteUrl } from "@/lib/env";
import { sendMail } from "@/lib/email";
import type { BuyerInfo } from "@/lib/orders";

export interface FulfilmentInput {
  provider: "stripe" | "nowpayments" | "mercadopago";
  reference: string;
  kind?: string;
  slug?: string;
  productName?: string;
  /** "standard" | "exness" — which price tier they paid, bots/indicators only. */
  priceChoice?: string;
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
 * send the file by hand, and point the buyer to the short "account details"
 * form (on the success page, and again in this email in case they close the
 * tab) so we get the account number + server before we compile anything.
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

  const priceTierLabel =
    input.priceChoice === "exness"
      ? "Con link de Exness (verificar cuenta en el panel de afiliados antes de compilar)"
      : input.priceChoice === "standard"
        ? "Precio estándar"
        : "—";

  if (notifyTo) {
    const rows: [string, string][] = [
      ["Producto", input.productName ?? input.slug ?? "—"],
      ["Tipo", input.kind ?? "—"],
      ["Precio elegido", priceTierLabel],
      ["Monto", amountLabel],
      [
        "Método de pago",
        input.provider === "stripe"
          ? "Tarjeta (Stripe)"
          : input.provider === "mercadopago"
            ? "Mercado Pago"
            : "Cripto (NOWPayments)",
      ],
      ["Referencia", input.reference],
      ["Comprador", input.buyer?.name ?? "—"],
      ["Email", input.buyer?.email ?? "—"],
    ];
    await sendMail({
      to: notifyTo,
      subject: `Nueva venta: ${input.productName ?? input.slug ?? "producto"}`,
      html: `<h2>Nueva venta confirmada</h2><table cellpadding="6">${rows
        .map(
          ([k, v]) =>
            `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`,
        )
        .join("")}</table><p>Todavía no tenemos el número de cuenta ni el servidor — llegan por separado cuando el comprador complete el formulario post-pago (o por email si no lo hace).</p>`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    });
  } else {
    console.info(
      "[delivery] ORDER_NOTIFICATION_EMAIL / NEXT_PUBLIC_CONTACT_EMAIL not set — no internal notification sent",
    );
  }

  if (input.buyer?.email) {
    const isBot = input.kind === "bot";
    const locale = input.locale && ["es", "en", "ar"].includes(input.locale)
      ? input.locale
      : "es";
    const accountFormUrl = `${siteUrl()}/${locale}/checkout/success?kind=bot&email=${encodeURIComponent(
      input.buyer.email,
    )}`;

    const nextStepLine = isBot
      ? `<p>Para poder compilarlo necesitamos el número de cuenta y el servidor de tu MT4/MT5. Completalos acá: <a href="${accountFormUrl}">${accountFormUrl}</a></p>`
      : "";

    await sendMail({
      to: input.buyer.email,
      subject: `Recibimos tu pago — ${input.productName ?? "TradingIA"}`,
      html: `
        <p>¡Gracias, ${escapeHtml(input.buyer.name || "")}! Registramos tu pago de <strong>${escapeHtml(
          amountLabel,
        )}</strong> por <strong>${escapeHtml(input.productName ?? "tu compra")}</strong>.</p>
        ${nextStepLine}
        <p>Te vamos a enviar el archivo, la licencia y el manual a este mismo correo en las próximas horas. Cualquier duda, respondé este mensaje.</p>
      `,
      text: `¡Gracias! Registramos tu pago de ${amountLabel} por ${
        input.productName ?? "tu compra"
      }. ${isBot ? `Completá tus datos de cuenta acá: ${accountFormUrl}. ` : ""}Te enviamos el archivo, la licencia y el manual a este correo en las próximas horas.`,
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
