import { NextResponse } from "next/server";
import { z } from "zod";
import { isLocale } from "@/i18n/config";
import { getProduct } from "@/lib/products";
import { siteUrl } from "@/lib/env";
import {
  createStripeCheckout,
  createCryptoInvoice,
  createMercadoPagoPreference,
  USDT_NETWORKS,
} from "@/lib/payments";
import { encodeOrderDescription, type BuyerInfo } from "@/lib/orders";
import { verifyExnessToken } from "@/lib/exness";

export const runtime = "nodejs";

const schema = z.object({
  slug: z.string().trim().min(1).max(60),
  kind: z.enum(["bot", "indicator", "signal"]),
  method: z.enum(["card", "crypto", "mercadopago"]),
  locale: z.string().trim().max(5).optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(190),
  // Bots & indicators only — ignored for signals (flat monthly price).
  priceChoice: z.enum(["standard", "exness"]).default("standard"),
  cryptoNetwork: z.enum(["TRC20", "BEP20"]).optional(),
  // Required when priceChoice is "exness" — proves the Exness account was
  // verified (see lib/exness.ts + /api/exness/verify-request).
  exnessEmail: z.string().trim().email().max(190).optional(),
  exnessToken: z.string().trim().max(64).optional(),
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
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const {
    slug,
    kind,
    method,
    name,
    email,
    priceChoice,
    cryptoNetwork,
    exnessEmail,
    exnessToken,
  } = parsed.data;
  const locale =
    parsed.data.locale && isLocale(parsed.data.locale)
      ? parsed.data.locale
      : "es";

  // Resolve the item + amount for the chosen price tier. Every product kind
  // (bots, indicators, signals) is a one-time payment — signals used to be
  // a monthly subscription, but that model was replaced by one-time,
  // per-asset Telegram channel access.
  let amountUSD: number;

  const product = getProduct(slug);
  if (!product || product.kind !== kind) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (product.requiresConsultation) {
    // Custom-build products go through /contact, never instant checkout.
    return NextResponse.json({ error: "requires_consultation" }, { status: 400 });
  }
  if (product.requiresExnessVerification) {
    // No standalone price at all — this promo only exists for verified
    // Exness referrals, regardless of what priceChoice the client sent.
    if (!exnessEmail || !verifyExnessToken(slug, exnessEmail, exnessToken)) {
      return NextResponse.json({ error: "exness_not_verified" }, { status: 403 });
    }
    amountUSD = product.exnessPriceUSD;
  } else {
    const hasDiscount = product.exnessPriceUSD < product.priceUSD;
    if (priceChoice === "exness" && hasDiscount) {
      if (!exnessEmail || !verifyExnessToken(slug, exnessEmail, exnessToken)) {
        return NextResponse.json({ error: "exness_not_verified" }, { status: 403 });
      }
    }
    amountUSD =
      priceChoice === "exness" && hasDiscount
        ? product.exnessPriceUSD
        : product.priceUSD;
  }
  // Made-to-order products (custom bot) only charge a deposit up front —
  // the rest is collected manually once the finished bot is delivered.
  if (product.depositPercent) {
    amountUSD = Math.round((amountUSD * product.depositPercent) / 100);
  }
  const productName = `SmartradeBot — ${product.name}`;

  const buyer: BuyerInfo = { name, email };

  const base = siteUrl();
  // The success page shows a post-payment form: the MT4/5 account-number
  // form for regular bots, or the strategy questionnaire for the custom bot.
  const successKind = product.depositPercent
    ? "custom-bot"
    : kind === "bot"
      ? "bot"
      : null;
  const successKindParam = successKind ? `&kind=${successKind}` : "";
  // Stripe replaces the {CHECKOUT_SESSION_ID} template server-side.
  const stripeSuccessUrl = `${base}/${locale}/checkout/success?ref={CHECKOUT_SESSION_ID}${successKindParam}`;
  const successUrl = `${base}/${locale}/checkout/success?${new URLSearchParams(
    successKind ? { kind: successKind, email } : { email },
  ).toString()}`;
  const cancelUrl = `${base}/${locale}/checkout/cancel`;

  if (method === "card") {
    const result = await createStripeCheckout({
      productName,
      unitAmountUSD: amountUSD,
      mode: "payment",
      successUrl: stripeSuccessUrl,
      cancelUrl,
      customerEmail: email,
      metadata: { slug, kind, locale, productName, buyerName: name, priceChoice },
    });
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "stripe_not_configured" ? 501 : 502 },
      );
    }
    return NextResponse.json({ url: result.url });
  }

  if (method === "mercadopago") {
    const result = await createMercadoPagoPreference({
      productName,
      unitAmountUSD: amountUSD,
      // MP's IPN only carries the external_reference + payment id, so we
      // pack buyer/product details into it the same way as the crypto flow.
      externalReference: encodeOrderDescription(
        `${kind}_${slug}_${Date.now()}`,
        { ...buyer, productName },
      ),
      successUrl,
      cancelUrl,
      payerEmail: email,
    });
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "mercadopago_not_configured" ? 501 : 502 },
      );
    }
    return NextResponse.json({ url: result.url });
  }

  // Crypto — NOWPayments' IPN doesn't carry buyer details on its own, so we
  // pack them into the order description and unpack them in the webhook.
  const result = await createCryptoInvoice({
    amountUSD,
    orderId: `${kind}_${slug}_${Date.now()}`,
    description: encodeOrderDescription(productName, buyer),
    successUrl,
    cancelUrl,
    payCurrency: cryptoNetwork ? USDT_NETWORKS[cryptoNetwork] : undefined,
  });
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "crypto_not_configured" ? 501 : 502 },
    );
  }
  return NextResponse.json({ url: result.url });
}
