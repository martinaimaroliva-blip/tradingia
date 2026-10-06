import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarClock,
  Check,
  ExternalLink,
  MessageCircleQuestion,
  Video,
  Repeat,
  Hourglass,
} from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { getProduct } from "@/lib/products";
import { formatUSD } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Faq } from "@/components/marketing/faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BuyDialog } from "@/components/commerce/buy-dialog";

const MENTORING_SLUG = "mentoria-xauusd";
const MENTOR_SITE = "https://www.elprofexau.com/";
const factIcons = [Video, Repeat, Hourglass];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return { title: t.mentoring.hero.title, description: t.mentoring.hero.subtitle };
}

export default async function MentoringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = await getDictionary(l);
  const m = t.mentoring;
  const product = getProduct(MENTORING_SLUG);
  if (!product) notFound();
  const lp = (p: string) => `/${l}${p}`;

  const buyButton = (
    <BuyDialog
      slug={product.slug}
      kind={product.kind}
      label={m.buyCta}
      priceUSD={product.priceUSD}
      exnessPriceUSD={product.exnessPriceUSD}
      block
    />
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-grid opacity-60"
          aria-hidden
        />
        <div className="container-page py-14 sm:py-20">
          <Badge variant="primary">{m.hero.eyebrow}</Badge>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold sm:text-5xl">
            {m.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
            {m.hero.subtitle}
          </p>
          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {m.facts.map((fact, i) => {
              const Icon = factIcons[i] ?? Video;
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
            <div className="sm:w-64">{buyButton}</div>
            <Button asChild variant="outline" size="lg">
              <Link href={lp("/contact?topic=other")}>
                <MessageCircleQuestion className="size-4" />
                {m.contactCta}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading title={m.forWhomTitle} />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          {m.forWhom.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-accent" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <SectionHeading title={m.learnTitle} subtitle={m.learnSubtitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {m.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
              <ul className="mt-4 space-y-2.5">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title={m.planTitle} subtitle={m.planSubtitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {m.plan.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-border bg-card p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
          {m.planNote}
        </p>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <SectionHeading title={m.howTitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {m.how.map((step, i) => (
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

      <Section>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {m.mentorTitle}
            </span>
            <h2 className="mt-2 text-2xl font-semibold">{m.mentorName}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {m.mentorBody}
            </p>
            <ul className="mt-5 space-y-2.5">
              {m.mentorPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-foreground/90">{point}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-6">
              <a href={MENTOR_SITE} target="_blank" rel="noopener noreferrer">
                {m.mentorCta}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/[0.05] p-6 sm:p-8">
            <h2 className="text-lg font-semibold">{m.priceTitle}</h2>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-semibold">
                {formatUSD(product.priceUSD, l)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{m.priceNote}</p>
            <ul className="mt-5 space-y-2.5">
              {m.priceIncludes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">{buyButton}</div>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link href={lp("/contact?topic=other")}>
                <CalendarClock className="size-4" />
                {m.contactCta}
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-card/30">
        <SectionHeading title={m.faqTitle} />
        <div className="mt-12">
          <Faq items={m.faq} />
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
          {m.disclaimer}
        </p>
      </Section>
    </>
  );
}
