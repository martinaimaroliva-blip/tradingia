/**
 * The canonical WhatsApp business number. It's public by nature (meant to be
 * shared everywhere), so it's safe to commit — no need to configure it in
 * Vercel for the site to work correctly out of the box.
 *
 * Override it via NEXT_PUBLIC_WHATSAPP_URL only if you need to swap it later
 * (a different number, a campaign-specific prefilled message, etc.).
 */
export const DEFAULT_WHATSAPP_URL =
  "https://wa.me/5493413373443?text=" +
  encodeURIComponent("Hola! Tengo una consulta sobre los bots de SmartradeBot.");

export function whatsappUrl(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_URL || DEFAULT_WHATSAPP_URL;
}
