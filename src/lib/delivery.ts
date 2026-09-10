import "server-only";

export interface FulfilmentInput {
  provider: "stripe" | "nowpayments";
  reference: string;
  kind?: string;
  slug?: string;
  email?: string;
  amount?: number;
  currency?: string;
  locale?: string;
}

/**
 * Provision access after a confirmed payment.
 *
 * TODO (phase 2):
 *  - bots / indicators: email the license file + manual (Resend / SES) and
 *    register the license against the buyer's account number.
 *  - signals: create a single-use Telegram invite link for the private channel
 *    and email it; schedule removal when the subscription lapses.
 *  - push the order into systeme.io as a "customer" tag to move them to the
 *    post-purchase email sequence.
 *
 * For now we log so the webhook wiring can be verified end-to-end.
 */
export async function fulfilPurchase(input: FulfilmentInput): Promise<void> {
  console.info("[delivery] fulfilment requested", {
    provider: input.provider,
    reference: input.reference,
    kind: input.kind,
    slug: input.slug,
    email: input.email,
    amount: input.amount,
    currency: input.currency,
  });
}
