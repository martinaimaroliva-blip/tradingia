import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { optionalEnv } from "@/lib/env";
import { getMercadoPagoAccessToken } from "@/lib/payments";
import { fulfilPurchase } from "@/lib/delivery";
import { decodeOrderDescription, type BuyerInfo } from "@/lib/orders";

export const runtime = "nodejs";

/**
 * Verifies Mercado Pago's webhook signature (`x-signature` /
 * `x-request-id` headers, manifest "id:<id>;request-id:<req-id>;ts:<ts>;"
 * signed with HMAC-SHA256 using MERCADOPAGO_WEBHOOK_SECRET). This follows
 * Mercado Pago's documented scheme as of writing — re-check it against
 * their current docs if verification starts failing, since providers
 * occasionally tweak the manifest format.
 */
function isValidSignature(
  request: Request,
  dataId: string,
  secret: string,
): boolean {
  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k?.trim(), v?.trim()];
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  return (
    expected.length === v1.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
  );
}

export async function POST(request: Request) {
  const accessToken = getMercadoPagoAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "mercadopago_not_configured" },
      { status: 501 },
    );
  }

  const url = new URL(request.url);
  let body: { type?: string; data?: { id?: string } } = {};
  try {
    body = await request.json();
  } catch {
    /* Mercado Pago also sends notifications as query params only. */
  }

  const type = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = body.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");

  if (type !== "payment" || !dataId) {
    return NextResponse.json({ received: true });
  }

  const webhookSecret = optionalEnv("MERCADOPAGO_WEBHOOK_SECRET");
  if (webhookSecret && !isValidSignature(request, dataId, webhookSecret)) {
    console.error("[mercadopago] invalid webhook signature");
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      console.error("[mercadopago] payment lookup failed", res.status);
      return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
    }

    const payment = (await res.json()) as {
      status?: string;
      external_reference?: string;
      transaction_amount?: number;
      currency_id?: string;
      payer?: { email?: string };
    };

    if (payment.status === "approved") {
      const [kind, slug] = (payment.external_reference ?? "").split("_");
      const { data: buyer } = decodeOrderDescription<
        BuyerInfo & { productName?: string }
      >(payment.external_reference);

      await fulfilPurchase({
        provider: "mercadopago",
        reference: dataId,
        kind,
        slug,
        productName: buyer?.productName,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        buyer: buyer
          ? { name: buyer.name, email: buyer.email || payment.payer?.email || "" }
          : payment.payer?.email
            ? { name: "", email: payment.payer.email }
            : null,
      });
    }
  } catch (err) {
    console.error("[mercadopago] handler error", err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
