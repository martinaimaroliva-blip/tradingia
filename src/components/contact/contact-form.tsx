"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
  const { t, locale } = useI18n();
  const [status, setStatus] = React.useState<Status>("idle");
  const [topic, setTopic] = React.useState(defaultTopic ?? "bots");

  const topicOptions = [
    { value: "bots", label: t.contact.form.topics.bots },
    { value: "indicators", label: t.contact.form.topics.indicators },
    { value: "signals", label: t.contact.form.topics.signals },
    { value: "payment", label: t.contact.form.topics.payment },
    { value: "other", label: t.contact.form.topics.other },
  ];

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
          message: String(data.get("message") ?? ""),
          topic,
          locale,
          source: "contact_form",
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
      form.reset();
      setTopic(defaultTopic ?? "bots");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-sm text-accent">
        {t.contact.form.success}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">{t.contact.form.name}</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="email">{t.contact.form.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">{t.contact.form.phone}</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="topic">{t.contact.form.topic}</Label>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger id="topic">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {topicOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="message">{t.contact.form.message}</Label>
        <Textarea id="message" name="message" required rows={5} />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{t.contact.form.error}</p>
      )}

      <Button type="submit" disabled={status === "loading"} className="justify-self-start">
        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
        {status === "loading" ? t.contact.form.sending : t.contact.form.submit}
      </Button>
    </form>
  );
}
