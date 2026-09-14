import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Gauge,
  Wallet,
  Server,
  ShieldCheck,
  Waves,
  TrendingUp,
} from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { Section } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_EXNESS_REFERRAL_URL } from "@/lib/exness-link";

const benefitIcons = [Gauge, Wallet, Server, ShieldCheck, Waves, TrendingUp];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    title: t.exnessPage.hero.title,
    description: t.exnessPage.hero.subtitle,
  };
}

export default async function ExnessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const referralUrl =
    process.env.NEXT_PUBLIC_EXNESS_REFERRAL_URL || DEFAULT_EXNESS_REFERRAL_URL;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-[-20%] -z-10 h-80 w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" aria-hidden />
        <div className="container-page relative py-16 sm:py-24">
          <div className="max-w-2xl">
            <Badge variant="primary" className="mb-4">
              {t.home.exness.badge}
            </Badge>
            <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
              {t.exnessPage.hero.title}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
              {t.exnessPage.hero.subtitle}
            </p>
            <div className="mt-7">
              <Button asChild size="lg">
                <a
                  href={referralUrl}
                  target={referralUrl.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer nofollow sponsored"
                >
                  {t.exnessPage.cta}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.exnessPage.benefits.map((b, i) => {
            const Icon = benefitIcons[i] ?? Gauge;
            return (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="grid size-11 place-items-center rounded-lg bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <p className="mx-auto max-w-3xl rounded-xl border border-border bg-background/50 p-5 text-xs leading-relaxed text-muted-foreground">
          {t.exnessPage.disclaimer}
        </p>
      </Section>
    </>
  );
}
