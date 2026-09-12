import "server-only";

/** Who's buying — captured before payment, for both delivery and remarketing. */
export interface BuyerInfo {
  name: string;
  email: string;
}

/** Which price tier they were shown/chose — bots & indicators only. */
export type PriceChoice = "standard" | "exness";

/** The MT4/MT5 details we ask for once the payment is confirmed. */
export interface AccountDetails {
  email: string;
  accountNumber: string;
  server: string;
}

const MARKER = "|data:";

/**
 * Pack arbitrary order data into the tail of a human-readable description,
 * so it survives a round trip through a payment provider that doesn't have
 * a dedicated "customer" field (NOWPayments) — the provider just needs to
 * echo back whatever description string we gave it.
 */
export function encodeOrderDescription<T>(label: string, data: T): string {
  const packed = Buffer.from(JSON.stringify(data), "utf8").toString(
    "base64url",
  );
  return `${label}${MARKER}${packed}`;
}

export function decodeOrderDescription<T>(
  description: string | undefined,
): { label: string; data: T | null } {
  if (!description) return { label: "", data: null };
  const idx = description.indexOf(MARKER);
  if (idx === -1) return { label: description, data: null };

  const label = description.slice(0, idx);
  const packed = description.slice(idx + MARKER.length);
  try {
    const json = Buffer.from(packed, "base64url").toString("utf8");
    return { label, data: JSON.parse(json) as T };
  } catch {
    return { label, data: null };
  }
}
