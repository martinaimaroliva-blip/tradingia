import { NextResponse } from "next/server";
import { z } from "zod";
import { isLocale } from "@/i18n/config";
import { getProduct, getSignalPlan, stripePriceEnvKey } from "@/lib/products";
import { optionalEnv, siteUrl } from "@/lib/env";
import { createStripeCheckout, createCryptoInvoice } from "@/lib/payments";
import { encodeOrderDescription, type BuyerInfo } from "@/lib/orders";

export const runtime = "nodejs";

const schema = z.object({
  slug: z.string().trim().min(1).max(60),
  kind: z.enum(["bot", "indicator", "signal"]),
  method: z.enum(["card", "crypto"]),
  locale: z.string().trim().max(5).optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(190),
  accountNumber: z.string().trim().max(40).optional(),
  broker: z.string().trim().max(60).optional(),
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

  const { slug, kind, method, name, email, accountNumber, broker } =
    parsed.data;
  const locale =
    parsed.data.locale && isLocale(parsed.data.locale)
      ? parsed.data.locale
      : "es";

  // Resolve the item + amount.
  let amountUSD: number;
  let productName: string;
  const isSubscription = kind === "signal";

  if (kind === "signal") {
    const plan = getSignalPlan(slug);
    if (!plan) return NextResponse.json({ error: "not_found" }, { status: 404 });
    amountUSD = plan.priceUSD;
    productName = `TradingIA Signals — ${plan.name.en}`;
  } else {
    const product = getProduct(slug);
    if (!product || product.kind !== kind) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (product.requiresConsultation) {
      // Custom-build products go through /contact, never instant checkout.
      return NextResponse.json({ error: "requires_consultation" }, { status: 400 });
    }
    amountUSD = product.priceUSD;
    productName = `TradingIA — ${product.name}`;
  }

  // Bots are compiled by hand for a specific MT4/MT5 account, so we can't
  // fulfil the order without knowing which account to build it for.
  if (kind === "bot" && (!accountNumber || !broker)) {
    return NextResponse.json(
      { error: "account_details_required" },
      { status: 400 },
    );
  }

  const buyer: BuyerInfo = { name, email, accountNumber, broker };

  const base = siteUrl();
  // Stripe replaces the {CHECKOUT_SESSION_ID} template server-side.
  const stripeSuccessUrl = `${base}/${locale}/checkout/success?ref={CHECKOUT_SESSION_ID}`;
  const successUrl = `${base}/${locale}/checkout/success`;
  const cancelUrl = `${base}/${locale}/checkout/cancel`;

  if (method === "card") {
    const priceId = optionalEnv(stripePriceEnvKey(slug));
    if (!priceId) {
      return NextResponse.json(
        {
          error: "price_not_configured",
          message: `Set ${stripePriceEnvKey(slug)} to the Stripe Price ID for "${slug}".`,
        },
        { status: 501 },
      );
    }
    const result = await createStripeCheckout({
      priceId,
      mode: isSubscription ? "subscription" : "payment",
      successUrl: stripeSuccessUrl,
      cancelUrl,
      customerEmail: email,
      metadata: {
        slug,
        kind,
        locale,
        productName,
        buyerName: name,
        ...(accountNumber ? { accountNumber } : {}),
        ...(broker ? { broker } : {}),
      },
    });
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "stripe_not_configured" ? 501 : 502 },
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
  });
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "crypto_not_configured" ? 501 : 502 },
    );
  }
  return NextResponse.json({ url: result.url });
}
