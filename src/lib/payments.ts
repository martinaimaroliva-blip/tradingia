import "server-only";
import Stripe from "stripe";
import { optionalEnv, siteUrl } from "@/lib/env";

/* -------------------------------------------------------------------------- */
/*  Stripe                                                                     */
/* -------------------------------------------------------------------------- */

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = optionalEnv("STRIPE_SECRET_KEY");
  if (!key) return null;
  if (!stripeClient) {
    // Use the API version pinned by the installed SDK.
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export interface CheckoutRequest {
  /** Product/plan name shown on the Stripe checkout page. */
  productName: string;
  /** Amount in whole USD (converted to cents internally). */
  unitAmountUSD: number;
  mode: "payment" | "subscription";
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
}

/**
 * Creates a Checkout Session with an ad-hoc price (Stripe's `price_data`)
 * instead of a pre-created Price ID. This lets the same product be sold at
 * two different amounts (standard vs. Exness-referral) without maintaining
 * a matching Stripe Price object for each — the amount always comes
 * straight from `src/lib/products.ts`.
 */
export async function createStripeCheckout(
  req: CheckoutRequest,
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "stripe_not_configured" };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: req.mode,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(req.unitAmountUSD * 100),
            product_data: { name: req.productName },
            ...(req.mode === "subscription"
              ? { recurring: { interval: "month" } }
              : {}),
          },
          quantity: req.quantity ?? 1,
        },
      ],
      success_url: req.successUrl,
      cancel_url: req.cancelUrl,
      metadata: req.metadata,
      allow_promotion_codes: req.mode === "payment",
      billing_address_collection: "auto",
      ...(req.customerEmail ? { customer_email: req.customerEmail } : {}),
    });
    return session.url
      ? { url: session.url }
      : { error: "stripe_no_session_url" };
  } catch (err) {
    console.error("[stripe] checkout error", err);
    return { error: "stripe_error" };
  }
}

/* -------------------------------------------------------------------------- */
/*  NOWPayments (crypto)                                                       */
/* -------------------------------------------------------------------------- */

const NOWPAYMENTS_BASE = "https://api.nowpayments.io/v1";

/**
 * The only coins we offer at checkout, mapped to NOWPayments' currency
 * tickers (BEP-20 / BSC network — cheap fees, and it pairs naturally with
 * BNB). Verify these against NOWPayments' `/v1/currencies` endpoint before
 * going live — exact ticker spelling can change on their side.
 */
export const CRYPTO_CURRENCIES = {
  USDT: "usdtbsc",
  USDC: "usdcbsc",
  BNB: "bnbbsc",
} as const;

export type CryptoCurrency = keyof typeof CRYPTO_CURRENCIES;

export interface CryptoInvoiceRequest {
  amountUSD: number;
  orderId: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  /** NOWPayments currency ticker, e.g. "usdtbsc" — steers the invoice to
   * that one coin/network instead of showing NOWPayments' full coin list. */
  payCurrency?: string;
}

export async function createCryptoInvoice(
  req: CryptoInvoiceRequest,
): Promise<{ url: string } | { error: string }> {
  const apiKey = optionalEnv("NOWPAYMENTS_API_KEY");
  if (!apiKey) return { error: "crypto_not_configured" };

  try {
    const res = await fetch(`${NOWPAYMENTS_BASE}/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        price_amount: req.amountUSD,
        price_currency: "usd",
        ...(req.payCurrency ? { pay_currency: req.payCurrency } : {}),
        order_id: req.orderId,
        order_description: req.description,
        ipn_callback_url: `${siteUrl()}/api/webhooks/nowpayments`,
        success_url: req.successUrl,
        cancel_url: req.cancelUrl,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[nowpayments] invoice failed", res.status, body);
      return { error: "crypto_error" };
    }

    const data = (await res.json()) as { invoice_url?: string };
    return data.invoice_url
      ? { url: data.invoice_url }
      : { error: "crypto_no_url" };
  } catch (err) {
    console.error("[nowpayments] request error", err);
    return { error: "crypto_error" };
  }
}
