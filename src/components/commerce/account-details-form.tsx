"use client";

import * as React from "react";
import { Loader2, ServerCog } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "loading" | "success" | "error";

export function AccountDetailsForm({
  defaultEmail,
}: {
  defaultEmail?: string;
}) {
  const { t } = useI18n();
  const [status, setStatus] = React.useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    try {
      const res = await fetch("/api/orders/account-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          accountNumber: String(data.get("accountNumber") ?? ""),
          server: String(data.get("server") ?? ""),
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-8 w-full rounded-xl border border-border bg-card p-6 text-start">
      <div className="flex items-center gap-2 font-medium">
        <ServerCog className="size-4 text-primary" />
        {t.checkout.accountForm.title}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {t.checkout.accountForm.subtitle}
      </p>

      {status === "success" ? (
        <p className="mt-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          {t.checkout.accountForm.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="ad-email">{t.contact.form.email}</Label>
            <Input
              id="ad-email"
              name="email"
              type="email"
              required
              defaultValue={defaultEmail}
              autoComplete="email"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="ad-account">{t.checkout.accountForm.accountNumber}</Label>
              <Input id="ad-account" name="accountNumber" required inputMode="numeric" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ad-server">{t.checkout.accountForm.server}</Label>
              <Input id="ad-server" name="server" required />
            </div>
          </div>

          {status === "error" && (
            <p className="text-sm text-destructive">{t.checkout.accountForm.error}</p>
          )}

          <Button type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" && <Loader2 className="size-4 animate-spin" />}
            {status === "loading"
              ? t.checkout.accountForm.sending
              : t.checkout.accountForm.submit}
          </Button>
        </form>
      )}
    </div>
  );
}
