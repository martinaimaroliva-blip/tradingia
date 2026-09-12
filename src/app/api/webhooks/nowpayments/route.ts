import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { optionalEnv } from "@/lib/env";
import { fulfilPurchase } from "@/lib/delivery";
import { decodeOrderDescription, type BuyerInfo } from "@/lib/orders";

export const runtime = "nodejs";

/** NOWPayments signs the IPN with HMAC-SHA512 over the JSON body sorted by key. */
function sortObject(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObject((obj as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return obj;
}

export async function POST(request: Request) {
  const ipnSecret = optionalEnv("NOWPAYMENTS_IPN_SECRET");
  if (!ipnSecret) {
    return NextResponse.json(
      { error: "ipn_not_configured" },
      { status: 501 },
    );
  }

  const raw = await request.text();
  const signature = request.headers.get("x-nowpayments-sig");

  const expected = crypto
    .createHmac("sha512", ipnSecret)
    .update(JSON.stringify(sortObject(JSON.parse(raw))))
    .digest("hex");

  if (!signature || signature !== expected) {
    console.error("[nowpayments] invalid IPN signature");
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const body = JSON.parse(raw) as {
    payment_status?: string;
    payment_id?: string | number;
    order_id?: string;
    order_description?: string;
    price_amount?: number;
    price_currency?: string;
  };

  if (body.payment_status === "finished" || body.payment_status === "confirmed") {
    const [kind, slug] = (body.order_id ?? "").split("_");
    const { label, data: buyer } = decodeOrderDescription<BuyerInfo>(
      body.order_description,
    );
    await fulfilPurchase({
      provider: "nowpayments",
      reference: String(body.payment_id ?? body.order_id ?? "unknown"),
      kind,
      slug,
      productName: label || undefined,
      amount: body.price_amount,
      currency: body.price_currency,
      buyer,
    });
  }

  return NextResponse.json({ received: true });
}
