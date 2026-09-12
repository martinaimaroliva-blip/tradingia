import "server-only";

/** What we need from the buyer to fulfil a bot/indicator order manually. */
export interface BuyerInfo {
  name: string;
  email: string;
  /** MT4/MT5 account number the bot must be compiled for. Bots only. */
  accountNumber?: string;
  /** Broker the account is with (e.g. Exness). Bots only. */
  broker?: string;
}

const MARKER = "|buyer:";

/**
 * Pack buyer info into the tail of a human-readable order description, so it
 * survives a round trip through a payment provider that doesn't have a
 * dedicated "customer" field (NOWPayments) — the provider just needs to echo
 * back whatever description string we gave it.
 */
export function encodeOrderDescription(
  label: string,
  buyer: BuyerInfo,
): string {
  const packed = Buffer.from(JSON.stringify(buyer), "utf8").toString(
    "base64url",
  );
  return `${label}${MARKER}${packed}`;
}

export function decodeOrderDescription(description: string | undefined): {
  label: string;
  buyer: BuyerInfo | null;
} {
  if (!description) return { label: "", buyer: null };
  const idx = description.indexOf(MARKER);
  if (idx === -1) return { label: description, buyer: null };

  const label = description.slice(0, idx);
  const packed = description.slice(idx + MARKER.length);
  try {
    const json = Buffer.from(packed, "base64url").toString("utf8");
    return { label, buyer: JSON.parse(json) as BuyerInfo };
  } catch {
    return { label, buyer: null };
  }
}
