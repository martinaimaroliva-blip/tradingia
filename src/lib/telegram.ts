import "server-only";
import { optionalEnv } from "@/lib/env";

/** Which env var(s) hold the chat id(s) a product grants access to, keyed
 * by slug — works for any product kind, not just signals. The multi-asset
 * signal pack reuses the per-asset channels instead of a separate combined
 * one; ZIZA grants its own bot-owners follow-up group. */
const PRODUCT_CHANNEL_ENV_VARS: Record<string, string[]> = {
  "signal-xauusd": ["TELEGRAM_CHANNEL_XAUUSD_ID"],
  "signal-btcusd": ["TELEGRAM_CHANNEL_BTCUSD_ID"],
  "signal-multi": [
    "TELEGRAM_CHANNEL_XAUUSD_ID",
    "TELEGRAM_CHANNEL_BTCUSD_ID",
    "TELEGRAM_CHANNEL_EURUSD_ID",
  ],
  ziza: ["TELEGRAM_CHANNEL_ZIZA_ID"],
};

/**
 * Creates a single-use Telegram invite link (member_limit: 1, so it can be
 * emailed safely — it stops working after the first person joins with it,
 * per Telegram's own Bot API) to the given chat.
 *
 * Returns null when TELEGRAM_BOT_TOKEN or the chat id aren't set, so callers
 * can fall back to the generic delivery copy.
 */
async function createChatInviteLink(chatId: string): Promise<string | null> {
  const token = optionalEnv("TELEGRAM_BOT_TOKEN");
  if (!token) return null;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/createChatInviteLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, member_limit: 1 }),
      },
    );
    if (!res.ok) {
      console.error(
        "[telegram] createChatInviteLink failed",
        res.status,
        await res.text(),
      );
      return null;
    }
    const data = (await res.json()) as {
      ok: boolean;
      result?: { invite_link?: string };
    };
    return data.result?.invite_link ?? null;
  } catch (err) {
    console.error("[telegram] request error", err);
    return null;
  }
}

/**
 * Creates one single-use invite link per Telegram channel a purchased
 * product (by slug) grants access to. Returns [] for a slug with no
 * mapping — that's the normal case for most products, not an error. Skips
 * (and logs) any individual channel whose env var isn't set yet, rather
 * than failing the whole purchase.
 */
export async function createChannelInviteLinks(slug: string): Promise<string[]> {
  const envVars = PRODUCT_CHANNEL_ENV_VARS[slug];
  if (!envVars) return [];

  const links: string[] = [];
  for (const envVar of envVars) {
    const chatId = optionalEnv(envVar);
    if (!chatId) {
      console.info(`[telegram] ${envVar} not set — skipping that channel`);
      continue;
    }
    const link = await createChatInviteLink(chatId);
    if (link) links.push(link);
  }
  return links;
}
