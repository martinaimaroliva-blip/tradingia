"use client";

import * as React from "react";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_EXNESS_REFERRAL_URL } from "@/lib/exness-link";

type Status = "idle" | "loading" | "success" | "not_affiliated" | "error";

export function ActivateForm() {
  const { t, locale } = useI18n();
  const [status, setStatus] = React.useState<Status>("idle");
  const [link, setLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const referralUrl =
    process.env.NEXT_PUBLIC_EXNESS_REFERRAL_URL || DEFAULT_EXNESS_REFERRAL_URL;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    try {
      const res = await fetch("/api/referrals/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          locale,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        link?: string;
        error?: string;
      };
      if (res.ok && body.link) {
        setLink(body.link);
        setStatus("success");
      } else if (body.error === "not_affiliated") {
        setStatus("not_affiliated");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable — link is still selectable */
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-6">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-accent">
          <Sparkles className="size-4" />
          {t.referrals.activate.success}
        </div>
        <div className="mt-3 flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background/60 p-2.5">
          <span className="min-w-0 flex-1 truncate text-xs text-foreground">
            {link}
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium transition-colors hover:bg-secondary"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-accent" /> {t.checkout.exness.copied}
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> {t.checkout.exness.copy}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="act-name">{t.contact.form.name}</Label>
        <Input id="act-name" name="name" required autoComplete="name" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="act-email">{t.referrals.activate.emailLabel}</Label>
        <Input id="act-email" name="email" type="email" required autoComplete="email" />
        <p className="text-xs text-muted-foreground">{t.referrals.activate.emailHint}</p>
      </div>

      {status === "not_affiliated" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <p>{t.referrals.activate.notAffiliated}</p>
          <a
            href={referralUrl}
            target="_blank"
            rel="noreferrer nofollow sponsored"
            className="mt-1.5 inline-block underline underline-offset-2"
          >
            {t.referrals.hero.ctaPrimary}
          </a>
        </div>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{t.referrals.activate.error}</p>
      )}

      <Button type="submit" disabled={status === "loading"} className="justify-self-start">
        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
        {status === "loading" ? t.referrals.activate.sending : t.referrals.activate.submit}
      </Button>
    </form>
  );
}
