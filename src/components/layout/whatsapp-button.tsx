"use client";

import { MessageCircle } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const { t, dir } = useI18n();

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label={t.contact.whatsappCta}
      className={`fixed bottom-5 ${
        dir === "rtl" ? "left-5" : "right-5"
      } z-50 flex size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105`}
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
