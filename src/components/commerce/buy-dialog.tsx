"use client";

import * as React from "react";
import { CreditCard, Bitcoin, Loader2, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Method = "card" | "crypto";

export function BuyDialog({
  slug,
  kind,
  label,
  size = "lg",
  variant = "default",
  className,
  block = true,
}: {
  slug: string;
  kind: "bot" | "indicator" | "signal";
  label: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
  block?: boolean;
}) {
  const { t, locale } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [method, setMethod] = React.useState<Method>("card");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  async function checkout() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, kind, method, locale }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "checkout failed");
      window.location.href = data.url;
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  const options: { id: Method; icon: React.ReactNode; title: string; hint: string }[] =
    [
      {
        id: "card",
        icon: <CreditCard className="size-5" />,
        title: t.checkout.dialog.card,
        hint: t.checkout.dialog.cardHint,
      },
      {
        id: "crypto",
        icon: <Bitcoin className="size-5" />,
        title: t.checkout.dialog.crypto,
        hint: t.checkout.dialog.cryptoHint,
      },
    ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size={size}
        variant={variant}
        className={cn(block && "w-full", className)}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.checkout.dialog.title}</DialogTitle>
          <DialogDescription>{t.checkout.dialog.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2.5">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMethod(opt.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3.5 text-start transition-colors",
                method === opt.id
                  ? "border-primary/60 bg-primary/10"
                  : "border-border hover:bg-secondary/50",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-md",
                  method === opt.id
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {opt.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{opt.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {opt.hint}
                </span>
              </span>
              <span
                className={cn(
                  "ms-auto size-4 shrink-0 rounded-full border-2",
                  method === opt.id
                    ? "border-primary bg-primary"
                    : "border-border",
                )}
              />
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-destructive">{t.checkout.dialog.error}</p>
        )}

        <Button onClick={checkout} disabled={loading} className="w-full">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? t.checkout.dialog.processing : t.checkout.dialog.continue}
        </Button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3.5" /> {t.common.securePayment}
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap className="size-3.5" /> {t.common.instantAccess}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
