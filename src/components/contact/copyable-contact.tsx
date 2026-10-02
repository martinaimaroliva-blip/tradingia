"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function CopyableContact({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the value is still visible and selectable.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        {href ? (
          <a
            href={href}
            className="block break-all text-sm font-medium select-all hover:underline"
            dir="ltr"
          >
            {value}
          </a>
        ) : (
          <div className="break-all text-sm font-medium select-all" dir="ltr">
            {value}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs transition-colors hover:bg-secondary/60"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? t.contact.copied : t.contact.copy}
      </button>
    </div>
  );
}
