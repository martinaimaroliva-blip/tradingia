import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { optionalEnv } from "@/lib/env";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const user = optionalEnv("ZOHO_SMTP_USER");
  const pass = optionalEnv("ZOHO_SMTP_PASS");
  if (!user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: optionalEnv("ZOHO_SMTP_HOST") ?? "smtp.zoho.com",
      port: Number(optionalEnv("ZOHO_SMTP_PORT") ?? 465),
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Send a transactional email via Zoho Mail SMTP.
 *
 * If ZOHO_SMTP_USER/ZOHO_SMTP_PASS aren't set, this logs instead of sending
 * so the rest of the checkout flow still works before email is configured.
 */
export async function sendMail(input: SendMailInput): Promise<boolean> {
  const from = optionalEnv("ZOHO_FROM_EMAIL") ?? optionalEnv("ZOHO_SMTP_USER");
  const client = getTransporter();

  if (!client || !from) {
    console.info("[email] ZOHO_SMTP_USER/PASS not set — email not sent", {
      to: input.to,
      subject: input.subject,
    });
    return false;
  }

  try {
    await client.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    });
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}
