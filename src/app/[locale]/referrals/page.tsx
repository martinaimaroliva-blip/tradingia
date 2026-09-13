import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Link2, MessageSquareText, Share2, Layers, TrendingUp } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Faq } from "@/components/marketing/faq";
import { ReferralForm } from "@/components/referrals/referral-form";
import { DEFAULT_EXNESS_REFERRAL_URL } from "@/lib/exness-link";

const howIcons = [Link2, MessageSquareText, Share2];
const earnIcons = [Layers, TrendingUp];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    title: t.referrals.hero.title,
    description: t.referrals.hero.subtitle,
  };
}

export default async function ReferralsPage({
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
              {t.referrals.hero.badge}
            </Badge>
            <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
              {t.referrals.hero.title}{" "}
              <span className="text-gradient">{t.referrals.hero.titleHighlight}</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
              {t.referrals.hero.subtitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={referralUrl} target="_blank" rel="noreferrer nofollow sponsored">
                  {t.referrals.hero.ctaPrimary}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#partner-form">{t.referrals.hero.ctaSecondary}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          title={t.referrals.how.title}
          subtitle={t.referrals.how.subtitle}
          align="start"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {t.referrals.how.steps.map((step, i) => {
            const Icon = howIcons[i];
            return (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <SectionHeading title={t.referrals.earn.title} subtitle={t.referrals.earn.subtitle} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {t.referrals.earn.items.map((item, i) => {
            const Icon = earnIcons[i];
            return (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <span className="grid size-11 place-items-center rounded-lg bg-accent/12 text-accent">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="partner-form">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">{t.referrals.form.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              {t.referrals.form.subtitle}
            </p>
            <div className="mt-6 rounded-xl border border-border bg-card/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.referrals.hero.ctaPrimary}
              </p>
              <a
                href={referralUrl}
                target="_blank"
                rel="noreferrer nofollow sponsored"
                className="mt-2 block truncate text-sm text-primary underline underline-offset-2"
              >
                {referralUrl}
              </a>
            </div>
          </div>
          <div>
            <ReferralForm />
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-card/30">
        <SectionHeading title={t.referrals.faq.title} />
        <div className="mt-10">
          <Faq items={t.referrals.faq.items} />
        </div>
      </Section>

      <Section>
        <p className="mx-auto max-w-3xl rounded-xl border border-border bg-background/50 p-5 text-xs leading-relaxed text-muted-foreground">
          {t.referrals.disclaimer}
        </p>
      </Section>
    </>
  );
}
