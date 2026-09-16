import "server-only";
import { optionalEnv, siteUrl } from "@/lib/env";
import { sendMail } from "@/lib/email";
import { upsertLead } from "@/lib/systemeio";
import { getDeliverable } from "@/lib/deliverables";
import { createChannelInviteLinks } from "@/lib/telegram";
import { getProduct } from "@/lib/products";
import type { BuyerInfo } from "@/lib/orders";
import type { Locale } from "@/i18n/config";

const SIGNALS_DELIVERY_INTRO: Record<Locale, string> = {
  es: "Acá tenés tu acceso (link de un solo uso por canal):",
  en: "Here's your access (one-time link per channel):",
  ar: "هذا وصولك (رابط لمرة واحدة لكل قناة):",
};

// Non-signal products (e.g. a bot) can also grant a Telegram channel — a
// support/follow-up community rather than the product itself, so it's worded
// differently and shown *alongside* the normal delivery content, not instead
// of it.
const FOLLOWUP_GROUP_INTRO: Record<Locale, string> = {
  es: "Además, este es tu acceso al grupo de seguimiento (link de un solo uso):",
  en: "You're also getting access to the follow-up group (one-time link):",
  ar: "كما ستحصل على وصول إلى مجموعة المتابعة (رابط لمرة واحدة):",
};

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
    await upsertLead({
      email: input.buyer.email,
      name: input.buyer.name,
      locale: input.locale,
      source: "purchased",
      path: [input.kind, input.slug].filter(Boolean).join("/") || undefined,
      tagId: optionalEnv("SYSTEMEIO_TAG_ID_PURCHASED"),
    });

    const isBot = input.kind === "bot";
    const locale = (
      input.locale && ["es", "en", "ar"].includes(input.locale)
        ? input.locale
        : "es"
    ) as Locale;
    const accountFormUrl = `${siteUrl()}/${locale}/checkout/success?kind=bot&email=${encodeURIComponent(
      input.buyer.email,
    )}`;

    const product = input.slug ? getProduct(input.slug) : undefined;
    const deliverable = getDeliverable(input.slug);
    // Self-installed bots (deliverable set) run on the buyer's own account —
    // only bots we still compile by hand need their account number.
    const nextStepLine = isBot && !deliverable
      ? `<p>Para poder compilarlo necesitamos el número de cuenta y el servidor de tu MT4/MT5. Completalos acá: <a href="${accountFormUrl}">${accountFormUrl}</a></p>`
      : "";

    const isSignal = input.kind === "signal";
    const channelLinks = input.slug ? await createChannelInviteLinks(input.slug) : [];

    // Signals have no file of their own — the channel link(s) ARE the whole
    // delivery. Everything else keeps its normal delivery content, and a
    // channel (if any, e.g. SIZA's owners group) is shown as an addition.
    let deliveryLine: string;
    let deliveryLineText: string;
    if (isSignal) {
      if (channelLinks.length > 0) {
        deliveryLine = `<p>${SIGNALS_DELIVERY_INTRO[locale]}</p><ul>${channelLinks
          .map((link) => `<li><a href="${link}">${link}</a></li>`)
          .join("")}</ul>`;
        deliveryLineText = `${SIGNALS_DELIVERY_INTRO[locale]}\n${channelLinks.join("\n")}`;
      } else {
        deliveryLine =
          "<p>Te vamos a enviar el link de acceso al canal de Telegram a este mismo correo en las próximas horas.</p>";
        deliveryLineText =
          "Te enviamos el link de acceso al canal de Telegram a este correo en las próximas horas.";
      }
    } else if (deliverable) {
      const fileNames = deliverable.files.map((f) => f.fileName).join(", ");
      deliveryLine = `<p>Adjunto encontrás el archivo (<code>${escapeHtml(
        fileNames,
      )}</code>). Para instalarlo:</p><ol>${deliverable
        .instructions(locale)
        .split("\n")
        .map((step) => `<li>${escapeHtml(step)}</li>`)
        .join("")}</ol>`;
      deliveryLineText = `Adjunto: ${fileNames}. Para instalarlo:\n${deliverable.instructions(locale)}`;
    } else {
      deliveryLine =
        "<p>Te vamos a enviar el archivo, la licencia y el manual a este mismo correo en las próximas horas.</p>";
      deliveryLineText =
        "Te enviamos el archivo, la licencia y el manual a este correo en las próximas horas.";
    }

    // Additive extras: a follow-up Telegram group for a non-signal product
    // (e.g. SIZA's owners channel), and/or a note pointing to the booking
    // link (e.g. "book your install call with an Expert").
    let extraLine = "";
    let extraLineText = "";
    if (!isSignal && channelLinks.length > 0) {
      extraLine += `<p>${FOLLOWUP_GROUP_INTRO[locale]}</p><ul>${channelLinks
        .map((link) => `<li><a href="${link}">${link}</a></li>`)
        .join("")}</ul>`;
      extraLineText += `${FOLLOWUP_GROUP_INTRO[locale]}\n${channelLinks.join("\n")}\n`;
    }
    const postPurchaseNote = product?.postPurchaseNote?.[locale];
    if (postPurchaseNote) {
      const meetUrl = optionalEnv("NEXT_PUBLIC_MEET_URL");
      extraLine += `<p>${escapeHtml(postPurchaseNote)}${
        meetUrl ? ` <a href="${meetUrl}">${meetUrl}</a>` : ""
      }</p>`;
      extraLineText += `${postPurchaseNote}${meetUrl ? ` ${meetUrl}` : ""}\n`;
    }

    await sendMail({
      to: input.buyer.email,
      subject: `Recibimos tu pago — ${input.productName ?? "SmartradeBot"}`,
      html: `
        <p>¡Gracias, ${escapeHtml(input.buyer.name || "")}! Registramos tu pago de <strong>${escapeHtml(
          amountLabel,
        )}</strong> por <strong>${escapeHtml(input.productName ?? "tu compra")}</strong>.</p>
        ${nextStepLine}
        ${deliveryLine}
        ${extraLine}
        <p>Cualquier duda, respondé este mensaje.</p>
      `,
      text: `¡Gracias! Registramos tu pago de ${amountLabel} por ${
        input.productName ?? "tu compra"
      }. ${isBot && !deliverable ? `Completá tus datos de cuenta acá: ${accountFormUrl}. ` : ""}${deliveryLineText}\n${extraLineText}`,
      attachments: deliverable?.files.map((f) => ({
        filename: f.fileName,
        content: f.code,
      })),
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
