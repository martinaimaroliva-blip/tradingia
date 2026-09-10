import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, Mail, Send } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return { title: t.contact.hero.title, description: t.contact.hero.subtitle };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  const meetUrl = process.env.NEXT_PUBLIC_MEET_URL || "#";
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "#";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com";

  return (
    <>
      <section className="border-b border-border">
        <div className="container-page py-14 sm:py-16">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {t.contact.hero.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {t.contact.hero.subtitle}
          </p>
        </div>
      </section>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_340px] lg:py-16">
        <div className="min-w-0">
          <ContactForm />
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 font-medium">
              <CalendarClock className="size-4 text-primary" />
              {t.contact.schedule.title}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t.contact.schedule.description}
            </p>
            <Button asChild className="mt-4 w-full">
              <a
                href={meetUrl}
                target={meetUrl.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                {t.contact.schedule.cta}
              </a>
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold">{t.contact.directTitle}</h2>
            <div className="mt-3 space-y-2">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary/60"
              >
                <Send className="size-4 text-primary" />
                {t.contact.telegramCta}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary/60"
              >
                <Mail className="size-4 text-primary" />
                {t.contact.emailCta}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
