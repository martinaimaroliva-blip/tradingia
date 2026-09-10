"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, Loader2 } from "lucide-react";
import { useI18n, useLocalePath } from "@/components/providers/i18n-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "tradingia_lead_v1";
const REOPEN_AFTER_MS = 1000 * 60 * 60 * 24 * 7; // 7 days after a dismissal
const TIME_TRIGGER_MS = 60_000;

type Status = "idle" | "loading" | "success" | "error";

function alreadyHandled(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as { state: string; at: number };
    if (data.state === "submitted") return true;
    if (data.state === "dismissed" && Date.now() - data.at < REOPEN_AFTER_MS)
      return true;
    return false;
  } catch {
    return false;
  }
}

function remember(state: "dismissed" | "submitted") {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state, at: Date.now() }),
    );
  } catch {
    /* ignore */
  }
}

export function LeadCaptureModal() {
  const { t, locale } = useI18n();
  const lp = useLocalePath();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");
  const armed = React.useRef(false);

  const trigger = React.useCallback(() => {
    if (armed.current) return;
    if (alreadyHandled()) return;
    armed.current = true;
    setOpen(true);
  }, []);

  React.useEffect(() => {
    if (alreadyHandled()) return;

    const timer = window.setTimeout(trigger, TIME_TRIGGER_MS);

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [trigger]);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next && status !== "success") remember("dismissed");
  }

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
          source: "exit_popup",
          path: pathname,
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
      remember("submitted");
      window.setTimeout(() => setOpen(false), 2600);
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <span className="mb-1 inline-flex size-10 items-center justify-center rounded-lg bg-accent/12 text-accent">
            <Gift className="size-5" />
          </span>
          <DialogTitle>{t.lead.title}</DialogTitle>
          <DialogDescription>{t.lead.subtitle}</DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-6 text-center text-sm text-accent">
            {t.lead.success}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="lead-name">{t.lead.name}</Label>
              <Input id="lead-name" name="name" required autoComplete="given-name" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lead-email">{t.lead.email}</Label>
              <Input
                id="lead-email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lead-phone">{t.lead.phone}</Label>
              <Input
                id="lead-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-destructive">{t.lead.error}</p>
            )}

            <Button
              type="submit"
              className="mt-1 w-full"
              variant="accent"
              disabled={status === "loading"}
            >
              {status === "loading" && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {status === "loading" ? t.lead.sending : t.lead.submit}
            </Button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              {t.lead.dismiss}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground/80">
              {t.lead.privacy}{" "}
              <Link
                href={lp("/legal/privacy")}
                className="underline underline-offset-2"
              >
                {t.footer.links.privacy}
              </Link>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
