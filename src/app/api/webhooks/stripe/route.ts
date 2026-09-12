import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments";
import { optionalEnv } from "@/lib/env";
import { fulfilPurchase } from "@/lib/delivery";
import type { BuyerInfo } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = optionalEnv("STRIPE_WEBHOOK_SECRET");
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "stripe_webhook_not_configured" },
      { status: 501 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[stripe] signature verification failed", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email =
          session.customer_details?.email ?? session.customer_email ?? undefined;
        const buyer: BuyerInfo | null = email
          ? { name: session.metadata?.buyerName ?? "", email }
          : null;
        await fulfilPurchase({
          provider: "stripe",
          reference: session.id,
          kind: session.metadata?.kind,
          slug: session.metadata?.slug,
          productName: session.metadata?.productName,
          priceChoice: session.metadata?.priceChoice,
          locale: session.metadata?.locale,
          amount: session.amount_total ? session.amount_total / 100 : undefined,
          currency: session.currency ?? undefined,
          buyer,
        });
        break;
      }
      case "invoice.paid": {
        // Recurring signals renewal — keep Telegram access active.
        const invoice = event.data.object as Stripe.Invoice;
        const email = invoice.customer_email ?? undefined;
        await fulfilPurchase({
          provider: "stripe",
          reference: invoice.id ?? "invoice",
          kind: "signal",
          amount: invoice.amount_paid ? invoice.amount_paid / 100 : undefined,
          currency: invoice.currency ?? undefined,
          buyer: email ? { name: "", email } : null,
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe] handler error", err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
