import "server-only";
import { optionalEnv } from "@/lib/env";

/** Which env var(s) hold the chat id(s) a signal product grants access to.
 * The multi-asset pack reuses the same per-asset channels instead of a
 * separate combined one, plus its own EUR/USD channel. */
const SIGNAL_CHANNEL_ENV_VARS: Record<string, string[]> = {
  "signal-xauusd": ["TELEGRAM_CHANNEL_XAUUSD_ID"],
  "signal-btcusd": ["TELEGRAM_CHANNEL_BTCUSD_ID"],
  "signal-multi": [
    "TELEGRAM_CHANNEL_XAUUSD_ID",
    "TELEGRAM_CHANNEL_BTCUSD_ID",
    "TELEGRAM_CHANNEL_EURUSD_ID",
  ],
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
 * Creates one single-use invite link per Telegram channel a signal purchase
 * (kind: "signal") grants access to — one link for a single-asset pack,
 * three for the multi-asset pack. Skips (and logs) any channel whose env
 * var isn't set yet, rather than failing the whole purchase.
 */
export async function createSignalInviteLinks(slug: string): Promise<string[]> {
  const envVars = SIGNAL_CHANNEL_ENV_VARS[slug];
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
