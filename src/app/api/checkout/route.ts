import { NextResponse } from "next/server";
import { z } from "zod";
import { isLocale } from "@/i18n/config";
import { getProduct, getSignalPlan } from "@/lib/products";
import { siteUrl } from "@/lib/env";
import {
  createStripeCheckout,
  createCryptoInvoice,
  CRYPTO_CURRENCIES,
} from "@/lib/payments";
import { encodeOrderDescription, type BuyerInfo } from "@/lib/orders";

export const runtime = "nodejs";

const schema = z.object({
  slug: z.string().trim().min(1).max(60),
  kind: z.enum(["bot", "indicator", "signal"]),
  method: z.enum(["card", "crypto"]),
  locale: z.string().trim().max(5).optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(190),
  // Bots & indicators only — ignored for signals (flat monthly price).
  priceChoice: z.enum(["standard", "exness"]).default("standard"),
  cryptoCurrency: z.enum(["USDT", "USDC", "BNB"]).optional(),
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

  const { slug, kind, method, name, email, priceChoice, cryptoCurrency } =
    parsed.data;
  const locale =
    parsed.data.locale && isLocale(parsed.data.locale)
      ? parsed.data.locale
      : "es";

  // Resolve the item + amount for the chosen price tier.
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
    amountUSD = priceChoice === "exness" ? product.exnessPriceUSD : product.priceUSD;
    productName = `TradingIA — ${product.name}`;
  }

  const buyer: BuyerInfo = { name, email };

  const base = siteUrl();
  // The success page shows the post-payment "account details" form for bots.
  const successKindParam = kind === "bot" ? `&kind=bot` : "";
  // Stripe replaces the {CHECKOUT_SESSION_ID} template server-side.
  const stripeSuccessUrl = `${base}/${locale}/checkout/success?ref={CHECKOUT_SESSION_ID}${successKindParam}`;
  const successUrl = `${base}/${locale}/checkout/success?${new URLSearchParams(
    kind === "bot" ? { kind: "bot", email } : { email },
  ).toString()}`;
  const cancelUrl = `${base}/${locale}/checkout/cancel`;

  if (method === "card") {
    const result = await createStripeCheckout({
      productName,
      unitAmountUSD: amountUSD,
      mode: isSubscription ? "subscription" : "payment",
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

  // Crypto — NOWPayments' IPN doesn't carry buyer details on its own, so we
  // pack them into the order description and unpack them in the webhook.
  const result = await createCryptoInvoice({
    amountUSD,
    orderId: `${kind}_${slug}_${Date.now()}`,
    description: encodeOrderDescription(productName, buyer),
    successUrl,
    cancelUrl,
    payCurrency: cryptoCurrency ? CRYPTO_CURRENCIES[cryptoCurrency] : undefined,
  });
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "crypto_not_configured" ? 501 : 502 },
    );
  }
  return NextResponse.json({ url: result.url });
}
