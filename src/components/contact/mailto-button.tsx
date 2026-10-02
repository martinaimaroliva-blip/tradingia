"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function MailtoButton({ email }: { email: string }) {
  const { t } = useI18n();
  const [fallback, setFallback] = React.useState(false);

  function onClick() {
    // If a mail app opens, the page loses focus; if nothing happens, the
    // visitor has no mail handler — copy the address and say so.
    setFallback(false);
    setTimeout(async () => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        try {
          await navigator.clipboard.writeText(email);
        } catch {
          // Clipboard blocked — the address is still shown in the message.
        }
        setFallback(true);
      }
    }, 1200);
  }

  return (
    <div>
      <a
        href={`mailto:${email}`}
        onClick={onClick}
        className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary/60"
      >
        <Mail className="size-4 text-primary" />
        {t.contact.emailCta}
      </a>
      {fallback && (
        <p
          role="status"
          className="mt-2 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground"
        >
          {t.contact.emailFallback}{" "}
          <span dir="ltr" className="font-medium text-foreground select-all">
            {email}
          </span>
        </p>
      )}
    </div>
  );
}
