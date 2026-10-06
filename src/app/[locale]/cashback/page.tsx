import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  Check,
  MessageCircleQuestion,
  Percent,
  Zap,
} from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { DEFAULT_EXNESS_REFERRAL_URL } from "@/lib/exness-link";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Faq } from "@/components/marketing/faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const factIcons = [Percent, CalendarDays, Zap];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return { title: t.cashback.hero.title, description: t.cashback.hero.subtitle };
}

export default async function CashbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = await getDictionary(l);
  const c = t.cashback;
  const lp = (p: string) => `/${l}${p}`;
  const referralUrl =
    process.env.NEXT_PUBLIC_EXNESS_REFERRAL_URL || DEFAULT_EXNESS_REFERRAL_URL;

  const registerButton = (
    <Button asChild size="lg">
      <a href={referralUrl} target="_blank" rel="noopener noreferrer sponsored">
        {c.cta}
      </a>
    </Button>
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-grid opacity-60"
          aria-hidden
        />
        <div className="container-page py-14 sm:py-20">
          <Badge variant="primary">{c.hero.eyebrow}</Badge>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold sm:text-5xl">
            {c.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
            {c.hero.subtitle}
          </p>
          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {c.facts.map((fact, i) => {
              const Icon = factIcons[i] ?? Percent;
              return (
                <div
                  key={fact.label}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground">{fact.label}</div>
                    <div className="text-sm font-medium">{fact.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {registerButton}
            <Button asChild variant="outline" size="lg">
              <Link href={lp("/contact")}>
                <MessageCircleQuestion className="size-4" />
                {c.ctaSecondary}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading title={c.howTitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {c.how.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-secondary text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-3xl rounded-xl border border-primary/30 bg-primary/[0.05] p-6 sm:p-8">
          <h2 className="text-xl font-semibold">{c.noBuyTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {c.noBuyBody}
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href={lp("/bots")}>{c.noBuyCta}</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeading title={c.joinTitle} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">{c.joinNewTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {c.joinNewBody}
            </p>
            <div className="mt-5">{registerButton}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">{c.joinSwitchTitle}</h3>
            <ol className="mt-3 space-y-2.5">
              {c.joinSwitchSteps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed text-foreground/90">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">{c.joinSwitchNote}</p>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-3xl">
          <h2 className="flex items-center gap-2.5 text-xl font-semibold">
            <AlertCircle className="size-5 text-primary" />
            {c.knowTitle}
          </h2>
          <ul className="mt-5 space-y-3">
            {c.know.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <SectionHeading title={c.faqTitle} />
        <div className="mt-12">
          <Faq items={c.faq} />
        </div>
        <div className="mt-10 flex justify-center">{registerButton}</div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          {c.disclaimer}
        </p>
      </Section>
    </>
  );
}
