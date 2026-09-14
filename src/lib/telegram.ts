import "server-only";
import { optionalEnv } from "@/lib/env";

/**
 * Creates a single-use Telegram invite link to the private signals channel
 * (member_limit: 1, so it can be emailed safely — it stops working after
 * the first person joins with it, per Telegram's own Bot API).
 *
 * Returns null when TELEGRAM_BOT_TOKEN/TELEGRAM_SIGNALS_CHANNEL_ID aren't
 * set, so fulfilPurchase can fall back to the generic delivery copy.
 */
export async function createSignalsInviteLink(): Promise<string | null> {
  const token = optionalEnv("TELEGRAM_BOT_TOKEN");
  const chatId = optionalEnv("TELEGRAM_SIGNALS_CHANNEL_ID");
  if (!token || !chatId) return null;

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
