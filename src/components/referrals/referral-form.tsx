"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "loading" | "success" | "error";

export function ReferralForm() {
  const { t, locale } = useI18n();
  const [status, setStatus] = React.useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          locale,
          source: "referral_partner_interest",
          topic: "referrals",
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-sm text-accent">
        {t.referrals.form.success}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="ref-name">{t.contact.form.name}</Label>
          <Input id="ref-name" name="name" required autoComplete="name" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ref-email">{t.contact.form.email}</Label>
          <Input id="ref-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ref-phone">{t.contact.form.phone}</Label>
        <Input id="ref-phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{t.referrals.form.error}</p>
      )}

      <Button type="submit" disabled={status === "loading"} className="justify-self-start">
        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
        {status === "loading" ? t.referrals.form.sending : t.referrals.form.submit}
      </Button>
    </form>
  );
}
